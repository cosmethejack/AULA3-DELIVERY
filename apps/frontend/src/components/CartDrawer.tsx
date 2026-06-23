"use client";

import { useCart } from "@/context/CartContext";
import styles from "./CartDrawer.module.css";

export function CartDrawer({ onCheckout }: { onCheckout: () => void }) {
  const { items, total, itemCount, removeItem, updateQuantidade } = useCart();

  return (
    <div className={styles.drawer}>
      <div className={styles.header}>
        <h2>Carrinho ({itemCount})</h2>
      </div>
      <div className={styles.items}>
        {items.length === 0 && <p className={styles.empty}>Carrinho vazio</p>}
        {items.map((item) => (
          <div key={item.product.id} className={styles.item}>
            <div className={styles.info}>
              <strong>{item.product.nome}</strong>
              <span className={styles.itemPrice}>
                {item.product.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
            <div className={styles.controls}>
              <button onClick={() => updateQuantidade(item.product.id, item.quantidade - 1)}>-</button>
              <span>{item.quantidade}</span>
              <button onClick={() => updateQuantidade(item.product.id, item.quantidade + 1)}>+</button>
              <button className={styles.remove} onClick={() => removeItem(item.product.id)}>×</button>
            </div>
          </div>
        ))}
      </div>
      {items.length > 0 && (
        <div className={styles.footer}>
          <div className={styles.total}>
            <span>Total</span>
            <strong>{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
          </div>
          <button className={styles.checkout} onClick={onCheckout}>
            Finalizar Pedido
          </button>
        </div>
      )}
    </div>
  );
}
