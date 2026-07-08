import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { CartDrawer } from "./CartDrawer";
import { CartProvider, useCart } from "@/context/CartContext";
import type { Product } from "@/types";

const prod = (id: string, preco = 10): Product => ({
  id,
  nome: "Item " + id,
  descricao: "",
  preco,
  imagem: "",
  estoque: 10,
  ativo: true,
  categoriaId: "c",
});

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;

// Helper que expõe addItem para semear o carrinho antes das asserções.
function Seeder({ onReady }: { onReady: (add: ReturnType<typeof useCart>["addItem"]) => void }) {
  const { addItem } = useCart();
  onReady(addItem);
  return null;
}

describe("CartDrawer", () => {
  beforeEach(() => localStorage.clear());

  it("mostra 'Carrinho vazio' quando não há itens", () => {
    render(<CartDrawer onCheckout={() => {}} />, { wrapper });
    expect(screen.getByText("Carrinho vazio")).toBeInTheDocument();
  });

  it("lista itens, total e aciona checkout", () => {
    const onCheckout = vi.fn();
    let add: ReturnType<typeof useCart>["addItem"] = () => {};
    render(
      <CartProvider>
        <Seeder onReady={(a) => (add = a)} />
        <CartDrawer onCheckout={onCheckout} />
      </CartProvider>,
    );

    act(() => add(prod("1", 10), 2));

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Carrinho (2)")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Finalizar Pedido"));
    expect(onCheckout).toHaveBeenCalled();
  });

  it("controles de quantidade e remoção atualizam o carrinho", () => {
    let add: ReturnType<typeof useCart>["addItem"] = () => {};
    render(
      <CartProvider>
        <Seeder onReady={(a) => (add = a)} />
        <CartDrawer onCheckout={() => {}} />
      </CartProvider>,
    );

    act(() => add(prod("1"), 1));
    expect(screen.getByText("Carrinho (1)")).toBeInTheDocument();

    fireEvent.click(screen.getByText("+"));
    expect(screen.getByText("Carrinho (2)")).toBeInTheDocument();

    fireEvent.click(screen.getByText("×"));
    expect(screen.getByText("Carrinho (0)")).toBeInTheDocument();
    expect(screen.getByText("Carrinho vazio")).toBeInTheDocument();
  });
});
