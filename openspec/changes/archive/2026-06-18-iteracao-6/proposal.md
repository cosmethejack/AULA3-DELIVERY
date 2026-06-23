# Frontend — Acompanhamento de Pedidos (Consumidor)

## Resumo

Implementar a página de **acompanhamento de pedidos** para o consumidor, com timeline visual dos estados, alertas de atraso e detalhes do pedido. Baseada nos 10 protótipos mobile do Stitch.

## Risco

**Pequeno** — página única, sem CRUD, consumo de API já existente.

## Artefatos

### Páginas

- `/pedidos` — Listagem de pedidos do cliente logado
- `/pedidos/[id]/acompanhamento` — Timeline vertical com estados

### Componentes

- `OrderTimeline` — timeline visual com ícones por estado
- `OrderStatusStep` — cada passo da timeline (confirmado, preparo, entrega, etc.)
- `DelayAlert` — banner de alerta com cupom (quando atrasado)
- `DeliveryInfo` — previsão de entrega, endereço
- `OrderSummary` — resumo do pedido (itens, valores)

### Regras de Negócio

- Timeline reflete a máquina de estados: Novo → Pago → Preparação → Faturado → Despachado → Entregue
- Estado "Atrasado" é derivado (tempo > previsão) e exibe banner de alerta
- Cliente vê apenas seus próprios pedidos

## Dependências

- `iteracao 3` (endpoints de pedidos)
- `iteracao 5` (estrutura de autenticação do frontend)

## Protótipos (Stitch)

Projeto: **DELIVERY** (ID: `projects/7259599975311263388`)

As telas deste módulo devem ser geradas no Stitch a partir da especificação em `docs/spec.md`. Interfaces necessárias:

| Screen a Gerar | Relação |
|----------------|---------|
| Acompanhamento de Pedido | Timeline vertical com estados |
| Status do Pedido - Atrasado | Banner de alerta + cupom |
| Meus Pedidos | Listagem de pedidos do cliente |

## Fora de Escopo

- Notificações push (futuro)
- Tracking em tempo real (futuro)

## Tarefas Principais

1. Criar `OrderTimeline` component com estados coloridos
2. Criar `DelayAlert` com cupom automático
3. Criar página de listagem de pedidos do cliente
4. Criar página de acompanhamento com timeline
5. Consumir `GET /v1/orders/:id` para dados do pedido
6. Testes com Vitest + Testing Library
