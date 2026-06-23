"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("@prisma/client"));
const { PrismaClient } = client_1.default;
const prisma = new PrismaClient();
async function main() {
    const categorias = await Promise.all([
        prisma.category.create({
            data: {
                nome: "Bebidas",
                slug: "bebidas",
                products: {
                    create: [
                        { nome: "Coca-Cola 350ml", descricao: "Refrigerante de cola", preco: 4.5, estoque: 100 },
                        { nome: "Suco de Laranja 500ml", descricao: "Suco natural", preco: 6.0, estoque: 50 },
                    ],
                },
            },
        }),
        prisma.category.create({
            data: {
                nome: "Lanches",
                slug: "lanches",
                products: {
                    create: [
                        { nome: "X-Burger", descricao: "Hambúrguer com queijo", preco: 18.9, estoque: 30 },
                        { nome: "X-Salada", descricao: "Hambúrguer com queijo e salada", preco: 22.9, estoque: 30 },
                    ],
                },
            },
        }),
        prisma.category.create({
            data: {
                nome: "Sobremesas",
                slug: "sobremesas",
                products: {
                    create: [
                        { nome: "Pudim", descricao: "Pudim de leite condensado", preco: 8.5, estoque: 20 },
                        { nome: "Sorvete", descricao: "Sorvete de creme 2 bolas", preco: 12.0, estoque: 40 },
                    ],
                },
            },
        }),
    ]);
    console.log(`Seed concluído: ${categorias.length} categorias criadas.`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map