## ADDED Requirements

### Requirement: Dashboard de Métricas de Vendas
O sistema DEVE expor `GET /v1/dashboard/summary` com métricas: vendas do dia/semana/mês (soma de `order.total` onde `paymentStatus = PAID`), contagem de pedidos por status, top 5 produtos mais vendidos.

#### Scenario: Dashboard com dados
- **WHEN** admin acessa GET /v1/dashboard/summary
- **THEN** sistema retorna vendas do período, pedidos por status e top 5 produtos

#### Scenario: Dashboard sem pedidos no período
- **WHEN** admin acessa dashboard com período sem pedidos
- **THEN** retorna métricas zeradas (0 vendas, 0 recebido, 0 pendente, 0 produtos)

#### Scenario: Filtrar por período
- **WHEN** admin acessa GET /v1/dashboard/summary?period=semana
- **THEN** sistema retorna métricas filtradas para a semana atual
