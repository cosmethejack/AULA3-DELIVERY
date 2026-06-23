"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const orders_service_1 = require("../orders.service");
const prisma_service_1 = require("../../../core/database/prisma.service");
const audit_service_1 = require("../../../core/audit/audit.service");
describe("OrdersService", () => {
    let service;
    let prisma;
    let audit;
    const mockProduct = { id: "prod-1", nome: "Pizza", preco: 39.9, estoque: 10, ativo: true };
    const mockCustomer = { id: "cli-1", nome: "João", email: "joao@email.com" };
    beforeEach(async () => {
        prisma = {
            product: { findMany: jest.fn() },
            order: {
                create: jest.fn(),
                findMany: jest.fn(),
                findUnique: jest.fn(),
                update: jest.fn(),
            },
        };
        audit = { log: jest.fn() };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                orders_service_1.OrdersService,
                { provide: prisma_service_1.PrismaService, useValue: prisma },
                { provide: audit_service_1.AuditService, useValue: audit },
            ],
        }).compile();
        service = module.get(orders_service_1.OrdersService);
    });
    describe("create", () => {
        it("deve criar pedido com sucesso", async () => {
            prisma.product.findMany.mockResolvedValue([mockProduct]);
            prisma.order.create.mockResolvedValue({
                id: "order-1",
                numero: "ORD-123",
                clienteId: "cli-1",
                status: "PENDING",
                items: [],
                customer: mockCustomer,
            });
            const result = await service.create({
                clienteId: "cli-1",
                items: [{ produtoId: "prod-1", quantidade: 2 }],
            });
            expect(result.numero).toContain("ORD-");
            expect(audit.log).toHaveBeenCalledWith(expect.objectContaining({ acao: "ORDER_CREATED" }));
        });
        it("deve rejeitar produto inexistente", async () => {
            prisma.product.findMany.mockResolvedValue([]);
            await expect(service.create({ clienteId: "cli-1", items: [{ produtoId: "x", quantidade: 1 }] })).rejects.toThrow(common_1.BadRequestException);
        });
        it("deve rejeitar estoque insuficiente", async () => {
            prisma.product.findMany.mockResolvedValue([mockProduct]);
            await expect(service.create({ clienteId: "cli-1", items: [{ produtoId: "prod-1", quantidade: 99 }] })).rejects.toThrow(common_1.ConflictException);
        });
    });
    describe("updateStatus", () => {
        it("deve transicionar PENDING -> CONFIRMED", async () => {
            prisma.order.findUnique.mockResolvedValue({ id: "o1", status: "PENDING" });
            prisma.order.update.mockResolvedValue({ id: "o1", status: "CONFIRMED" });
            const result = await service.updateStatus("o1", "CONFIRMED");
            expect(result.status).toBe("CONFIRMED");
        });
        it("deve rejeitar transição inválida PENDING -> SHIPPED", async () => {
            prisma.order.findUnique.mockResolvedValue({ id: "o1", status: "PENDING" });
            await expect(service.updateStatus("o1", "SHIPPED")).rejects.toThrow(common_1.BadRequestException);
        });
        it("deve rejeitar cancelar pedido entregue", async () => {
            prisma.order.findUnique.mockResolvedValue({ id: "o1", status: "DELIVERED" });
            await expect(service.updateStatus("o1", "CANCELLED")).rejects.toThrow(common_1.UnprocessableEntityException);
        });
        it("deve rejeitar pedido inexistente", async () => {
            prisma.order.findUnique.mockResolvedValue(null);
            await expect(service.updateStatus("x", "CONFIRMED")).rejects.toThrow(common_1.BadRequestException);
        });
    });
});
//# sourceMappingURL=orders.service.spec.js.map