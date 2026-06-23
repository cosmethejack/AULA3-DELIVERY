import { OrdersService } from "./orders.service";
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(body: any, req: any): Promise<{
        customer: {
            id: string;
            nome: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            endereco: string | null;
            email: string;
            telefone: string | null;
        };
        items: {
            id: string;
            pedidoId: string;
            produtoId: string;
            precoUnitario: import("@prisma/client-runtime-utils").Decimal;
            quantidade: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        numero: string;
        clienteId: string;
        enderecoEntrega: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
    }>;
    findAll(req: any): Promise<({
        customer: {
            id: string;
            nome: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            endereco: string | null;
            email: string;
            telefone: string | null;
        };
        items: ({
            product: {
                id: string;
                nome: string;
                ativo: boolean;
                createdAt: Date;
                updatedAt: Date;
                descricao: string | null;
                preco: import("@prisma/client-runtime-utils").Decimal;
                estoque: number;
                imagem: string | null;
                categoriaId: string;
            };
        } & {
            id: string;
            pedidoId: string;
            produtoId: string;
            precoUnitario: import("@prisma/client-runtime-utils").Decimal;
            quantidade: number;
        })[];
        payments: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            pedidoId: string;
            valor: import("@prisma/client-runtime-utils").Decimal;
            metodo: import(".prisma/client").$Enums.PaymentMethod;
            data: Date;
            observacao: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        numero: string;
        clienteId: string;
        enderecoEntrega: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
    })[]>;
    findOne(id: string): Promise<({
        customer: {
            id: string;
            nome: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
            endereco: string | null;
            email: string;
            telefone: string | null;
        };
        items: ({
            product: {
                id: string;
                nome: string;
                ativo: boolean;
                createdAt: Date;
                updatedAt: Date;
                descricao: string | null;
                preco: import("@prisma/client-runtime-utils").Decimal;
                estoque: number;
                imagem: string | null;
                categoriaId: string;
            };
        } & {
            id: string;
            pedidoId: string;
            produtoId: string;
            precoUnitario: import("@prisma/client-runtime-utils").Decimal;
            quantidade: number;
        })[];
        payments: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            pedidoId: string;
            valor: import("@prisma/client-runtime-utils").Decimal;
            metodo: import(".prisma/client").$Enums.PaymentMethod;
            data: Date;
            observacao: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        numero: string;
        clienteId: string;
        enderecoEntrega: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
    }) | null>;
    updateStatus(id: string, status: any, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        numero: string;
        clienteId: string;
        enderecoEntrega: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
    }>;
    cancel(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        numero: string;
        clienteId: string;
        enderecoEntrega: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
    }>;
}
