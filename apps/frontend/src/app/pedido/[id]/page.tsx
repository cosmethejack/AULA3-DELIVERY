"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Order } from "@/types";
import { apiGet } from "@/services/api";

export default function OrderConfirmPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      apiGet<Order>(`/orders/${id}`)
        .then(setOrder)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p style={{ textAlign: "center", padding: 48 }}>Carregando...</p>;
  if (!order) return <p style={{ textAlign: "center", padding: 48 }}>Pedido não encontrado</p>;

  const statusMap: Record<string, string> = {
    PENDING: "Pendente", CONFIRMED: "Confirmado", PREPARING: "Preparando",
    SHIPPED: "Enviado", DELIVERED: "Entregue", CANCELLED: "Cancelado",
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
      <h1 style={{ fontSize: "1.8rem", marginBottom: 8 }}>Pedido Confirmado!</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>Nº {order.numero}</p>
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 24, textAlign: "left" }}>
        <p><strong>Status:</strong> {statusMap[order.status] || order.status}</p>
        <p><strong>Endereço:</strong> {order.enderecoEntrega || "Não informado"}</p>
        <h3 style={{ marginTop: 16, marginBottom: 8 }}>Itens</h3>
        {order.items.map((item) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
            <span>{item.quantidade}x {item.product?.nome || "Produto"}</span>
            <span>{(item.precoUnitario * item.quantidade).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
          </div>
        ))}
      </div>
      <button onClick={() => router.push("/")} style={{
        padding: "12px 32px", background: "#e53935", color: "#fff", border: "none",
        borderRadius: 8, fontSize: "1rem", fontWeight: 600, cursor: "pointer",
      }}>
        Voltar ao Cardápio
      </button>
    </div>
  );
}
