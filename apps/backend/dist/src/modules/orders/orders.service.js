"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
const audit_service_1 = require("../../core/audit/audit.service");
const VALID_TRANSITIONS = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PREPARING", "CANCELLED"],
    PREPARING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
    DELIVERED: [],
    CANCELLED: [],
};
let OrdersService = class OrdersService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async create(data) {
        const produtos = await this.prisma.product.findMany({
            where: { id: { in: data.items.map((i) => i.produtoId) }, ativo: true },
        });
        for (const item of data.items) {
            const produto = produtos.find((p) => p.id === item.produtoId);
            if (!produto)
                throw new common_1.BadRequestException(`Produto ${item.produtoId} não encontrado`);
            if (produto.estoque < item.quantidade) {
                throw new common_1.ConflictException(`Estoque insuficiente para ${produto.nome}`);
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
                        precoUnitario: produtos.find((p) => p.id === item.produtoId).preco,
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
    async findAll(clienteId) {
        const where = clienteId ? { clienteId } : {};
        return this.prisma.order.findMany({
            where,
            include: { items: { include: { product: true } }, payments: true, customer: true },
            orderBy: { createdAt: "desc" },
        });
    }
    async findOne(id) {
        return this.prisma.order.findUnique({
            where: { id },
            include: { items: { include: { product: true } }, payments: true, customer: true },
        });
    }
    async updateStatus(id, novoStatus, userId) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.BadRequestException("Pedido não encontrado");
        const allowed = VALID_TRANSITIONS[order.status];
        if (!allowed || !allowed.includes(novoStatus)) {
            if (order.status === "DELIVERED" && novoStatus === "CANCELLED") {
                throw new common_1.UnprocessableEntityException("Não é possível cancelar um pedido entregue");
            }
            throw new common_1.BadRequestException(`Transição inválida: ${order.status} → ${novoStatus}`);
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
    async cancel(id, userId) {
        return this.updateStatus(id, "CANCELLED", userId);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map