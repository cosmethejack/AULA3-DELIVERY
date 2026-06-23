"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProduct } from "@/services/catalog.service";
import { CartProvider, useCart } from "@/context/CartContext";
import type { Product } from "@/types";

function ProductDetailContent() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (id) getProduct(id).then(setProduct).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ textAlign: "center", padding: 48 }}>Carregando...</p>;
  if (!product) return <p style={{ textAlign: "center", padding: 48 }}>Produto não encontrado</p>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", marginBottom: 16, fontSize: "1rem", color: "#666" }}>← Voltar</button>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <img src={product.imagem} alt={product.nome} style={{ width: "100%", maxWidth: 400, borderRadius: 12, objectFit: "cover" }} />
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>{product.nome}</h1>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#e53935", marginBottom: 16 }}>
            {product.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
          <p style={{ color: "#555", marginBottom: 24, lineHeight: 1.6 }}>{product.descricao}</p>
          <button
            onClick={() => { addItem(product); router.push("/checkout"); }}
            disabled={product.estoque <= 0}
            style={{
              padding: "14px 32px", background: "#e53935", color: "#fff", border: "none",
              borderRadius: 8, fontSize: "1.1rem", fontWeight: 600, cursor: "pointer",
            }}
          >
            {product.estoque > 0 ? "Adicionar ao Carrinho" : "Indisponível"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <CartProvider>
      <ProductDetailContent />
    </CartProvider>
  );
}
