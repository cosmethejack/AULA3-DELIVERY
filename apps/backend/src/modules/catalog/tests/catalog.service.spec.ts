import { Test, TestingModule } from "@nestjs/testing";
import { CatalogService } from "../catalog.service";
import { PrismaService } from "../../../core/database/prisma.service";

describe("CatalogService", () => {
  let service: CatalogService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      category: { findMany: jest.fn() },
      product: { findUnique: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CatalogService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
  });

  it("findAll retorna apenas categorias e produtos ativos", async () => {
    const categorias = [{ id: "c1", ativo: true, products: [] }];
    prisma.category.findMany.mockResolvedValue(categorias);

    const result = await service.findAll();

    expect(result).toBe(categorias);
    expect(prisma.category.findMany).toHaveBeenCalledWith({
      where: { ativo: true },
      include: { products: { where: { ativo: true } } },
    });
  });

  it("findOne busca produto por id incluindo a categoria", async () => {
    const produto = { id: "p1", category: { id: "c1" } };
    prisma.product.findUnique.mockResolvedValue(produto);

    const result = await service.findOne("p1");

    expect(result).toBe(produto);
    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: { id: "p1" },
      include: { category: true },
    });
  });

  it("findOne retorna null quando o produto não existe", async () => {
    prisma.product.findUnique.mockResolvedValue(null);
    await expect(service.findOne("inexistente")).resolves.toBeNull();
  });
});