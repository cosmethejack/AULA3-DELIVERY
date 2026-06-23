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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
const audit_service_1 = require("../../core/audit/audit.service");
let PaymentsService = class PaymentsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async create(pedidoId, data, userId) {
        const order = await this.prisma.order.findUnique({ where: { id: pedidoId } });
        if (!order)
            throw new common_1.BadRequestException("Pedido não encontrado");
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map