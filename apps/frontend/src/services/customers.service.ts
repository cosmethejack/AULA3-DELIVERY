import { apiPost } from "./api";
import type { Customer } from "@/types";

export async function createCustomer(data: {
  nome: string;
  email: string;
  endereco?: string;
  telefone?: string;
}): Promise<Customer> {
  return apiPost("/customers", data);
}
