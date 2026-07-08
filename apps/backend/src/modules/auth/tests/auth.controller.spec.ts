import { AuthController } from "../auth.controller";

describe("AuthController", () => {
  it("login delega email e senha para o service", () => {
    const authService = { login: jest.fn().mockReturnValue({ token: "t" }) };
    const controller = new AuthController(authService as any);

    const result = controller.login({ email: "ana@x.com", password: "senha" } as any);

    expect(result).toEqual({ token: "t" });
    expect(authService.login).toHaveBeenCalledWith("ana@x.com", "senha");
  });
});