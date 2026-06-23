import { CustomersService } from "./customers.service";
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
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
    create(body: any): Promise<{
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
