import { DashboardService } from "./dashboard.service";
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
