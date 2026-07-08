## ADDED Requirements

### Requirement: RBAC da API de categorias
Todos os endpoints de `/v1/categories` DEVEM (MUST) exigir papel ADMIN. Requisições sem
token DEVEM (MUST) receber `401` e requisições de papel CUSTOMER DEVEM (MUST) receber `403`,
ambas no formato RFC 9457.

#### Scenario: Anônimo é bloqueado
- **WHEN** uma requisição sem token acessa qualquer endpoint de `/v1/categories`
- **THEN** o backend responde `401` no formato RFC 9457

#### Scenario: CUSTOMER é bloqueado
- **WHEN** um usuário CUSTOMER acessa um endpoint de `/v1/categories`
- **THEN** o backend responde `403` no formato RFC 9457

#### Scenario: ADMIN cria categoria
- **WHEN** um ADMIN envia `POST /v1/categories` com dados válidos
- **THEN** a categoria é criada e retornada com `201`

### Requirement: Geração e unicidade de slug
Ao criar uma categoria, o sistema DEVE (MUST) gerar o `slug` a partir do nome quando não
informado (minúsculas, sem acentos, espaços convertidos em hífens) e DEVE (MUST) garantir a
unicidade do `slug`, respondendo `409` (RFC 9457) em caso de conflito.

#### Scenario: Slug derivado do nome
- **WHEN** um ADMIN cria uma categoria informando apenas o nome "Bebidas Geladas"
- **THEN** a categoria é criada com `slug` = "bebidas-geladas"

#### Scenario: Slug duplicado retorna 409
- **WHEN** um ADMIN cria uma categoria com `slug` já existente
- **THEN** o backend responde `409` no formato RFC 9457

### Requirement: Listagem paginada de categorias
A listagem `GET /v1/categories` DEVE (MUST) ser paginada, aceitando parâmetros `page` e
`limit`, e retornar um envelope com os itens e o total.

#### Scenario: Listagem paginada
- **WHEN** um ADMIN acessa `GET /v1/categories?page=1&limit=10`
- **THEN** o backend retorna os itens da página e o total de categorias

### Requirement: Remoção como desativação
`DELETE /v1/categories/:id` DEVE (MUST) desativar a categoria (`ativo=false`) em vez de
apagá-la, preservando a integridade referencial com produtos. Categorias inativas NÃO DEVEM
(MUST NOT) aparecer na vitrine pública.

#### Scenario: Categoria desativada
- **WHEN** um ADMIN executa `DELETE /v1/categories/:id`
- **THEN** a categoria passa a `ativo=false` e deixa de aparecer na vitrine pública

### Requirement: Auditoria das mutações de categoria
Operações de criação, atualização e remoção de categorias DEVEM (MUST) gerar registro de
auditoria (via o interceptor global de auditoria).

#### Scenario: Mutação de categoria gera trilha
- **WHEN** um ADMIN cria, atualiza ou remove uma categoria
- **THEN** um registro de auditoria é gravado com usuário, ação e objeto
