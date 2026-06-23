"use client";

import { useState, useEffect } from "react";
import { authedGet } from "@/services/api-admin";

interface Summary {
  vendasTotais: number;
  recebido: number;
  pendente: number;
  top5Produtos: { produto: string; quantidade: number }[];
}

export default function DashboardResumoPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authedGet<Summary>("/dashboard/summary")
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (!data) return <p>Erro ao carregar métricas</p>;

  const cards = [
    { label: "Vendas Totais", value: data.vendasTotais.toString() },
    { label: "Recebido", value: data.recebido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) },
    { label: "Pendente", value: data.pendente.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", marginBottom: 24 }}>Resumo</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {cards.map((card) => (
          <div key={card.label} style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <p style={{ color: "#666", marginBottom: 8 }}>{card.label}</p>
            <p style={{ fontSize: "1.8rem", fontWeight: 700 }}>{card.value}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <h2 style={{ marginBottom: 16 }}>Top 5 Produtos</h2>
        {data.top5Produtos.map((p, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <span>{i + 1}. {p.produto}</span>
            <span>{p.quantidade} vendidos</span>
          </div>
        ))}
      </div>
    </div>
  );
}
