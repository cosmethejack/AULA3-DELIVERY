import { apiPost } from "./api";
import type { Order } from "@/types";

export async function createOrder(data: {
  clienteId: string;
  items: { produtoId: string; quantidade: number }[];
  enderecoEntrega?: string;
}): Promise<Order> {
  return apiPost("/orders", data);
}
