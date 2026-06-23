import { AuditInterceptor } from "../audit.interceptor";
import { AuditService } from "../audit.service";
import { of } from "rxjs";

describe("AuditInterceptor", () => {
  let interceptor: AuditInterceptor;
  let audit: any;

  beforeEach(() => {
    audit = { log: jest.fn() };
    interceptor = new AuditInterceptor(audit);
  });

  it("deve auditar requisição POST", (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ method: "POST", path: "/v1/orders", body: { clienteId: "c1" }, user: { sub: "u1" } }),
      }),
    } as any;

    const next = { handle: () => of({ id: "o1" }) };

    interceptor.intercept(context, next).subscribe(() => {
      expect(audit.log).toHaveBeenCalledWith(
        expect.objectContaining({ acao: expect.stringContaining("POST"), userId: "u1" }),
      );
      done();
    });
  });

  it("deve ignorar requisição GET", (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ method: "GET", path: "/v1/orders", body: {}, user: { sub: "u1" } }),
      }),
    } as any;

    const next = { handle: () => of([{ id: "o1" }]) };

    interceptor.intercept(context, next).subscribe(() => {
      expect(audit.log).not.toHaveBeenCalled();
      done();
    });
  });
});
