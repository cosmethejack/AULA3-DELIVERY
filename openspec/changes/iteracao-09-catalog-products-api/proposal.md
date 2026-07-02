# API de Produtos (#09) — RF-04

## Resumo

Expor o CRUD de **produtos** no backend (nome, descrição, preço, estoque, imagem, categoria,
ativo), restrito a ADMIN, com endpoint **público** de listagem de produtos ativos para a
vitrine. Controla a visibilidade do produto no catálogo.

## Dimensionamento

- **Tamanho:** Médio — entidade com mais atributos e relação com categoria.
- **Complexidade:** Média — filtros, visibilidade e validação de estoque/preço.
- **Risco:** Baixo — auditado e coberto por RBAC.

## Escopo Funcional

### Backend
- `POST/GET/GET:id/PATCH/DELETE /v1/products` (ADMIN) com DTOs `class-validator`.
- `GET /v1/products` **público** retornando **apenas ativos** (regra de vitrine) com filtro por categoria, busca textual, ordenação e paginação.
- Validações: preço ≥ 0; estoque ≥ 0; categoria existente; `ativo` controla visibilidade.
- Auditoria de CUD (#06); erros RFC 9457.

## Dependências

- #08 catalog-categories-api.

## Riscos

- Produto inativo vazar para a vitrine. Mitigação: filtro de visibilidade + teste explícito.

## Qualidade & Testes

### Linter
- `npm run lint` (backend) verde.

### Testes Unitários
- `ProductsService`: validações de preço/estoque; listagem pública exclui inativos; filtros aplicados.

### Testes de Integração
- Supertest: CRUD ADMIN (RBAC 401/403/200); `GET /v1/products` público lista só ativos; busca/paginação/ordenação.

### Testes E2E
- Não se aplica (vitrine em #10, admin em #11).

## Definição de Pronto

- CRUD admin + listagem pública de ativos funcionando; RBAC e auditoria aplicados.
- Lint + unit + integração verdes; cobertura backend ≥ 80%.

## Fora de Escopo

- Upload/armazenamento de imagem em object storage (futuro) — aqui apenas URL/referência.
