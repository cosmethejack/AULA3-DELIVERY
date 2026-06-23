## Purpose

Módulo de catálogo do backend: CRUD de categorias e produtos com validação de slug único, paginação e filtragem de itens inativos.

## Requirements

### Requirement: CRUD de Categorias
O sistema DEVE expor endpoints REST para criar, listar, editar e remover categorias. Categorias inativas não são retornadas na listagem pública.

#### Scenario: Criar categoria com slug válido
- **WHEN** admin envia POST /v1/categories com nome e slug
- **THEN** categoria é criada e retornada com 201

#### Scenario: Slug duplicado retorna 409
- **WHEN** admin tenta criar categoria com slug já existente
- **THEN** sistema retorna 409 Conflict com RFC 9457

### Requirement: CRUD de Produtos
O sistema DEVE expor endpoints REST para criar, listar, editar e remover produtos. Produtos inativos não aparecem na vitrine.

#### Scenario: Listar produtos ativos (público)
- **WHEN** cliente acessa GET /v1/products
- **THEN** retorna apenas produtos com ativo=true, paginados

#### Scenario: Produto sem estoque
- **WHEN** produto tem estoque = 0
- **THEN** ele aparece na listagem mas não pode ser vendido
