import { Injectable, BadRequestException, ConflictException, UnprocessableEntityException } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import { AuditService } from "../../core/audit/audit.service";
import { OrderStatus } from "@prisma/client";

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async create(data: { clienteId: string; items: { produtoId: string; quantidade: number }[]; enderecoEntrega?: string }) {
    const produtos = await this.prisma.product.findMany({
      where: { id: { in: data.items.map((i) => i.produtoId) }, ativo: true },
    });

    for (const item of data.items) {
      const produto = produtos.find((p) => p.id === item.produtoId);
      if (!produto) throw new BadRequestException(`Produto ${item.produtoId} não encontrado`);
      if (produto.estoque < item.quantidade) {
        throw new ConflictException(`Estoque insuficiente para ${produto.nome}`);
      }
    }

    const numero = `ORD-${Date.now()}`;

    const order = await this.prisma.order.create({
      data: {
        numero,
        clienteId: data.clienteId,
        enderecoEntrega: data.enderecoEntrega,
        items: {
          create: data.items.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: produtos.find((p) => p.id === item.produtoId)!.preco,
          })),
        },
      },
      include: { items: true, customer: true },
    });

    await this.audit.log({
      acao: "ORDER_CREATED",
      entidade: "Order",
      entidadeId: order.id,
      payload: { numero: order.numero, items: data.items },
    });

    return order;
  }

  async findAll(clienteId?: string) {
    const where = clienteId ? { clienteId } : {};
    return this.prisma.order.findMany({
      where,
      include: { items: { include: { product: true } }, payments: true, customer: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, payments: true, customer: true },
    });
  }

  async updateStatus(id: string, novoStatus: OrderStatus, userId?: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new BadRequestException("Pedido não encontrado");

    const allowed = VALID_TRANSITIONS[order.status as OrderStatus];
    if (!allowed || !allowed.includes(novoStatus as OrderStatus)) {
      if (order.status === "DELIVERED" && novoStatus === "CANCELLED") {
        throw new UnprocessableEntityException("Não é possível cancelar um pedido entregue");
      }
      throw new BadRequestException(`Transição inválida: ${order.status} → ${novoStatus}`);
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: { status: novoStatus },
    });

    await this.audit.log({
      userId,
      acao: "ORDER_STATUS_CHANGED",
      entidade: "Order",
      entidadeId: id,
      payload: { de: order.status, para: novoStatus },
    });

    return updated;
  }

  async cancel(id: string, userId?: string) {
    return this.updateStatus(id, "CANCELLED", userId);
  }
}
