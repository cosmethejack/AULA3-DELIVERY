"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CartProvider, useCart } from "@/context/CartContext";
import { createCustomer } from "@/services/customers.service";
import { createOrder } from "@/services/orders.service";

function CheckoutContent() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const customer = await createCustomer({ nome, email, endereco, telefone });
      const order = await createOrder({
        clienteId: customer.id,
        items: items.map((i) => ({ produtoId: i.product.id, quantidade: i.quantidade })),
        enderecoEntrega: endereco,
      });
      clearCart();
      router.push(`/pedido/${order.id}`);
    } catch (err) {
      setError("Erro ao processar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: 24 }}>Checkout</h1>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <form onSubmit={handleSubmit} style={{ flex: 1, minWidth: 280 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Nome</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} required style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Telefone</label>
            <input value={telefone} onChange={(e) => setTelefone(e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Endereço de Entrega</label>
            <textarea value={endereco} onChange={(e) => setEndereco(e.target.value)} required rows={3} style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
          </div>
          {error && <p style={{ color: "#e53935", marginBottom: 12 }}>{error}</p>}
          <button type="submit" disabled={loading || items.length === 0} style={{
            width: "100%", padding: 14, background: "#e53935", color: "#fff", border: "none",
            borderRadius: 8, fontSize: "1.1rem", fontWeight: 600, cursor: "pointer",
            opacity: loading || items.length === 0 ? 0.6 : 1,
          }}>
            {loading ? "Processando..." : `Finalizar - ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`}
          </button>
        </form>
        <div style={{ minWidth: 280 }}>
          <h2 style={{ marginBottom: 16 }}>Seu Pedido</h2>
          {items.map((item) => (
            <div key={item.product.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <span>{item.quantidade}x {item.product.nome}</span>
              <span>{(item.product.preco * item.quantidade).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: "1.2rem", fontWeight: 700 }}>
            <span>Total</span>
            <span>{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <CartProvider>
      <CheckoutContent />
    </CartProvider>
  );
}
