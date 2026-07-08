import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./api", () => ({ apiPost: vi.fn() }));

import { apiPost } from "./api";
import { createCustomer } from "./customers.service";

describe("customers.service.createCustomer", () => {
  beforeEach(() => vi.clearAllMocks());

  it("envia o cliente via apiPost e retorna o resultado", async () => {
    (apiPost as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "cli-1" });

    const data = { nome: "Ana", email: "ana@x.com", telefone: "9999" };
    const customer = await createCustomer(data);

    expect(apiPost).toHaveBeenCalledWith("/customers", data);
    expect(customer).toEqual({ id: "cli-1" });
  });
});
