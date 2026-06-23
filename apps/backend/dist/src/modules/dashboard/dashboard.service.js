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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async summary() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [totalOrders, totalRevenue, paymentsByStatus, topProducts] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.payment.aggregate({ _sum: { valor: true }, where: { status: "APPROVED" } }),
            this.prisma.payment.groupBy({
                by: ["status"],
                _sum: { valor: true },
            }),
            this.prisma.orderItem.groupBy({
                by: ["produtoId"],
                _sum: { quantidade: true },
                orderBy: { _sum: { quantidade: "desc" } },
                take: 5,
            }),
        ]);
        const topProdutos = await Promise.all(topProducts.map(async (item) => {
            const product = await this.prisma.product.findUnique({ where: { id: item.produtoId } });
            return { produto: product?.nome || "Desconhecido", quantidade: item._sum.quantidade || 0 };
        }));
        return {
            vendasTotais: totalOrders,
            recebido: paymentsByStatus.find((p) => p.status === "APPROVED")?._sum.valor || 0,
            pendente: paymentsByStatus.filter((p) => p.status === "PENDING").reduce((a, b) => a + Number(b._sum.valor || 0), 0),
            top5Produtos: topProdutos,
            periodo: {
                inicioDia: startOfDay,
                inicioSemana: startOfWeek,
                inicioMes: startOfMonth,
            },
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map