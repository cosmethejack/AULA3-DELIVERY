import { apiGet } from "./api";
import type { Category, Product } from "@/types";

export async function getCategories(): Promise<Category[]> {
  return apiGet("/catalog");
}

export async function getProducts(): Promise<Product[]> {
  const categories = await getCategories();
  return categories.flatMap((c) => c.products || []);
}

export async function getProduct(id: string): Promise<Product> {
  return apiGet(`/catalog/${id}`);
}
