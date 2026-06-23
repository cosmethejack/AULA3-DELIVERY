"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const audit_service_1 = require("../audit.service");
const prisma_service_1 = require("../../database/prisma.service");
describe("AuditService", () => {
    let service;
    let prisma;
    beforeEach(async () => {
        prisma = {
            auditLog: { create: jest.fn() },
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                audit_service_1.AuditService,
                { provide: prisma_service_1.PrismaService, useValue: prisma },
            ],
        }).compile();
        service = module.get(audit_service_1.AuditService);
    });
    it("deve registrar log de auditoria", async () => {
        prisma.auditLog.create.mockResolvedValue({ id: "log-1" });
        await service.log({
            userId: "u1",
            acao: "ORDER_CREATED",
            entidade: "Order",
            entidadeId: "o1",
            payload: { numero: "ORD-123" },
        });
        expect(prisma.auditLog.create).toHaveBeenCalledWith({
            data: {
                userId: "u1",
                acao: "ORDER_CREATED",
                entidade: "Order",
                entidadeId: "o1",
                payload: { numero: "ORD-123" },
            },
        });
    });
    it("deve registrar sem payload", async () => {
        prisma.auditLog.create.mockResolvedValue({ id: "log-2" });
        await service.log({
            acao: "USER_LOGIN",
            entidade: "User",
        });
        expect(prisma.auditLog.create).toHaveBeenCalled();
    });
});
//# sourceMappingURL=audit.service.spec.js.map