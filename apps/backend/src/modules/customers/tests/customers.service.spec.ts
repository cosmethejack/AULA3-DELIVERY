import { Test, TestingModule } from "@nestjs/testing";
import { CustomersService } from "../customers.service";
import { PrismaService } from "../../../core/database/prisma.service";

describe("CustomersService", () => {
  let service: CustomersService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      customer: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        upsert: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it("findAll lista clientes ordenados por createdAt desc", async () => {
    const clientes = [{ id: "c1" }];
    prisma.customer.findMany.mockResolvedValue(clientes);

    const result = await service.findAll();

    expect(result).toBe(clientes);
    expect(prisma.customer.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: "desc" } });
  });

  it("findOne busca cliente por id incluindo pedidos", async () => {
    const cliente = { id: "c1", orders: [] };
    prisma.customer.findUnique.mockResolvedValue(cliente);

    const result = await service.findOne("c1");

    expect(result).toBe(cliente);
    expect(prisma.customer.findUnique).toHaveBeenCalledWith({
      where: { id: "c1" },
      include: { orders: true },
    });
  });

  it("create faz upsert por e-mail (reuso em compra repetida)", async () => {
    const data = { nome: "Ana", email: "ana@x.com", endereco: "Rua 1", telefone: "9999" };
    const salvo = { id: "c1", ...data };
    prisma.customer.upsert.mockResolvedValue(salvo);

    const result = await service.create(data);

    expect(result).toBe(salvo);
    expect(prisma.customer.upsert).toHaveBeenCalledWith({
      where: { email: "ana@x.com" },
      update: { nome: "Ana", endereco: "Rua 1", telefone: "9999" },
      create: data,
    });
  });

  it("create funciona com campos opcionais ausentes", async () => {
    const data = { nome: "Bia", email: "bia@x.com" };
    prisma.customer.upsert.mockResolvedValue({ id: "c2", ...data });

    await service.create(data);

    expect(prisma.customer.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: "bia@x.com" },
        update: { nome: "Bia", endereco: undefined, telefone: undefined },
      }),
    );
  });
});