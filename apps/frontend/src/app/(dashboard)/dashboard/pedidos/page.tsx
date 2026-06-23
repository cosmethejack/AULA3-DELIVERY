"use client";

import { useState, useEffect } from "react";
import { authedGet, authedPatch } from "@/services/api-admin";
import type { Order } from "@/types";

const statusColors: Record<string, string> = {
  PENDING: "#ff9800", CONFIRMED: "#2196f3", PREPARING: "#9c27b0",
  SHIPPED: "#3f51b5", DELIVERED: "#4caf50", CANCELLED: "#f44336",
};

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      const data = await authedGet<Order[]>("/orders");
      setOrders(data);
    } catch { /* ignore */ }
    setLoading(false);
  }

  useEffect(() => { loadOrders(); }, []);

  async function advanceStatus(id: string, status: string) {
    try {
      await authedPatch(`/orders/${id}/status`, { status });
      loadOrders();
    } catch { /* ignore */ }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", marginBottom: 24 }}>Pedidos</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {orders.map((order) => (
          <div key={order.id} style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>#{order.numero}</strong>
              <span style={{ marginLeft: 12, color: "#666" }}>{order.customer?.nome || "N/A"}</span>
              <span style={{ marginLeft: 12, padding: "4px 12px", borderRadius: 12, background: statusColors[order.status] + "20", color: statusColors[order.status], fontWeight: 600, fontSize: "0.8rem" }}>
                {order.status}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {order.status === "PENDING" && <button onClick={() => advanceStatus(order.id, "CONFIRMED")} style={{ padding: "6px 16px", background: "#2196f3", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Confirmar</button>}
              {order.status === "CONFIRMED" && <button onClick={() => advanceStatus(order.id, "PREPARING")} style={{ padding: "6px 16px", background: "#9c27b0", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Preparar</button>}
              {order.status === "PREPARING" && <button onClick={() => advanceStatus(order.id, "SHIPPED")} style={{ padding: "6px 16px", background: "#3f51b5", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Despachar</button>}
              {order.status === "SHIPPED" && <button onClick={() => advanceStatus(order.id, "DELIVERED")} style={{ padding: "6px 16px", background: "#4caf50", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Entregar</button>}
              {!["DELIVERED", "CANCELLED"].includes(order.status) && (
                <button onClick={() => advanceStatus(order.id, "CANCELLED")} style={{ padding: "6px 16px", background: "#f44336", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Cancelar</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
