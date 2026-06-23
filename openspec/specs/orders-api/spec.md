## Purpose

Módulo de pedidos do backend: máquina de estados, validação de estoque na criação e cancelamento.

## Requirements

### Requirement: Máquina de Estados do Pedido
O sistema DEVE implementar a máquina de estados: Novo → Pago → Preparação → Faturado → Despachado → Entregue. Cancelamento permitido de qualquer estado exceto Entregue.

#### Scenario: Avançar status válido
- **WHEN** admin envia PATCH /v1/orders/:id/status com próximo estado válido
- **THEN** status do pedido é atualizado e evento é auditado

#### Scenario: Cancelar pedido entregue
- **WHEN** admin tenta cancelar pedido no estado Entregue
- **THEN** sistema retorna 422 Unprocessable Entity

### Requirement: Validação de Estoque
O sistema DEVE validar o estoque disponível no momento da confirmação do pedido.

#### Scenario: Estoque insuficiente
- **WHEN** cliente tenta criar pedido com quantidade > estoque disponível
- **THEN** sistema retorna 409 Conflict com detalhes dos itens sem estoque
