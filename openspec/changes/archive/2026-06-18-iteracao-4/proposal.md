# Frontend — Vitrine Pública

## Resumo

Implementar a vitrine digital pública com catálogo de produtos, carrinho de compras, fluxo de checkout e confirmação de pedido.

## Risco

**Médio** — interação com múltiplas APIs, estado global do carrinho, fluxo de checkout.

## Artefatos

### Páginas

- `/` — Grade de produtos com filtro por categoria
- `/produtos/[id]` — Detalhe do produto + "Adicionar ao carrinho"
- `/checkout` — Carrinho + formulário do cliente
- `/pedido/[id]` — Confirmação pós-checkout

### Componentes

- `ProductCard` — imagem, nome, preço, botão
- `CategoryFilter` — pills/tabs de categoria
- `CartDrawer` — gaveta lateral com itens
- `CartContext` — estado global (localStorage)
- `CheckoutForm` — formulário com validação

### Serviços

- `catalog.service.ts` — `getCategories()`, `getProducts()`, `getProduct(id)`
- `orders.service.ts` — `createOrder(dto)`
- `customers.service.ts` — `createCustomer(dto)`

## Dependências

- `iteracao 2` (endpoints de catálogo e clientes)
- `iteracao 3` (endpoints de pedidos e autenticação)

## Protótipos (Stitch)

Projeto: **DELIVERY** (ID: `projects/7259599975311263388`)

As telas devem ser geradas no Stitch a partir da especificação em `docs/spec.md`. Interfaces necessárias:

| Screen a Gerar | Relação |
|----------------|---------|
| Vitrine Principal | Grade de produtos + filtro categoria |
| Carrinho de Compras | Itens + quantidades + total |
| Checkout | Formulário cliente + confirmação |
| Confirmação de Pedido | Resumo pós-checkout |

## Fora de Escopo

- Autenticação (vitrine pública)
- Páginas administrativas (dashboard)
- Componentes oficiais do Clerk (proibido)

## Tarefas Principais

1. Criar serviços de API (catalog, orders, customers)
2. Implementar `ProductCard` e `CategoryFilter`
3. Implementar `CartContext` com persistência localStorage
4. Implementar `CartDrawer` (gaveta lateral)
5. Criar página inicial com grade de produtos
6. Criar página de detalhe do produto
7. Criar página de checkout com formulário
8. Criar página de confirmação de pedido
9. Testes com Vitest + Testing Library (cobertura ≥ 70%)
