import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Delivery - Peça sua comida favorita",
  description: "Delivery online de refeições",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
