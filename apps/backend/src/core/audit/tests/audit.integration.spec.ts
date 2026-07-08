import { of } from "rxjs";
import { AuditInterceptor } from "../audit.interceptor";
import { AuditService } from "../audit.service";

describe("Auditoria (integração interceptor → service)", () => {
  let prisma: any;
  let interceptor: AuditInterceptor;

  beforeEach(() => {
    prisma = { auditLog: { create: jest.fn().mockResolvedValue({ id: "a1" }) } };
    const service = new AuditService(prisma as never);
    interceptor = new AuditInterceptor(service);
  });

  const ctx = (req: unknown) =>
    ({ switchToHttp: () => ({ getRequest: () => req }) }) as never;

  it("mutação POST persiste registro com usuário/ação/objeto e redaction", (done) => {
    const req = {
      method: "POST",
      path: "/v1/orders",
      body: { clienteId: "c1", password: "segredo" },
      user: { sub: "u1" },
    };
    const next = { handle: () => of({ id: "o1" }) };

    interceptor.intercept(ctx(req), next).subscribe(() => {
      expect(prisma.auditLog.create).toHaveBeenCalledTimes(1);
      const data = prisma.auditLog.create.mock.calls[0][0].data;
      expect(data.userId).toBe("u1");
      expect(data.entidade).toBe("orders");
      expect(data.acao).toContain("POST");
      expect(data.entidadeId).toBe("o1");
      expect(data.payload.body.password).toBe("[REDACTED]");
      done();
    });
  });

  it("leitura GET não persiste registro", (done) => {
    const req = { method: "GET", path: "/v1/orders", body: {}, user: { sub: "u1" } };
    const next = { handle: () => of([]) };

    interceptor.intercept(ctx(req), next).subscribe(() => {
      expect(prisma.auditLog.create).not.toHaveBeenCalled();
      done();
    });
  });
});
