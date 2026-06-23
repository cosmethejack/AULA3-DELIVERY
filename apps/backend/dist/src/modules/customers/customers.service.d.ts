import { PrismaService } from "../../core/database/prisma.service";
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        nome: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        endereco: string | null;
        email: string;
        telefone: string | null;
    }[]>;
    findOne(id: string): Promise<({
        orders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            numero: string;
            clienteId: string;
            enderecoEntrega: string | null;
            status: import(".prisma/client").$Enums.OrderStatus;
        }[];
    } & {
        id: string;
        nome: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        endereco: string | null;
        email: string;
        telefone: string | null;
    }) | null>;
    create(data: {
        nome: string;
        email: string;
        endereco?: string;
        telefone?: string;
    }): Promise<{
        id: string;
        nome: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
        endereco: string | null;
        email: string;
        telefone: string | null;
    }>;
}
