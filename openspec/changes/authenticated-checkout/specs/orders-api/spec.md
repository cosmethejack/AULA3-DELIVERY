## MODIFIED Requirements

### Requirement: Criação de Pedido Autenticada
A criação de pedido DEVE (MUST) exigir cliente autenticado. O `clienteId` é derivado do token
(identidade), nunca do corpo da requisição. Apenas CUSTOMER e ADMIN podem criar.

#### Scenario: Cliente autenticado cria pedido
- **WHEN** um cliente autenticado envia POST /v1/orders com itens válidos
- **THEN** o pedido é criado associado ao Customer do token

#### Scenario: Requisição sem autenticação
- **WHEN** POST /v1/orders é chamado sem token válido
- **THEN** o sistema retorna 401 Unauthorized

#### Scenario: Estoque insuficiente
- **WHEN** o cliente tenta criar pedido com quantidade maior que o estoque
- **THEN** o sistema retorna 409 Conflict com os itens sem estoque

### Requirement: Propriedade na Consulta de Pedido
A consulta GET /v1/orders/:id DEVE (MUST) validar propriedade. CUSTOMER acessa apenas os próprios
pedidos; ADMIN acessa todos.

#### Scenario: Cliente consulta pedido de outro cliente
- **WHEN** um cliente autenticado consulta um pedido que não é seu
- **THEN** o sistema retorna 404 Not Found

#### Scenario: Admin consulta qualquer pedido
- **WHEN** um ADMIN consulta GET /v1/orders/:id
- **THEN** o pedido é retornado
