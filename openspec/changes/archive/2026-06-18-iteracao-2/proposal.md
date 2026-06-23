# Backend — Módulos de Catálogo, Clientes e Dashboard

## Resumo

Implementar os módulos NestJS de **Catálogo** (categorias + produtos), **Clientes** (CRUD básico) e **Dashboard** (métricas de vendas), com endpoints REST, DTOs com validação, paginação e testes.

## Risco

**Médio** — envolve CRUDs, regras de negócio e cobertura de testes.

## Artefatos

### Catálogo (RF-01, RF-03, RF-04)

- `GET /v1/categories` — listar categorias ativas (público)
- `POST /v1/categories` — criar categoria (admin)
- `PATCH /v1/categories/:id` — editar categoria (admin)
- `DELETE /v1/categories/:id` — remover categoria (admin)
- `GET /v1/products` — listar produtos ativos (público)
- `GET /v1/products/:id` — detalhe do produto (público)
- `POST /v1/products` — criar produto (admin)
- `PATCH /v1/products/:id` — editar produto (admin)
- `DELETE /v1/products/:id` — remover produto (admin)

### Clientes (RF-05)

- `POST /v1/customers` — criar cliente (público)
- `GET /v1/customers` — listar (admin)
- `GET /v1/customers/:id` — detalhe (admin)
- `PATCH /v1/customers/:id` — editar (admin)
- `DELETE /v1/customers/:id` — desativar (admin)

### Regras de Negócio

- Produtos inativos não aparecem na vitrine
- Categoria com slug duplicado retorna 409 Conflict
- Produtos sem estoque aparecem mas não podem ser vendidos
- Clientes com pedidos associados não podem ser excluídos
- Dashboard reflete apenas pedidos registrados

## Dependências

- `iteracao 1` (Prisma schema + migrations)

## Protótipos (Stitch)

Projeto: **DELIVERY** (ID: `projects/7259599975311263388`)

As telas correspondentes devem ser geradas no Stitch a partir da especificação em `docs/spec.md`. Interfaces necessárias:

| Screen a Gerar | Relação |
|----------------|---------|
| Listagem de Categorias | CRUD categorias |
| Listagem de Produtos | CRUD produtos |
| Edição de Produto | Formulário edição |
| Dashboard Admin | Cards de métricas + gráfico |

## Fora de Escopo

- Autenticação/autorização (será adicionada em mudança posterior)
- Upload de imagens (MVP usa URLs)

## Tarefas Principais

1. Criar `CatalogModule` com CategoriesController + CategoriesService
2. Criar ProductsController + ProductsService
3. Criar `CustomersModule` com CRUD + validação
4. Implementar DTOs com `class-validator`
5. Adicionar paginação (`?page=1&limit=20`)
6. Tratar slug duplicado (409)
7. Testes unitários (services) e integração (controllers)
