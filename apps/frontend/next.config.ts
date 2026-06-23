import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

const nextConfig: NextConfig = {
  // Fixa a raiz do Turbopack neste app para evitar o warning de múltiplos
  // lockfiles (raiz + apps/*).
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
