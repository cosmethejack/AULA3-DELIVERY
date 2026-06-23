import { CatalogService } from "./catalog.service";
export declare class CatalogController {
    private readonly catalogService;
    constructor(catalogService: CatalogService);
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
