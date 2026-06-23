import { PrismaService } from "../database/prisma.service";
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(params: {
        userId?: string;
        acao: string;
        entidade: string;
        entidadeId?: string;
        payload?: any;
    }): Promise<void>;
}
