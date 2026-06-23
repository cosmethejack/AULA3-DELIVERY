## Purpose

Módulo de métricas e gestão de pagamentos do dashboard administrativo.

## Requirements

### Requirement: Dashboard de Métricas
O sistema DEVE expor endpoint `GET /v1/dashboard/summary` com vendas do período, valores recebidos/pendentes e top 5 produtos.

#### Scenario: Dashboard sem pedidos no período
- **WHEN** admin acessa dashboard com período sem pedidos
- **THEN** retorna métricas zeradas (0 vendas, 0 recebido, 0 pendente)

### Requirement: Registro Manual de Pagamento
Admin DEVE poder registrar pagamento associado a um pedido via `POST /v1/orders/:id/payments`.

#### Scenario: Pagamento registrado com sucesso
- **WHEN** admin envia POST /v1/orders/:id/payments com valor e método
- **THEN** pagamento é registrado e pedido avança para Pago
