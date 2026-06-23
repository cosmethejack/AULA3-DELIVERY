"use client";

import type { Category } from "@/types";
import styles from "./CategoryFilter.module.css";

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className={styles.filter}>
      <button
        className={`${styles.pill} ${selected === null ? styles.active : ""}`}
        onClick={() => onSelect(null)}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`${styles.pill} ${selected === cat.id ? styles.active : ""}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.nome}
        </button>
      ))}
    </div>
  );
}
