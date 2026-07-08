import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { CartProvider, useCart } from "./CartContext";
import type { Product } from "@/types";

const prod = (id: string, preco = 10): Product => ({
  id,
  nome: "P" + id,
  descricao: "",
  preco,
  imagem: "",
  estoque: 5,
  ativo: true,
  categoriaId: "c",
});

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;

describe("CartContext", () => {
  beforeEach(() => localStorage.clear());

  it("addItem adiciona novo item e incrementa o existente", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(prod("1"), 2));
    expect(result.current.itemCount).toBe(2);
    act(() => result.current.addItem(prod("1")));
    expect(result.current.itemCount).toBe(3);
    expect(result.current.items).toHaveLength(1);
  });

  it("total soma preço × quantidade", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(prod("1", 10), 2);
      result.current.addItem(prod("2", 5), 1);
    });
    expect(result.current.total).toBe(25);
  });

  it("updateQuantidade atualiza e remove quando quantidade <= 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(prod("1")));
    act(() => result.current.updateQuantidade("1", 5));
    expect(result.current.itemCount).toBe(5);
    act(() => result.current.updateQuantidade("1", 0));
    expect(result.current.items).toHaveLength(0);
  });

  it("removeItem e clearCart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(prod("1"));
      result.current.addItem(prod("2"));
    });
    act(() => result.current.removeItem("1"));
    expect(result.current.items).toHaveLength(1);
    act(() => result.current.clearCart());
    expect(result.current.items).toHaveLength(0);
  });

  it("persiste no localStorage e re-hidrata em nova montagem", () => {
    const first = renderHook(() => useCart(), { wrapper });
    act(() => first.result.current.addItem(prod("1"), 3));
    first.unmount();

    const second = renderHook(() => useCart(), { wrapper });
    expect(second.result.current.itemCount).toBe(3);
  });

  it("useCart fora do CartProvider lança erro", () => {
    expect(() => renderHook(() => useCart())).toThrow(/CartProvider/);
  });
});
