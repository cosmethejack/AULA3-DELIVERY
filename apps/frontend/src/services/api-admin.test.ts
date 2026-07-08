import { describe, it, expect } from "vitest";
import * as adminApi from "./api-admin";

describe("api-admin", () => {
  it("re-exporta os métodos autenticados do cliente base", () => {
    expect(typeof adminApi.authedGet).toBe("function");
    expect(typeof adminApi.authedPost).toBe("function");
    expect(typeof adminApi.authedPatch).toBe("function");
    expect(typeof adminApi.authedDelete).toBe("function");
  });
});
