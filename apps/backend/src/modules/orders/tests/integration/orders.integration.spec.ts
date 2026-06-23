import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, ConflictException } from "@nestjs/common";
import { OrdersService } from "../../orders.service";
import { PaymentsService } from "../../../payments/payments.service";
import { PrismaService } from "../../../../core/database/prisma.service";
import { AuditService } from "../../../../core/audit/audit.service";

describe("Orders + Payments integration", () => {
  let ordersService: OrdersService;
  let paymentsService: PaymentsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      product: { findMany: jest.fn() },
      order: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
      payment: { create: jest.fn() },
      auditLog: { create: jest.fn() },
      $transaction: jest.fn((fn: any) => fn(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        PaymentsService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditService, useValue: { log: jest.fn() } },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  it("deve criar pedido e registrar pagamento (fluxo completo)", async () => {
    prisma.product.findMany.mockResolvedValue([
      { id: "prod-1", nome: "Pizza", preco: 39.9, estoque: 10, ativo: true },
    ]);
    prisma.order.create.mockResolvedValue({ id: "order-1", numero: "ORD-123", status: "PENDING" });
    prisma.order.findUnique.mockResolvedValue({ id: "order-1", status: "PENDING" });
    prisma.payment.create.mockResolvedValue({ id: "pay-1", valor: 39.9, metodo: "PIX", status: "APPROVED" });
    prisma.order.update.mockResolvedValue({ id: "order-1", status: "CONFIRMED" });

    const order = await ordersService.create({
      clienteId: "cli-1",
      items: [{ produtoId: "prod-1", quantidade: 2 }],
    });

    expect(order.status).toBe("PENDING");

    const payment = await paymentsService.create("order-1", { valor: 39.9, metodo: "PIX" as any }, "admin-1");

    expect(payment.status).toBe("APPROVED");
    expect(prisma.order.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: "CONFIRMED" } }),
    );
  });

  it("deve rejeitar pagamento em pedido inexistente", async () => {
    prisma.order.findUnique.mockResolvedValue(null);

    await expect(
      paymentsService.create("order-x", { valor: 10, metodo: "PIX" as any }),
    ).rejects.toThrow(BadRequestException);
  });

  it("deve rejeitar criar pedido com estoque insuficiente", async () => {
    prisma.product.findMany.mockResolvedValue([
      { id: "prod-1", nome: "Pizza", preco: 39.9, estoque: 1, ativo: true },
    ]);

    await expect(
      ordersService.create({ clienteId: "cli-1", items: [{ produtoId: "prod-1", quantidade: 99 }] }),
    ).rejects.toThrow(ConflictException);
  });
});
