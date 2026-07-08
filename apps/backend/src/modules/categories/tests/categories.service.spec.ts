import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { CategoriesService, slugify } from "../categories.service";
import { PrismaService } from "../../../core/database/prisma.service";

describe("slugify", () => {
  it("gera slug em minúsculas com hífens", () => {
    expect(slugify("Bebidas Geladas")).toBe("bebidas-geladas");
  });
  it("remove acentos e símbolos", () => {
    expect(slugify("Café & Pães!")).toBe("cafe-paes");
  });
});

describe("CategoriesService", () => {
  let service: CategoriesService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      category: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      $transaction: jest.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(CategoriesService);
  });

  it("create gera slug a partir do nome quando ausente", async () => {
    prisma.category.create.mockResolvedValue({ id: "1", slug: "bebidas" });
    await service.create({ nome: "Bebidas" });
    expect(prisma.category.create).toHaveBeenCalledWith({
      data: { nome: "Bebidas", slug: "bebidas" },
    });
  });

  it("create usa o slug informado quando presente", async () => {
    prisma.category.create.mockResolvedValue({ id: "1" });
    await service.create({ nome: "Bebidas", slug: "bebs" });
    expect(prisma.category.create).toHaveBeenCalledWith({
      data: { nome: "Bebidas", slug: "bebs" },
    });
  });

  it("create converte slug duplicado (P2002) em 409", async () => {
    prisma.category.create.mockRejectedValue({ code: "P2002" });
    await expect(service.create({ nome: "Bebidas" })).rejects.toBeInstanceOf(ConflictException);
  });

  it("create repropaga erro não-P2002", async () => {
    prisma.category.create.mockRejectedValue(new Error("db down"));
    await expect(service.create({ nome: "X" })).rejects.toThrow("db down");
  });

  it("findAll retorna envelope paginado", async () => {
    prisma.category.findMany.mockResolvedValue([{ id: "1" }]);
    prisma.category.count.mockResolvedValue(1);
    const res = await service.findAll(2, 5);
    expect(prisma.category.findMany).toHaveBeenCalledWith({
      skip: 5,
      take: 5,
      orderBy: { createdAt: "desc" },
    });
    expect(res).toEqual({ data: [{ id: "1" }], total: 1, page: 2, limit: 5 });
  });

  it("findOne lança NotFound quando ausente", async () => {
    prisma.category.findUnique.mockResolvedValue(null);
    await expect(service.findOne("x")).rejects.toBeInstanceOf(NotFoundException);
  });

  it("update aplica alterações após verificar existência", async () => {
    prisma.category.findUnique.mockResolvedValue({ id: "1" });
    prisma.category.update.mockResolvedValue({ id: "1", nome: "Novo" });
    await service.update("1", { nome: "Novo" });
    expect(prisma.category.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { nome: "Novo" },
    });
  });

  it("update converte conflito de slug em 409", async () => {
    prisma.category.findUnique.mockResolvedValue({ id: "1" });
    prisma.category.update.mockRejectedValue({ code: "P2002" });
    await expect(service.update("1", { slug: "dup" })).rejects.toBeInstanceOf(ConflictException);
  });

  it("remove faz soft-delete (ativo=false)", async () => {
    prisma.category.findUnique.mockResolvedValue({ id: "1" });
    prisma.category.update.mockResolvedValue({ id: "1", ativo: false });
    await service.remove("1");
    expect(prisma.category.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { ativo: false },
    });
  });
});
