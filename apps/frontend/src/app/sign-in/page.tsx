"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError("Credenciais inválidas");
        return;
      }

      const data = await res.json();
      localStorage.setItem("admin-token", data.token);
      router.push("/dashboard/resumo");
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", width: "100%", maxWidth: 400 }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: 24, textAlign: "center" }}>Admin Delivery</h1>
        {error && <p style={{ color: "#e53935", marginBottom: 12, textAlign: "center" }}>{error}</p>}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Senha</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
        </div>
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 12, background: "#e53935", color: "#fff", border: "none", borderRadius: 8, fontSize: "1rem", fontWeight: 600, cursor: "pointer" }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
