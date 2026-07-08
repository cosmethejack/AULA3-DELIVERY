import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";
import { ProductCard } from "./ProductCard";
import { CartProvider, useCart } from "@/context/CartContext";
import type { Product } from "@/types";

const prod = (over: Partial<Product> = {}): Product => ({
  id: "p1",
  nome: "Coca-Cola",
  descricao: "",
  preco: 4.5,
  imagem: "http://img",
  estoque: 10,
  ativo: true,
  categoriaId: "c1",
  ...over,
});

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;

describe("ProductCard", () => {
  beforeEach(() => localStorage.clear());

  it("mostra nome e preço formatado em BRL", () => {
    render(<ProductCard product={prod()} />, { wrapper });
    expect(screen.getByText("Coca-Cola")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?4,50/)).toBeInTheDocument();
  });

  it("botão 'Adicionar' adiciona o produto ao carrinho", () => {
    let count = 0;
    function Probe() {
      count = useCart().itemCount;
      return null;
    }
    render(
      <CartProvider>
        <ProductCard product={prod()} />
        <Probe />
      </CartProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Adicionar" }));
    expect(count).toBe(1);
  });

  it("fica 'Indisponível' e desabilitado quando sem estoque", () => {
    render(<ProductCard product={prod({ estoque: 0 })} />, { wrapper });
    const btn = screen.getByRole("button", { name: "Indisponível" });
    expect(btn).toBeDisabled();
  });
});
