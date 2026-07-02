import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiGet, apiPost, apiPatch, apiDelete } from "./api";

const okJson = (data: unknown) => ({ ok: true, json: async () => data });
const fail = (status = 500, statusText = "Erro") => ({ ok: false, status, statusText });

describe("api client", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    localStorage.clear();
  });
  afterEach(() => vi.unstubAllGlobals());

  it("apiGet resolve JSON sem token (headers vazios)", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(okJson({ a: 1 }));
    const r = await apiGet<{ a: number }>("/x");
    expect(r).toEqual({ a: 1 });
    expect(fetch).toHaveBeenCalledWith("/api/x", { headers: {} });
  });

  it("apiGet injeta Authorization quando há token", async () => {
    localStorage.setItem("admin-token", "tkn");
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(okJson({}));
    await apiGet("/x");
    expect(fetch).toHaveBeenCalledWith("/api/x", { headers: { Authorization: "Bearer tkn" } });
  });

  it("apiGet lança em resposta não-ok", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(fail(404, "Not Found"));
    await expect(apiGet("/x")).rejects.toThrow(/404/);
  });

  it("apiPost envia body e Content-Type", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(okJson({ id: 1 }));
    await apiPost("/y", { n: 2 });
    expect(fetch).toHaveBeenCalledWith(
      "/api/y",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ n: 2 }),
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
      }),
    );
  });

  it("apiPost lança em erro", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(fail());
    await expect(apiPost("/y", {})).rejects.toThrow();
  });

  it("apiPatch envia método PATCH", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(okJson({}));
    await apiPatch("/z", { a: 1 });
    expect(fetch).toHaveBeenCalledWith("/api/z", expect.objectContaining({ method: "PATCH" }));
  });

  it("apiPatch lança em erro", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(fail());
    await expect(apiPatch("/z", {})).rejects.toThrow();
  });

  it("apiDelete envia método DELETE e resolve", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(okJson({ ok: true }));
    await apiDelete("/d");
    expect(fetch).toHaveBeenCalledWith("/api/d", expect.objectContaining({ method: "DELETE" }));
  });

  it("apiDelete lança em erro", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(fail());
    await expect(apiDelete("/d")).rejects.toThrow();
  });
});
