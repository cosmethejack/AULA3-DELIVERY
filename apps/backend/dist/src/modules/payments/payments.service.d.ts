import { PrismaService } from "../../core/database/prisma.service";
import { AuditService } from "../../core/audit/audit.service";
import { PaymentMethod } from "@prisma/client";
export declare class PaymentsService {
    private prisma;
    private audit;
    constructor(prisma: PrismaService, audit: AuditService);
    create(pedidoId: string, data: {
        valor: number;
        metodo: PaymentMethod;
        observacao?: string;
    }, userId?: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        pedidoId: string;
        valor: import("@prisma/client-runtime-utils").Decimal;
        metodo: import(".prisma/client").$Enums.PaymentMethod;
        data: Date;
        observacao: string | null;
    }>;
}
