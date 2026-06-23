import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

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

    const topProdutos = await Promise.all(
      topProducts.map(async (item) => {
        const product = await this.prisma.product.findUnique({ where: { id: item.produtoId } });
        return { produto: product?.nome || "Desconhecido", quantidade: item._sum.quantidade || 0 };
      }),
    );

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
}
