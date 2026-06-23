"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authedGet, authedPost, authedPatch, authedDelete } from "@/services/api-admin";
import type { Product } from "@/types";

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const router = useRouter();

  async function loadProducts() {
    try {
      const data = await authedGet<any[]>("/catalog");
      const all = data.flatMap((c: any) => c.products || []);
      setProducts(all);
    } catch { /* ignore */ }
    setLoading(false);
  }

  useEffect(() => { loadProducts(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editId) {
        await authedPatch(`/catalog/${editId}`, { nome, descricao, preco: parseFloat(preco) });
      } else {
        await authedPost("/catalog", { nome, descricao, preco: parseFloat(preco) });
      }
      setShowForm(false);
      setEditId(null);
      setNome(""); setDescricao(""); setPreco("");
      loadProducts();
    } catch { /* ignore */ }
  }

  function editProduct(p: Product) {
    setEditId(p.id);
    setNome(p.nome);
    setDescricao(p.descricao);
    setPreco(p.preco.toString());
    setShowForm(true);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Excluir produto?")) return;
    try {
      await authedDelete(`/catalog/${id}`);
      loadProducts();
    } catch { /* ignore */ }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.5rem" }}>Produtos</h1>
        <button onClick={() => { setEditId(null); setNome(""); setDescricao(""); setPreco(""); setShowForm(!showForm); }} style={{ padding: "10px 20px", background: "#e53935", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
          {showForm ? "Cancelar" : "Novo Produto"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 24 }}>
          <h2 style={{ marginBottom: 16 }}>{editId ? "Editar" : "Novo"} Produto</h2>
          <div style={{ marginBottom: 12 }}><input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }} /></div>
          <div style={{ marginBottom: 12 }}><textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }} /></div>
          <div style={{ marginBottom: 16 }}><input type="number" step="0.01" placeholder="Preço" value={preco} onChange={(e) => setPreco(e.target.value)} required style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }} /></div>
          <button type="submit" style={{ padding: "10px 24px", background: "#4caf50", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Salvar</button>
        </form>
      )}

      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#fafafa", textAlign: "left" }}>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Nome</th>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Preço</th>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Estoque</th>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Ações</th>
          </tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: 12 }}>{p.nome}</td>
                <td style={{ padding: 12 }}>{p.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                <td style={{ padding: 12 }}>{p.estoque}</td>
                <td style={{ padding: 12, display: "flex", gap: 8 }}>
                  <button onClick={() => editProduct(p)} style={{ padding: "4px 12px", background: "#2196f3", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Editar</button>
                  <button onClick={() => deleteProduct(p.id)} style={{ padding: "4px 12px", background: "#f44336", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
