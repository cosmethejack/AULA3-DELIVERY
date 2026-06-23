"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Order } from "@/types";
import { apiGet } from "@/services/api";

const ALL_STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED"];

const statusConfig: Record<string, { label: string; icon: string; color: string }> = {
  PENDING: { label: "Pedido Recebido", icon: "📋", color: "#ff9800" },
  CONFIRMED: { label: "Pagamento Confirmado", icon: "💳", color: "#2196f3" },
  PREPARING: { label: "Preparando", icon: "👨‍🍳", color: "#9c27b0" },
  SHIPPED: { label: "Saiu para Entrega", icon: "🚚", color: "#3f51b5" },
  DELIVERED: { label: "Entregue", icon: "✅", color: "#4caf50" },
};

export default function AcompanhamentoPage() {
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

  const currentIndex = ALL_STATUSES.indexOf(order.status);
  const isDelayed = order.status === "PREPARING" && new Date().getTime() - new Date(order.createdAt).getTime() > 30 * 60 * 1000;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", marginBottom: 16, fontSize: "1rem", color: "#666" }}>← Voltar</button>
      
      <h1 style={{ fontSize: "1.5rem", marginBottom: 4 }}>Acompanhamento</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>Pedido #{order.numero}</p>

      {isDelayed && (
        <div style={{ background: "#fff3e0", border: "1px solid #ff9800", borderRadius: 12, padding: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "1.5rem" }}>⏰</span>
          <div>
            <strong style={{ color: "#e65100" }}>Pedido atrasado</strong>
            <p style={{ fontSize: "0.9rem", color: "#bf360c" }}>Desculpe pelo atraso. Aqui está um cupom: <strong>ATRASO10</strong></p>
          </div>
        </div>
      )}

      {order.status === "CANCELLED" ? (
        <div style={{ background: "#ffebee", borderRadius: 12, padding: 24, textAlign: "center", marginBottom: 24 }}>
          <span style={{ fontSize: "2rem" }}>❌</span>
          <h2 style={{ color: "#c62828", marginTop: 8 }}>Pedido Cancelado</h2>
        </div>
      ) : (
        <div style={{ position: "relative", paddingLeft: 32 }}>
          <div style={{ position: "absolute", left: 15, top: 0, bottom: 0, width: 2, background: "#ddd" }} />
          {ALL_STATUSES.map((status, index) => {
            const config = statusConfig[status];
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={status} style={{ position: "relative", marginBottom: 32 }}>
                <div style={{
                  position: "absolute", left: -25, top: 0, width: 20, height: 20, borderRadius: "50%",
                  background: isActive ? config.color : "#eee",
                  border: isCurrent ? "3px solid " + config.color : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }} />
                <div style={{ opacity: isActive ? 1 : 0.4 }}>
                  <p style={{ fontWeight: isCurrent ? 700 : 400 }}>{config.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginTop: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Detalhes do Pedido</h3>
        {order.items.map((item) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #f0f0f0" }}>
            <span>{item.quantidade}x {item.product?.nome || "Produto"}</span>
            <span>{(item.precoUnitario * item.quantidade).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
          </div>
        ))}
        <p style={{ marginTop: 12 }}><strong>Endereço:</strong> {order.enderecoEntrega || "Não informado"}</p>
      </div>
    </div>
  );
}
