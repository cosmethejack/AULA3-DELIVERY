import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./api", () => ({
  apiGet: vi.fn(),
}));

import { apiGet } from "./api";
import { getProducts, getCategories, getProduct } from "./catalog.service";

describe("catalog.service.getCategories/getProduct", () => {
  beforeEach(() => vi.clearAllMocks());

  it("getCategories delega para apiGet('/catalog')", async () => {
    (apiGet as ReturnType<typeof vi.fn>).mockResolvedValue([{ id: "1", nome: "Bebidas" }]);
    const cats = await getCategories();
    expect(apiGet).toHaveBeenCalledWith("/catalog");
    expect(cats).toHaveLength(1);
  });

  it("getProduct delega para apiGet('/catalog/:id')", async () => {
    (apiGet as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "p1", nome: "Coca" });
    const p = await getProduct("p1");
    expect(apiGet).toHaveBeenCalledWith("/catalog/p1");
    expect(p.nome).toBe("Coca");
  });
});

describe("catalog.service.getProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("achata os produtos de todas as categorias", async () => {
    (apiGet as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: "1", nome: "Bebidas", products: [{ id: "p1", nome: "Coca" }] },
      { id: "2", nome: "Lanches", products: [{ id: "p2", nome: "X-Burger" }] },
    ]);

    const produtos = await getProducts();

    expect(produtos).toHaveLength(2);
    expect(produtos.map((p) => p.nome)).toEqual(["Coca", "X-Burger"]);
  });

  it("ignora categorias sem lista de produtos", async () => {
    (apiGet as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: "1", nome: "Vazia" },
      { id: "2", nome: "Lanches", products: [{ id: "p2", nome: "X-Burger" }] },
    ]);

    const produtos = await getProducts();

    expect(produtos).toHaveLength(1);
    expect(produtos[0].nome).toBe("X-Burger");
  });
});
