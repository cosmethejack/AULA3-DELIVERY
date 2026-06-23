import { PrismaService } from "../../core/database/prisma.service";
export declare class CatalogService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        products: {
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
        }[];
    } & {
        id: string;
        nome: string;
        slug: string;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<({
        category: {
            id: string;
            nome: string;
            slug: string;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    }) | null>;
}
