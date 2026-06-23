"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const payments_service_1 = require("../payments.service");
const prisma_service_1 = require("../../../core/database/prisma.service");
const audit_service_1 = require("../../../core/audit/audit.service");
describe("PaymentsService", () => {
    let service;
    let prisma;
    let audit;
    beforeEach(async () => {
        prisma = {
            order: { findUnique: jest.fn(), update: jest.fn() },
            payment: { create: jest.fn() },
            auditLog: { create: jest.fn() },
            $transaction: jest.fn((fn) => fn(prisma)),
        };
        audit = { log: jest.fn() };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                payments_service_1.PaymentsService,
                { provide: prisma_service_1.PrismaService, useValue: prisma },
                { provide: audit_service_1.AuditService, useValue: audit },
            ],
        }).compile();
        service = module.get(payments_service_1.PaymentsService);
    });
    it("deve registrar pagamento com sucesso", async () => {
        prisma.order.findUnique.mockResolvedValue({ id: "o1", status: "PENDING" });
        prisma.payment.create.mockResolvedValue({ id: "pay-1", valor: 39.9, metodo: "PIX", status: "APPROVED" });
        const result = await service.create("o1", { valor: 39.9, metodo: "PIX" }, "admin-1");
        expect(result.status).toBe("APPROVED");
        expect(audit.log).toHaveBeenCalledWith(expect.objectContaining({ acao: "PAYMENT_REGISTERED" }));
    });
    it("deve rejeitar pagamento em pedido inexistente", async () => {
        prisma.order.findUnique.mockResolvedValue(null);
        await expect(service.create("o-x", { valor: 10, metodo: "PIX" })).rejects.toThrow();
    });
});
//# sourceMappingURL=payments.service.spec.js.map