"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const sidebarLinks = [
  { href: "/dashboard/resumo", label: "Resumo" },
  { href: "/dashboard/pedidos", label: "Pedidos" },
  { href: "/dashboard/produtos", label: "Produtos" },
  { href: "/dashboard/categorias", label: "Categorias" },
  { href: "/dashboard/clientes", label: "Clientes" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/sign-in");
    } else {
      setAuthed(true);
    }
    setLoading(false);
  }, [router]);

  if (loading) return <p style={{ textAlign: "center", padding: 48 }}>Carregando...</p>;
  if (!authed) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <nav style={{ width: 240, background: "#1a1a2e", color: "#fff", padding: 24 }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: 24 }}>Delivery Admin</h2>
        {sidebarLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              display: "block", padding: "10px 16px", borderRadius: 8, marginBottom: 4,
              textDecoration: "none", color: "#fff", background: pathname === link.href ? "rgba(255,255,255,0.1)" : "transparent",
            }}
          >
            {link.label}
          </a>
        ))}
        <button
          onClick={() => { localStorage.removeItem("admin-token"); router.push("/sign-in"); }}
          style={{ marginTop: 32, background: "none", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "8px 16px", borderRadius: 8, cursor: "pointer", width: "100%" }}
        >
          Sair
        </button>
      </nav>
      <main style={{ flex: 1, padding: 32, background: "#f5f5f5" }}>{children}</main>
    </div>
  );
}
