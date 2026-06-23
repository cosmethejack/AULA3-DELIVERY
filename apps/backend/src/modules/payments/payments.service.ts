import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import { AuditService } from "../../core/audit/audit.service";
import { PaymentMethod } from "@prisma/client";

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async create(pedidoId: string, data: { valor: number; metodo: PaymentMethod; observacao?: string }, userId?: string) {
    const order = await this.prisma.order.findUnique({ where: { id: pedidoId } });
    if (!order) throw new BadRequestException("Pedido não encontrado");

    const payment = await this.prisma.payment.create({
      data: {
        pedidoId,
        valor: data.valor,
        metodo: data.metodo,
        status: "APPROVED",
        observacao: data.observacao,
      },
    });

    await this.prisma.order.update({
      where: { id: pedidoId },
      data: { status: "CONFIRMED" },
    });

    await this.audit.log({
      userId,
      acao: "PAYMENT_REGISTERED",
      entidade: "Payment",
      entidadeId: payment.id,
      payload: { pedidoId, valor: data.valor, metodo: data.metodo },
    });

    return payment;
  }
}
