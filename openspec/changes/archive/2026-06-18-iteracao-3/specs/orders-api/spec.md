## ADDED Requirements

### Requirement: Cancelamento de Pedido
O sistema DEVE permitir cancelamento de pedido em qualquer estado exceto Entregue, via `PATCH /v1/orders/:id/status` com status `CANCELED`.

#### Scenario: Cancelar pedido com sucesso
- **WHEN** admin envia PATCH /v1/orders/:id/status com status CANCELED e pedido não está Entregue
- **THEN** sistema atualiza status para CANCELED e registra auditoria

#### Scenario: Cancelar pedido já entregue
- **WHEN** admin tenta cancelar pedido no estado Entregue
- **THEN** sistema retorna 422 Unprocessable Entity

### Requirement: Registro de Pagamento
O sistema DEVE expor `POST /v1/orders/:id/payments` para admin registrar pagamento manual, avançando o pedido para Pago.

#### Scenario: Pagamento registrado com sucesso
- **WHEN** admin envia POST /v1/orders/:id/payments com valor e método de pagamento válidos
- **THEN** sistema registra pagamento e avança pedido para Pago

#### Scenario: Pagamento em pedido já pago
- **WHEN** admin tenta registrar pagamento em pedido com status diferente de Novo
- **THEN** sistema retorna 409 Conflict

### Requirement: Listagem de Pedidos
O sistema DEVE expor `GET /v1/orders` com suporte a paginação e filtro por status.

#### Scenario: Listar pedidos paginados
- **WHEN** admin acessa GET /v1/orders?page=1&limit=20
- **THEN** sistema retorna lista paginada de pedidos

#### Scenario: Filtrar por status
- **WHEN** admin acessa GET /v1/orders?status=Novo
- **THEN** sistema retorna apenas pedidos com status Novo

### Requirement: Detalhe do Pedido
O sistema DEVE expor `GET /v1/orders/:id` com detalhes completos do pedido, itens e pagamentos.

#### Scenario: Obter detalhe com sucesso
- **WHEN** usuário acessa GET /v1/orders/:id com id válido
- **THEN** sistema retorna pedido com itens e pagamentos
