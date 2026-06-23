"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clerk_guard_1 = require("../clerk.guard");
const common_1 = require("@nestjs/common");
jest.mock("jose", () => ({
    createRemoteJWKSet: jest.fn(),
    jwtVerify: jest.fn(),
}));
const jose_1 = require("jose");
function mockContext(handlerRoles, authHeader) {
    return {
        getHandler: () => ({}),
        getClass: () => ({}),
        switchToHttp: () => ({
            getRequest: () => ({
                headers: { authorization: authHeader },
            }),
        }),
    };
}
describe("ClerkGuard", () => {
    let guard;
    let reflector;
    beforeEach(() => {
        jest.clearAllMocks();
        reflector = { getAllAndOverride: jest.fn() };
        guard = new clerk_guard_1.ClerkGuard(reflector);
    });
    it("deve permitir acesso sem roles requeridas", async () => {
        reflector.getAllAndOverride.mockReturnValue(undefined);
        const result = await guard.canActivate(mockContext(undefined));
        expect(result).toBe(true);
    });
    it("deve bloquear sem token", async () => {
        reflector.getAllAndOverride.mockReturnValue(["ADMIN"]);
        await expect(guard.canActivate(mockContext(["ADMIN"]))).rejects.toThrow(common_1.UnauthorizedException);
    });
    it("deve bloquear role insuficiente", async () => {
        jose_1.jwtVerify.mockResolvedValue({ payload: { sub: "u1", role: "CUSTOMER" } });
        reflector.getAllAndOverride.mockReturnValue(["ADMIN"]);
        const ctx = mockContext(["ADMIN"], "Bearer fake-token");
        await expect(guard.canActivate(ctx)).rejects.toThrow(common_1.ForbiddenException);
    });
    it("deve permitir admin com role correta", async () => {
        jose_1.jwtVerify.mockResolvedValue({ payload: { sub: "u1", role: "ADMIN" } });
        reflector.getAllAndOverride.mockReturnValue(["ADMIN"]);
        const ctx = mockContext(["ADMIN"], "Bearer fake-token");
        const result = await guard.canActivate(ctx);
        expect(result).toBe(true);
    });
    it("deve bloquear token invalido", async () => {
        jose_1.jwtVerify.mockRejectedValue(new Error("Invalid signature"));
        reflector.getAllAndOverride.mockReturnValue(["ADMIN"]);
        const ctx = mockContext(["ADMIN"], "Bearer invalid-token");
        await expect(guard.canActivate(ctx)).rejects.toThrow(common_1.UnauthorizedException);
    });
});
//# sourceMappingURL=clerk.guard.spec.js.map