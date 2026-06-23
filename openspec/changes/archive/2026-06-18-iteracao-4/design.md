## Context

Vitrine pública do DELIVERY — catálogo de produtos, carrinho de compras, fluxo de checkout e confirmação de pedido. Toda integração com APIs via camada `services/`.

## Goals / Non-Goals

**Goals:**
- Grade de produtos com filtro por categoria (`/`)
- Detalhe do produto (`/produtos/[id]`)
- Carrinho com persistência em localStorage (`CartContext`)
- Checkout com formulário do cliente
- Confirmação de pedido pós-checkout
- Cobertura ≥ 70%

**Non-Goals:**
- Autenticação (vitrine pública)
- Páginas administrativas
- Componentes oficiais do Clerk

## Decisions

| Decisão | Alternativa | Rationale |
|---------|-------------|-----------|
| `CartContext` + localStorage vs Zustand/Redux | Zustand | Mínimo de dependências; contexto React + localStorage é suficiente |
| `services/` como camada única de API vs chamadas diretas | Chamadas diretas | Arquitetura BFF exige camada services |
| Vanilla CSS vs Tailwind | Tailwind | Stack definida; Vanilla CSS conforme architecture.md |
| Server Components para listagem vs Client Components | Server Components | Vitrine pública sem estado; carrinho e filtros como Client Components |

## Risks / Trade-offs

- [Carrinho] localStorage não persiste entre dispositivos → esperado para MVP
- [Checkout] Sem autenticação, cliente informa dados manualmente → iteracao-3 adiciona auth
- [Imagens] URLs externas podem quebrar → tratar com fallback via CSS
