"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const audit_interceptor_1 = require("../audit.interceptor");
const rxjs_1 = require("rxjs");
describe("AuditInterceptor", () => {
    let interceptor;
    let audit;
    beforeEach(() => {
        audit = { log: jest.fn() };
        interceptor = new audit_interceptor_1.AuditInterceptor(audit);
    });
    it("deve auditar requisição POST", (done) => {
        const context = {
            switchToHttp: () => ({
                getRequest: () => ({ method: "POST", path: "/v1/orders", body: { clienteId: "c1" }, user: { sub: "u1" } }),
            }),
        };
        const next = { handle: () => (0, rxjs_1.of)({ id: "o1" }) };
        interceptor.intercept(context, next).subscribe(() => {
            expect(audit.log).toHaveBeenCalledWith(expect.objectContaining({ acao: expect.stringContaining("POST"), userId: "u1" }));
            done();
        });
    });
    it("deve ignorar requisição GET", (done) => {
        const context = {
            switchToHttp: () => ({
                getRequest: () => ({ method: "GET", path: "/v1/orders", body: {}, user: { sub: "u1" } }),
            }),
        };
        const next = { handle: () => (0, rxjs_1.of)([{ id: "o1" }]) };
        interceptor.intercept(context, next).subscribe(() => {
            expect(audit.log).not.toHaveBeenCalled();
            done();
        });
    });
});
//# sourceMappingURL=audit.interceptor.spec.js.map