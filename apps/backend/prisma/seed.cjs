const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const CATALOGO = [
  {
    nome: "Bebidas",
    slug: "bebidas",
    products: [
      { nome: "Coca-Cola 350ml", descricao: "Refrigerante de cola", preco: 4.5, estoque: 100, imagem: "https://placehold.co/400x300/e53935/white?text=Coca-Cola" },
      { nome: "Suco de Laranja 500ml", descricao: "Suco natural", preco: 6.0, estoque: 50, imagem: "https://placehold.co/400x300/ff9800/white?text=Suco+Laranja" },
    ],
  },
  {
    nome: "Lanches",
    slug: "lanches",
    products: [
      { nome: "X-Burger", descricao: "Hambúrguer com queijo", preco: 18.9, estoque: 30, imagem: "https://placehold.co/400x300/795548/white?text=X-Burger" },
      { nome: "X-Salada", descricao: "Hambúrguer com queijo e salada", preco: 22.9, estoque: 30, imagem: "https://placehold.co/400x300/4caf50/white?text=X-Salada" },
    ],
  },
  {
    nome: "Sobremesas",
    slug: "sobremesas",
    products: [
      { nome: "Pudim", descricao: "Pudim de leite condensado", preco: 8.5, estoque: 20, imagem: "https://placehold.co/400x300/9c27b0/white?text=Pudim" },
      { nome: "Sorvete", descricao: "Sorvete de creme 2 bolas", preco: 12.0, estoque: 40, imagem: "https://placehold.co/400x300/2196f3/white?text=Sorvete" },
    ],
  },
];

async function main() {
  // Idempotente: upsert de categoria por slug e cria produto só quando ausente.
  for (const cat of CATALOGO) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { nome: cat.nome },
      create: { nome: cat.nome, slug: cat.slug },
    });

    for (const p of cat.products) {
      const existing = await prisma.product.findFirst({
        where: { nome: p.nome, categoriaId: category.id },
      });
      if (!existing) {
        await prisma.product.create({ data: { ...p, categoriaId: category.id } });
      }
    }
  }

  console.log(`Seed concluído: ${CATALOGO.length} categorias garantidas (idempotente).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
