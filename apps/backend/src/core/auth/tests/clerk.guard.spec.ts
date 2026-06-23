import { ClerkGuard } from "../clerk.guard";
import { Reflector } from "@nestjs/core";
import { UnauthorizedException, ForbiddenException } from "@nestjs/common";

jest.mock("jose", () => ({
  createRemoteJWKSet: jest.fn(),
  jwtVerify: jest.fn(),
}));

import { jwtVerify } from "jose";

function mockContext(handlerRoles: string[] | undefined, authHeader?: string) {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({
        headers: { authorization: authHeader },
      }),
    }),
  } as any;
}

describe("ClerkGuard", () => {
  let guard: ClerkGuard;
  let reflector: any;

  beforeEach(() => {
    jest.clearAllMocks();
    reflector = { getAllAndOverride: jest.fn() };
    guard = new ClerkGuard(reflector);
  });

  it("deve permitir acesso sem roles requeridas", async () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const result = await guard.canActivate(mockContext(undefined));
    expect(result).toBe(true);
  });

  it("deve bloquear sem token", async () => {
    reflector.getAllAndOverride.mockReturnValue(["ADMIN"]);
    await expect(guard.canActivate(mockContext(["ADMIN"]))).rejects.toThrow(UnauthorizedException);
  });

  it("deve bloquear role insuficiente", async () => {
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: { sub: "u1", role: "CUSTOMER" } });
    reflector.getAllAndOverride.mockReturnValue(["ADMIN"]);
    const ctx = mockContext(["ADMIN"], "Bearer fake-token");
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it("deve permitir admin com role correta", async () => {
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: { sub: "u1", role: "ADMIN" } });
    reflector.getAllAndOverride.mockReturnValue(["ADMIN"]);
    const ctx = mockContext(["ADMIN"], "Bearer fake-token");
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
  });

  it("deve bloquear token invalido", async () => {
    (jwtVerify as jest.Mock).mockRejectedValue(new Error("Invalid signature"));
    reflector.getAllAndOverride.mockReturnValue(["ADMIN"]);
    const ctx = mockContext(["ADMIN"], "Bearer invalid-token");
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });
});
