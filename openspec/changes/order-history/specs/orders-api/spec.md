## ADDED Requirements

### Requirement: Histórico de Pedidos do Cliente
O sistema DEVE (MUST) permitir que o cliente autenticado liste seus próprios pedidos, de forma
paginada. ADMIN lista todos os pedidos. A listagem do cliente é escopada pela identidade
(Customer do token).

#### Scenario: Cliente lista seus pedidos
- **WHEN** um cliente autenticado acessa GET /v1/orders
- **THEN** apenas os pedidos do próprio cliente são retornados, de forma paginada

#### Scenario: Cliente sem pedidos
- **WHEN** um cliente autenticado sem pedidos acessa GET /v1/orders
- **THEN** o sistema retorna uma coleção vazia paginada (200)

#### Scenario: Admin lista todos os pedidos
- **WHEN** um ADMIN acessa GET /v1/orders
- **THEN** os pedidos de todos os clientes são retornados, de forma paginada
