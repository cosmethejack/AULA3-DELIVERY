import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./api", () => ({ apiPost: vi.fn() }));

import { apiPost } from "./api";
import { createOrder } from "./orders.service";

describe("orders.service.createOrder", () => {
  beforeEach(() => vi.clearAllMocks());

  it("envia o pedido via apiPost e retorna o resultado", async () => {
    (apiPost as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "o1", numero: "ORD-1" });

    const data = {
      clienteId: "c1",
      items: [{ produtoId: "p1", quantidade: 2 }],
      enderecoEntrega: "Rua A",
    };
    const order = await createOrder(data);

    expect(apiPost).toHaveBeenCalledWith("/orders", data);
    expect(order).toEqual({ id: "o1", numero: "ORD-1" });
  });
});
