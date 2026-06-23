"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCategories } from "@/services/catalog.service";
import { CartProvider, useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { CartDrawer } from "@/components/CartDrawer";
import type { Category, Product } from "@/types";

function HomeContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { itemCount } = useCart();

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error).finally(() => setLoading(false));
  }, []);

  const allProducts = categories.flatMap((c) => c.products || []);
  const filtered = selectedCategory
    ? allProducts.filter((p) => p.categoriaId === selectedCategory)
    : allProducts;

  if (loading) return <p style={{ textAlign: "center", padding: 48 }}>Carregando...</p>;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.8rem" }}>Delivery</h1>
        <button
          style={{ background: "none", border: "1px solid #ddd", borderRadius: 8, padding: "8px 16px", cursor: "pointer", position: "relative" }}
          onClick={() => router.push("/checkout")}
        >
          🛒 Carrinho {itemCount > 0 && <span style={{ background: "#e53935", color: "#fff", borderRadius: 10, padding: "2px 8px", fontSize: "0.8rem", marginLeft: 4 }}>{itemCount}</span>}
        </button>
      </header>
      <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {filtered.map((product) => (
            <div key={product.id} onClick={() => router.push(`/produtos/${product.id}`)} style={{ cursor: "pointer" }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <CartDrawer onCheckout={() => router.push("/checkout")} />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <CartProvider>
      <HomeContent />
    </CartProvider>
  );
}
