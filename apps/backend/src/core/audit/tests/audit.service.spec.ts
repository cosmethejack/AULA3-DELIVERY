import { Test, TestingModule } from "@nestjs/testing";
import { AuditService } from "../audit.service";
import { PrismaService } from "../../database/prisma.service";

describe("AuditService", () => {
  let service: AuditService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      auditLog: { create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  it("deve registrar log de auditoria", async () => {
    prisma.auditLog.create.mockResolvedValue({ id: "log-1" });

    await service.log({
      userId: "u1",
      acao: "ORDER_CREATED",
      entidade: "Order",
      entidadeId: "o1",
      payload: { numero: "ORD-123" },
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        userId: "u1",
        acao: "ORDER_CREATED",
        entidade: "Order",
        entidadeId: "o1",
        payload: { numero: "ORD-123" },
      },
    });
  });

  it("deve registrar sem payload", async () => {
    prisma.auditLog.create.mockResolvedValue({ id: "log-2" });

    await service.log({
      acao: "USER_LOGIN",
      entidade: "User",
    });

    expect(prisma.auditLog.create).toHaveBeenCalled();
  });
});
