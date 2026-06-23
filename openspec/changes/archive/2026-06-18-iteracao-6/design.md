## Context

Página de acompanhamento de pedidos para o consumidor, com timeline vertical dos estados, alertas de atraso e detalhes do pedido.

## Goals / Non-Goals

**Goals:**
- Listagem de pedidos do cliente logado (`/pedidos`)
- Timeline vertical com 6 estados: Novo → Pago → Preparação → Faturado → Despachado → Entregue
- `DelayAlert` com cupom automático quando atrasado
- `OrderSummary` com itens e valores
- Consumo de `GET /v1/orders` e `GET /v1/orders/:id`

**Non-Goals:**
- Notificações push
- Tracking em tempo real

## Decisions

| Decisão | Alternativa | Rationale |
|---------|-------------|-----------|
| Timeline em Client Component vs Server | Client Component | Estado visual (ativo/concluído/pendente) é dinâmico |
| `OrderTimeline` como componente puro vs lib | Componente puro | Evita dependência externa; timeline é visual simples |
| DelayAlert derivado vs campo no banco | Derivado | Cálculo baseado em tempo desde criação vs previsão |

## Risks / Trade-offs

- [Atraso] Previsão de entrega fixa sem configuração → definir constante no frontend
- [Cupom] DelayAlert com cupom fictício sem backend → placeholder até infra-ci-cd
