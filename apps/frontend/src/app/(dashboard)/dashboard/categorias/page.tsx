"use client";

import { useState, useEffect } from "react";
import { authedGet, authedPost, authedDelete } from "@/services/api-admin";
import type { Category } from "@/types";

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");

  async function load() {
    try {
      const data = await authedGet<Category[]>("/catalog");
      setCategories(data);
    } catch { /* ignore */ }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function addCategory() {
    if (!nome.trim()) return;
    try {
      await authedPost("/catalog/categories", { nome });
      setNome("");
      load();
    } catch { /* ignore */ }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Excluir categoria?")) return;
    try {
      await authedDelete(`/catalog/categories/${id}`);
      load();
    } catch { /* ignore */ }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", marginBottom: 24 }}>Categorias</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da categoria" style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
        <button onClick={addCategory} style={{ padding: "10px 20px", background: "#4caf50", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Adicionar</button>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        {categories.map((cat) => (
          <div key={cat.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #eee" }}>
            <span>{cat.nome}</span>
            <button onClick={() => deleteCategory(cat.id)} style={{ padding: "4px 12px", background: "#f44336", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
}
