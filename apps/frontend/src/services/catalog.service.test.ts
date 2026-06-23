import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./api", () => ({
  apiGet: vi.fn(),
}));

import { apiGet } from "./api";
import { getProducts } from "./catalog.service";

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
