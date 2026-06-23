import { PaymentsService } from "./payments.service";
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(id: string, body: any, req: any): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        pedidoId: string;
        valor: import("@prisma/client-runtime-utils").Decimal;
        metodo: import(".prisma/client").$Enums.PaymentMethod;
        data: Date;
        observacao: string | null;
    }>;
}
