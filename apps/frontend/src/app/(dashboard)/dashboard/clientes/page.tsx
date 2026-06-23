"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authedGet } from "@/services/api-admin";
import type { Customer } from "@/types";

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    authedGet<Customer[]>("/customers")
      .then(setCustomers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", marginBottom: 24 }}>Clientes</h1>
      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#fafafa", textAlign: "left" }}>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Nome</th>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Email</th>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Telefone</th>
          </tr></thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #f0f0f0", cursor: "pointer" }} onClick={() => router.push(`/dashboard/clientes/${c.id}`)}>
                <td style={{ padding: 12 }}>{c.nome}</td>
                <td style={{ padding: 12 }}>{c.email}</td>
                <td style={{ padding: 12 }}>{c.telefone || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
