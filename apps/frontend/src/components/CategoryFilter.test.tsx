import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryFilter } from "./CategoryFilter";
import type { Category } from "@/types";

const categories: Category[] = [
  { id: "1", nome: "Bebidas", ativo: true },
  { id: "2", nome: "Lanches", ativo: true },
];

describe("CategoryFilter", () => {
  it("renderiza 'Todos' e uma pílula por categoria", () => {
    render(<CategoryFilter categories={categories} selected={null} onSelect={() => {}} />);
    expect(screen.getByText("Todos")).toBeInTheDocument();
    expect(screen.getByText("Bebidas")).toBeInTheDocument();
    expect(screen.getByText("Lanches")).toBeInTheDocument();
  });

  it("chama onSelect(null) ao clicar em Todos", () => {
    const onSelect = vi.fn();
    render(<CategoryFilter categories={categories} selected="1" onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Todos"));
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it("chama onSelect(id) ao clicar em uma categoria", () => {
    const onSelect = vi.fn();
    render(<CategoryFilter categories={categories} selected={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Lanches"));
    expect(onSelect).toHaveBeenCalledWith("2");
  });
});
