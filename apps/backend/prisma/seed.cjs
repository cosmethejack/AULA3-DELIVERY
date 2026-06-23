const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const categorias = await Promise.all([
    prisma.category.create({
      data: {
        nome: "Bebidas",
        slug: "bebidas",
        products: {
          create: [
            { nome: "Coca-Cola 350ml", descricao: "Refrigerante de cola", preco: 4.5, estoque: 100, imagem: "https://placehold.co/400x300/e53935/white?text=Coca-Cola" },
            { nome: "Suco de Laranja 500ml", descricao: "Suco natural", preco: 6.0, estoque: 50, imagem: "https://placehold.co/400x300/ff9800/white?text=Suco+Laranja" },
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
            { nome: "X-Burger", descricao: "Hambúrguer com queijo", preco: 18.9, estoque: 30, imagem: "https://placehold.co/400x300/795548/white?text=X-Burger" },
            { nome: "X-Salada", descricao: "Hambúrguer com queijo e salada", preco: 22.9, estoque: 30, imagem: "https://placehold.co/400x300/4caf50/white?text=X-Salada" },
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
            { nome: "Pudim", descricao: "Pudim de leite condensado", preco: 8.5, estoque: 20, imagem: "https://placehold.co/400x300/9c27b0/white?text=Pudim" },
            { nome: "Sorvete", descricao: "Sorvete de creme 2 bolas", preco: 12.0, estoque: 40, imagem: "https://placehold.co/400x300/2196f3/white?text=Sorvete" },
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
