import { PrismaService } from "../../core/database/prisma.service";
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    summary(): Promise<{
        vendasTotais: number;
        recebido: number | import("@prisma/client-runtime-utils").Decimal;
        pendente: number;
        top5Produtos: {
            produto: string;
            quantidade: number;
        }[];
        periodo: {
            inicioDia: Date;
            inicioSemana: Date;
            inicioMes: Date;
        };
    }>;
}
