## ADDED Requirements

### Requirement: Registro de Auditoria em Operações CUD
O sistema DEVE registrar automaticamente operações de Create, Update e Delete em entidades críticas (Order, Payment, Product, Category) com: usuário, objeto, ação, payload anterior, payload novo e timestamp.

#### Scenario: Auditoria ao criar pedido
- **WHEN** sistema cria um novo pedido
- **THEN** registro de auditoria é criado com ação CREATE, objeto Order, payload do pedido

#### Scenario: Auditoria ao atualizar status
- **WHEN** admin atualiza status de um pedido
- **THEN** registro de auditoria é criado com ação UPDATE, objeto Order, payload anterior e novo

#### Scenario: Auditoria ao deletar produto
- **WHEN** admin deleta um produto
- **THEN** registro de auditoria é criado com ação DELETE, objeto Product, payload do produto deletado

### Requirement: Consulta de Auditoria
O sistema DEVE expor `GET /v1/audit-logs` para admin consultar registros de auditoria com filtro por entidade, ação e período.

#### Scenario: Consultar logs por entidade
- **WHEN** admin acessa GET /v1/audit-logs?entity=Order
- **THEN** sistema retorna logs de auditoria filtrados por entidade Order

#### Scenario: Consultar logs por período
- **WHEN** admin acessa GET /v1/audit-logs?start=2026-01-01&end=2026-06-18
- **THEN** sistema retorna logs de auditoria dentro do período especificado
