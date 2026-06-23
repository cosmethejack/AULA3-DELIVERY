"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Order } from "@/types";

const statusColors: Record<string, string> = {
  PENDING: "#ff9800", CONFIRMED: "#2196f3", PREPARING: "#9c27b0",
  SHIPPED: "#3f51b5", DELIVERED: "#4caf50", CANCELLED: "#f44336",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendente", CONFIRMED: "Confirmado", PREPARING: "Preparando",
  SHIPPED: "Enviado", DELIVERED: "Entregue", CANCELLED: "Cancelado",
};

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("customer-token");
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    fetch("/api/orders", { headers })
      .then((res) => res.json())
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: "center", padding: 48 }}>Carregando...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: 24 }}>Meus Pedidos</h1>
      {orders.length === 0 && <p style={{ color: "#999" }}>Nenhum pedido encontrado</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {orders.map((order) => (
          <Link key={order.id} href={`/pedidos/${order.id}/acompanhamento`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>#{order.numero}</strong>
                <p style={{ fontSize: "0.85rem", color: "#666", marginTop: 4 }}>
                  {new Date(order.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>
              <span style={{ padding: "4px 12px", borderRadius: 12, background: (statusColors[order.status] || "#999") + "20", color: statusColors[order.status] || "#999", fontWeight: 600, fontSize: "0.85rem" }}>
                {statusLabels[order.status] || order.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
