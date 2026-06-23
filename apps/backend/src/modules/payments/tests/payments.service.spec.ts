import { Test, TestingModule } from "@nestjs/testing";
import { PaymentsService } from "../payments.service";
import { PrismaService } from "../../../core/database/prisma.service";
import { AuditService } from "../../../core/audit/audit.service";

describe("PaymentsService", () => {
  let service: PaymentsService;
  let prisma: any;
  let audit: any;

  beforeEach(async () => {
    prisma = {
      order: { findUnique: jest.fn(), update: jest.fn() },
      payment: { create: jest.fn() },
      auditLog: { create: jest.fn() },
      $transaction: jest.fn((fn: any) => fn(prisma)),
    };
    audit = { log: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditService, useValue: audit },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it("deve registrar pagamento com sucesso", async () => {
    prisma.order.findUnique.mockResolvedValue({ id: "o1", status: "PENDING" });
    prisma.payment.create.mockResolvedValue({ id: "pay-1", valor: 39.9, metodo: "PIX", status: "APPROVED" });

    const result = await service.create("o1", { valor: 39.9, metodo: "PIX" as any }, "admin-1");

    expect(result.status).toBe("APPROVED");
    expect(audit.log).toHaveBeenCalledWith(expect.objectContaining({ acao: "PAYMENT_REGISTERED" }));
  });

  it("deve rejeitar pagamento em pedido inexistente", async () => {
    prisma.order.findUnique.mockResolvedValue(null);
    await expect(service.create("o-x", { valor: 10, metodo: "PIX" as any })).rejects.toThrow();
  });
});
