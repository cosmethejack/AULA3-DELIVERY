"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const dashboard_service_1 = require("../dashboard.service");
const prisma_service_1 = require("../../../core/database/prisma.service");
describe("DashboardService", () => {
    let service;
    let prisma;
    beforeEach(async () => {
        prisma = {
            order: { count: jest.fn() },
            payment: {
                aggregate: jest.fn(),
                groupBy: jest.fn(),
            },
            orderItem: { groupBy: jest.fn() },
            product: { findUnique: jest.fn() },
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                dashboard_service_1.DashboardService,
                { provide: prisma_service_1.PrismaService, useValue: prisma },
            ],
        }).compile();
        service = module.get(dashboard_service_1.DashboardService);
    });
    it("deve retornar resumo com métricas", async () => {
        prisma.order.count.mockResolvedValue(42);
        prisma.payment.aggregate.mockResolvedValue({ _sum: { valor: 5000 } });
        prisma.payment.groupBy.mockResolvedValue([
            { status: "APPROVED", _sum: { valor: 4500 } },
            { status: "PENDING", _sum: { valor: 500 } },
        ]);
        prisma.orderItem.groupBy.mockResolvedValue([
            { produtoId: "p1", _sum: { quantidade: 10 } },
        ]);
        prisma.product.findUnique.mockResolvedValue({ nome: "Pizza", preco: 39.9 });
        const result = await service.summary();
        expect(result.vendasTotais).toBe(42);
        expect(result.recebido).toBe(4500);
        expect(result.pendente).toBe(500);
        expect(result.top5Produtos).toHaveLength(1);
        expect(result.top5Produtos[0].produto).toBe("Pizza");
    });
    it("deve funcionar com zero vendas", async () => {
        prisma.order.count.mockResolvedValue(0);
        prisma.payment.aggregate.mockResolvedValue({ _sum: { valor: null } });
        prisma.payment.groupBy.mockResolvedValue([]);
        prisma.orderItem.groupBy.mockResolvedValue([]);
        const result = await service.summary();
        expect(result.vendasTotais).toBe(0);
        expect(result.recebido).toBe(0);
        expect(result.top5Produtos).toEqual([]);
    });
});
//# sourceMappingURL=dashboard.service.spec.js.map