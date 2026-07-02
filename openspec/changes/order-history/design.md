## Context

Com cliente autenticado (`customer-authentication`) e pedidos com dono
(`authenticated-checkout`), o requisito RF-02 "visualizar o histórico de pedidos" torna-se
viável. `GET /orders` passa a ser **escopado** ao Customer do token (para não-admin), com
paginação, e o frontend ganha a tela "Meus Pedidos".

## Goals / Non-Goals

**Goals:**
- `GET /orders` escopado ao Customer do token (CUSTOMER); ADMIN vê todos
- Paginação obrigatória (`?page=1&limit=20`)
- Tela "Meus Pedidos"

**Non-Goals:**
- Filtros avançados e exportação (PDF/Excel — versões futuras)
- Alteração no acompanhamento de pedido existente

## Decisions

| Decisão | Alternativa | Rationale |
|---------|-------------|-----------|
| Reusar `GET /orders` com escopo por role | Endpoint novo `/orders/me` | Consistente com o `findAll` existente; menos superfície |
| Paginação default 1/20 | Sem paginação | Regra de arquitetura: paginação obrigatória em coleções |
| Índice em `Order.clienteId` | Sem índice | Evita degradação na listagem por cliente |

## Risks / Trade-offs

- [Performance] Listagem por cliente sem índice → adicionar índice Prisma em `clienteId`.
- [Pedidos guest legados] Sem `clerkUserId` no cliente → não aparecem no histórico do cliente.
