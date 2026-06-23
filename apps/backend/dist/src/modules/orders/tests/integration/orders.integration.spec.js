"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const orders_service_1 = require("../../orders.service");
const payments_service_1 = require("../../../payments/payments.service");
const prisma_service_1 = require("../../../../core/database/prisma.service");
const audit_service_1 = require("../../../../core/audit/audit.service");
describe("Orders + Payments integration", () => {
    let ordersService;
    let paymentsService;
    let prisma;
    beforeEach(async () => {
        prisma = {
            product: { findMany: jest.fn() },
            order: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
            payment: { create: jest.fn() },
            auditLog: { create: jest.fn() },
            $transaction: jest.fn((fn) => fn(prisma)),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                orders_service_1.OrdersService,
                payments_service_1.PaymentsService,
                { provide: prisma_service_1.PrismaService, useValue: prisma },
                { provide: audit_service_1.AuditService, useValue: { log: jest.fn() } },
            ],
        }).compile();
        ordersService = module.get(orders_service_1.OrdersService);
        paymentsService = module.get(payments_service_1.PaymentsService);
    });
    it("deve criar pedido e registrar pagamento (fluxo completo)", async () => {
        prisma.product.findMany.mockResolvedValue([
            { id: "prod-1", nome: "Pizza", preco: 39.9, estoque: 10, ativo: true },
        ]);
        prisma.order.create.mockResolvedValue({ id: "order-1", numero: "ORD-123", status: "PENDING" });
        prisma.order.findUnique.mockResolvedValue({ id: "order-1", status: "PENDING" });
        prisma.payment.create.mockResolvedValue({ id: "pay-1", valor: 39.9, metodo: "PIX", status: "APPROVED" });
        prisma.order.update.mockResolvedValue({ id: "order-1", status: "CONFIRMED" });
        const order = await ordersService.create({
            clienteId: "cli-1",
            items: [{ produtoId: "prod-1", quantidade: 2 }],
        });
        expect(order.status).toBe("PENDING");
        const payment = await paymentsService.create("order-1", { valor: 39.9, metodo: "PIX" }, "admin-1");
        expect(payment.status).toBe("APPROVED");
        expect(prisma.order.update).toHaveBeenCalledWith(expect.objectContaining({ data: { status: "CONFIRMED" } }));
    });
    it("deve rejeitar pagamento em pedido inexistente", async () => {
        prisma.order.findUnique.mockResolvedValue(null);
        await expect(paymentsService.create("order-x", { valor: 10, metodo: "PIX" })).rejects.toThrow(common_1.BadRequestException);
    });
    it("deve rejeitar criar pedido com estoque insuficiente", async () => {
        prisma.product.findMany.mockResolvedValue([
            { id: "prod-1", nome: "Pizza", preco: 39.9, estoque: 1, ativo: true },
        ]);
        await expect(ordersService.create({ clienteId: "cli-1", items: [{ produtoId: "prod-1", quantidade: 99 }] })).rejects.toThrow(common_1.ConflictException);
    });
});
//# sourceMappingURL=orders.integration.spec.js.map