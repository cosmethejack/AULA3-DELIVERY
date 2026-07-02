import { validateEnv } from "./env.validation";

describe("validateEnv", () => {
  it("valida configuração completa e converte tipos", () => {
    const env = validateEnv({
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
      GLOBAL_PREFIX: "v1",
      BACKEND_PORT: "3001",
    });

    expect(env.DATABASE_URL).toBe("postgresql://user:pass@localhost:5432/db");
    expect(env.GLOBAL_PREFIX).toBe("v1");
    expect(env.BACKEND_PORT).toBe(3001);
  });

  it("aceita ausência das variáveis opcionais", () => {
    const env = validateEnv({ DATABASE_URL: "postgresql://x" });
    expect(env.BACKEND_PORT).toBeUndefined();
    expect(env.GLOBAL_PREFIX).toBeUndefined();
  });

  it("falha (fail-fast) quando DATABASE_URL está ausente", () => {
    expect(() => validateEnv({ GLOBAL_PREFIX: "v1" })).toThrow(
      /Configuração de ambiente inválida/,
    );
  });

  it("falha quando DATABASE_URL está vazia", () => {
    expect(() => validateEnv({ DATABASE_URL: "" })).toThrow(
      /Configuração de ambiente inválida/,
    );
  });

  it("falha quando BACKEND_PORT não é um inteiro válido", () => {
    expect(() =>
      validateEnv({ DATABASE_URL: "postgresql://x", BACKEND_PORT: "não-numérico" }),
    ).toThrow(/Configuração de ambiente inválida/);
  });

  it("falha quando BACKEND_PORT está fora do intervalo de portas", () => {
    expect(() =>
      validateEnv({ DATABASE_URL: "postgresql://x", BACKEND_PORT: "70000" }),
    ).toThrow(/Configuração de ambiente inválida/);
  });
});
