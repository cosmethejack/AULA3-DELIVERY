## ADDED Requirements

### Requirement: CRUD de Clientes
O sistema DEVE expor endpoints REST para gerenciar clientes. Clientes com pedidos associados não podem ser excluídos (apenas desativados).

#### Scenario: Criar cliente
- **WHEN** usuário envia POST /v1/customers com dados válidos
- **THEN** cliente é criado com ativo=true e retornado com 201

#### Scenario: Desativar cliente com pedidos
- **WHEN** admin tenta deletar cliente que possui pedidos
- **THEN** sistema retorna 409 e cliente é marcado como inativo

### Requirement: Paginação em Coleções
Toda listagem DEVE suportar paginação via query params `?page=1&limit=20`.

#### Scenario: Paginação com página inválida
- **WHEN** cliente acessa listagem com page=0
- **THEN** sistema retorna 422 Unprocessable Entity
