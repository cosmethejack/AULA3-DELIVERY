import { AuthService } from "../auth.service";

type FetchResult = { ok: boolean; json?: () => Promise<any> };

function res(ok: boolean, body: any = {}): FetchResult {
  return { ok, json: () => Promise.resolve(body) };
}

describe("AuthService", () => {
  let service: AuthService;
  let fetchMock: jest.Mock;
  const OLD_ENV = process.env.CLERK_SECRET_KEY;

  beforeEach(() => {
    process.env.CLERK_SECRET_KEY = "sk_test_123";
    service = new AuthService();
    fetchMock = jest.fn();
    global.fetch = fetchMock as any;
  });

  afterEach(() => {
    process.env.CLERK_SECRET_KEY = OLD_ENV;
    jest.restoreAllMocks();
  });

  it("login retorna token no fluxo feliz (formato data.data)", async () => {
    fetchMock
      .mockResolvedValueOnce(res(true, { data: [{ id: "user_1" }] })) // findUserByEmail
      .mockResolvedValueOnce(res(true, { verified: true })) // verifyPassword
      .mockResolvedValueOnce(res(true, { id: "sess_1" })) // createSession
      .mockResolvedValueOnce(res(true, { jwt: "jwt_abc" })); // mintToken

    const result = await service.login("ana@x.com", "senha");

    expect(result).toEqual({ token: "jwt_abc" });
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("aceita resposta de usuário no formato array", async () => {
    fetchMock
      .mockResolvedValueOnce(res(true, [{ id: "user_arr" }]))
      .mockResolvedValueOnce(res(true, { verified: true }))
      .mockResolvedValueOnce(res(true, { id: "sess_1" }))
      .mockResolvedValueOnce(res(true, { jwt: "jwt_arr" }));

    await expect(service.login("ana@x.com", "senha")).resolves.toEqual({ token: "jwt_arr" });
  });

  it("lança InternalServerError quando CLERK_SECRET_KEY não está configurada", async () => {
    delete process.env.CLERK_SECRET_KEY;
    await expect(service.login("ana@x.com", "senha")).rejects.toThrow("CLERK_SECRET_KEY");
  });

  it("lança Unauthorized quando usuário não é encontrado", async () => {
    fetchMock.mockResolvedValueOnce(res(true, { data: [] }));
    await expect(service.login("nao@existe.com", "senha")).rejects.toThrow("Credenciais inválidas");
  });

  it("lança InternalServerError quando a consulta de usuário falha", async () => {
    fetchMock.mockResolvedValueOnce(res(false));
    await expect(service.login("ana@x.com", "senha")).rejects.toThrow("consultar usuário");
  });

  it("lança Unauthorized quando a verificação de senha falha (res !ok)", async () => {
    fetchMock
      .mockResolvedValueOnce(res(true, { data: [{ id: "user_1" }] }))
      .mockResolvedValueOnce(res(false));
    await expect(service.login("ana@x.com", "errada")).rejects.toThrow("Credenciais inválidas");
  });

  it("lança Unauthorized quando verified === false", async () => {
    fetchMock
      .mockResolvedValueOnce(res(true, { data: [{ id: "user_1" }] }))
      .mockResolvedValueOnce(res(true, { verified: false }));
    await expect(service.login("ana@x.com", "errada")).rejects.toThrow("Credenciais inválidas");
  });

  it("lança InternalServerError quando a criação de sessão falha", async () => {
    fetchMock
      .mockResolvedValueOnce(res(true, { data: [{ id: "user_1" }] }))
      .mockResolvedValueOnce(res(true, { verified: true }))
      .mockResolvedValueOnce(res(false));
    await expect(service.login("ana@x.com", "senha")).rejects.toThrow("criar sessão");
  });

  it("lança InternalServerError quando a geração de token falha", async () => {
    fetchMock
      .mockResolvedValueOnce(res(true, { data: [{ id: "user_1" }] }))
      .mockResolvedValueOnce(res(true, { verified: true }))
      .mockResolvedValueOnce(res(true, { id: "sess_1" }))
      .mockResolvedValueOnce(res(false));
    await expect(service.login("ana@x.com", "senha")).rejects.toThrow("gerar token");
  });
});