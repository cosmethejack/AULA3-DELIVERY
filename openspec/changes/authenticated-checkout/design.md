## Context

Após `customer-authentication`, o cliente possui identidade (`clerkUserId`). Esta mudança
re-protege a criação/consulta de pedidos, deriva o cliente do **token** e corrige o bug
latente `req.user.sub` (id do Clerk) × `Order.clienteId` (id do Customer). Também reverte os
patches temporários de checkout guest aplicados enquanto não havia autenticação de cliente
(POST /customers público, POST/GET orders públicos, upsert de cliente por e-mail).

## Goals / Non-Goals

**Goals:**
- `POST /orders` protegido (CUSTOMER/ADMIN); `clienteId` derivado do token
- `GET /orders/:id` protegido + ownership (IDOR)
- Resolver `req.user.sub` → `Customer.id` em `orders.service`
- Reverter patches guest
- Checkout exige login no frontend

**Non-Goals:**
- Histórico "Meus Pedidos" (tratado em `order-history`)
- Alteração da máquina de estados do pedido

## Decisions

| Decisão | Alternativa | Rationale |
|---------|-------------|-----------|
| `clienteId` do token | `clienteId` do body | Body é spoofable; identidade é a fonte segura |
| Pedido de outro → 404 | 403 Forbidden | Não revelar a existência do recurso (anti-enumeração) |
| `POST /customers` admin | Manter público | Criação de cliente passa a ocorrer no `register` |
| Remover upsert de cliente | Manter | Cliente já existe via `register`; upsert era paliativo guest |

## Risks / Trade-offs

- [Pedidos legados guest] sem `clerkUserId` no cliente → inacessíveis ao cliente; ADMIN acessa.
- [Quebra de fluxo atual] checkout passa a exigir login → mitigar com redirect e UX clara.
- [IDOR] esquecer ownership em algum ponto → testes dedicados de propriedade.
