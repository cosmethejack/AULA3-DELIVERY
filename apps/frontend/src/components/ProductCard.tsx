"use client";

import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className={styles.card}>
      <img src={product.imagem} alt={product.nome} className={styles.image} />
      <div className={styles.body}>
        <h3 className={styles.name}>{product.nome}</h3>
        <p className={styles.price}>
          {product.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
        <button
          className={styles.button}
          onClick={(e) => {
            e.stopPropagation();
            addItem(product);
          }}
          disabled={product.estoque <= 0}
        >
          {product.estoque > 0 ? "Adicionar" : "Indisponível"}
        </button>
      </div>
    </article>
  );
}
