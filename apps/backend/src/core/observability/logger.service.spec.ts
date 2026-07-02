import { trace } from "@opentelemetry/api";
import { AppLogger, redact } from "./logger.service";

describe("redact", () => {
  it("ofusca chaves sensíveis (inclusive aninhadas) e preserva o resto", () => {
    const out = redact({
      email: "a@b.com",
      password: "123",
      nested: { token: "abc", nome: "Ana" },
      list: [{ secret: "x" }],
    }) as any;

    expect(out.email).toBe("a@b.com");
    expect(out.password).toBe("[REDACTED]");
    expect(out.nested.token).toBe("[REDACTED]");
    expect(out.nested.nome).toBe("Ana");
    expect(out.list[0].secret).toBe("[REDACTED]");
  });

  it("retorna valores primitivos inalterados", () => {
    expect(redact("texto")).toBe("texto");
    expect(redact(42)).toBe(42);
  });
});

describe("AppLogger", () => {
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  const lastEntry = (spy: jest.SpyInstance) => JSON.parse(spy.mock.calls.at(-1)![0] as string);

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => jest.restoreAllMocks());

  it("emite os campos mínimos obrigatórios", () => {
    new AppLogger().log("olá", "TestCtx");

    const entry = lastEntry(logSpy);
    expect(entry).toMatchObject({
      level: "info",
      service: "backend",
      message: "olá",
      context: "TestCtx",
    });
    expect(entry).toHaveProperty("timestamp");
    expect(entry).toHaveProperty("trace_id");
    expect(entry).toHaveProperty("user_id");
  });

  it("ofusca dados sensíveis na mensagem estruturada", () => {
    new AppLogger().log({ user: "ana", password: "segredo" });

    const entry = lastEntry(logSpy);
    expect(entry.message.password).toBe("[REDACTED]");
    expect(entry.message.user).toBe("ana");
  });

  it("correlaciona trace_id/span_id com o span ativo", () => {
    jest.spyOn(trace, "getActiveSpan").mockReturnValue({
      spanContext: () => ({ traceId: "trace-abc", spanId: "span-xyz", traceFlags: 1 }),
    } as any);

    new AppLogger().log("com span");

    const entry = lastEntry(logSpy);
    expect(entry.trace_id).toBe("trace-abc");
    expect(entry.span_id).toBe("span-xyz");
  });

  it("emite trace_id vazio quando não há span ativo", () => {
    jest.spyOn(trace, "getActiveSpan").mockReturnValue(undefined);

    new AppLogger().log("sem span");

    expect(lastEntry(logSpy).trace_id).toBe("");
  });

  it("inclui os ids de contexto definidos via setContext", () => {
    const logger = new AppLogger();
    logger.setContext({ userId: "u-1", requestId: "r-1" });
    logger.warn("aviso");

    const entry = lastEntry(logSpy);
    expect(entry.user_id).toBe("u-1");
    expect(entry.request_id).toBe("r-1");
  });

  it("usa console.error para nível error e mantém o trace", () => {
    new AppLogger().error("falhou", "stacktrace");

    const entry = lastEntry(errorSpy);
    expect(entry.level).toBe("error");
    expect(entry.trace).toBe("stacktrace");
  });

  it("cobre os demais níveis (debug/verbose)", () => {
    const logger = new AppLogger();
    logger.debug("d");
    logger.verbose("v");
    expect(logSpy).toHaveBeenCalled();
  });

  it("setContext com objeto vazio limpa os ids", () => {
    const logger = new AppLogger();
    logger.setContext({});
    logger.log("x");
    const entry = lastEntry(logSpy);
    expect(entry.user_id).toBe("");
    expect(entry.request_id).toBe("");
  });
});
