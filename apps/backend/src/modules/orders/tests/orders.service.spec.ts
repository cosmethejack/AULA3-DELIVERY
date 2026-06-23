import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, ConflictException, UnprocessableEntityException } from "@nestjs/common";
import { OrdersService } from "../orders.service";
import { PrismaService } from "../../../core/database/prisma.service";
import { AuditService } from "../../../core/audit/audit.service";

describe("OrdersService", () => {
  let service: OrdersService;
  let prisma: any;
  let audit: any;

  const mockProduct = { id: "prod-1", nome: "Pizza", preco: 39.9, estoque: 10, ativo: true };
  const mockCustomer = { id: "cli-1", nome: "João", email: "joao@email.com" };

  beforeEach(async () => {
    prisma = {
      product: { findMany: jest.fn() },
      order: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };
    audit = { log: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditService, useValue: audit },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  describe("create", () => {
    it("deve criar pedido com sucesso", async () => {
      prisma.product.findMany.mockResolvedValue([mockProduct]);
      prisma.order.create.mockResolvedValue({
        id: "order-1",
        numero: "ORD-123",
        clienteId: "cli-1",
        status: "PENDING",
        items: [],
        customer: mockCustomer,
      });

      const result = await service.create({
        clienteId: "cli-1",
        items: [{ produtoId: "prod-1", quantidade: 2 }],
      });

      expect(result.numero).toContain("ORD-");
      expect(audit.log).toHaveBeenCalledWith(
        expect.objectContaining({ acao: "ORDER_CREATED" }),
      );
    });

    it("deve rejeitar produto inexistente", async () => {
      prisma.product.findMany.mockResolvedValue([]);
      await expect(
        service.create({ clienteId: "cli-1", items: [{ produtoId: "x", quantidade: 1 }] }),
      ).rejects.toThrow(BadRequestException);
    });

    it("deve rejeitar estoque insuficiente", async () => {
      prisma.product.findMany.mockResolvedValue([mockProduct]);
      await expect(
        service.create({ clienteId: "cli-1", items: [{ produtoId: "prod-1", quantidade: 99 }] }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe("updateStatus", () => {
    it("deve transicionar PENDING -> CONFIRMED", async () => {
      prisma.order.findUnique.mockResolvedValue({ id: "o1", status: "PENDING" });
      prisma.order.update.mockResolvedValue({ id: "o1", status: "CONFIRMED" });
      const result = await service.updateStatus("o1", "CONFIRMED");
      expect(result.status).toBe("CONFIRMED");
    });

    it("deve rejeitar transição inválida PENDING -> SHIPPED", async () => {
      prisma.order.findUnique.mockResolvedValue({ id: "o1", status: "PENDING" });
      await expect(service.updateStatus("o1", "SHIPPED")).rejects.toThrow(BadRequestException);
    });

    it("deve rejeitar cancelar pedido entregue", async () => {
      prisma.order.findUnique.mockResolvedValue({ id: "o1", status: "DELIVERED" });
      await expect(service.updateStatus("o1", "CANCELLED")).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it("deve rejeitar pedido inexistente", async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(service.updateStatus("x", "CONFIRMED")).rejects.toThrow(BadRequestException);
    });
  });
});
