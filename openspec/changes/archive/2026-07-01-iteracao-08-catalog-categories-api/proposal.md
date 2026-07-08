# API de Categorias (#08) — RF-03

## Resumo

Expor o CRUD de **categorias** no backend, restrito a ADMIN, com `slug` único e flag `ativo`.
Base de organização da vitrine.

## Dimensionamento

- **Tamanho:** Pequeno — CRUD de entidade simples.
- **Complexidade:** Baixa — regras mínimas.
- **Risco:** Baixo — entidade isolada, auditada.

## Escopo Funcional

### Backend
- `POST/GET/GET:id/PATCH/DELETE /v1/categories` com DTOs `class-validator`.
- RBAC: criar/editar/remover apenas ADMIN; listar pode ser usado internamente.
- `slug` único; geração/validação de slug a partir do nome.
- Paginação obrigatória na listagem; auditoria de CUD (via #06).
- Erros em RFC 9457.

## Dependências

- #04 database-schema-foundation, #05 identity-rbac-foundation, #06 audit-foundation.

## Riscos

- Conflito de `slug`. Mitigação: constraint única + tratamento 409 e teste.

## Qualidade & Testes

### Linter
- `npm run lint` (backend) verde.

### Testes Unitários
- `CategoriesService`: criação gera slug; rejeita slug duplicado; update/soft rules (happy/sad/edge).

### Testes de Integração
- Supertest: CRUD completo; ADMIN cria (201), CUSTOMER recebe 403, anônimo 401; slug duplicado → 409; paginação funciona.

### Testes E2E
- Não se aplica (UI entra em #11).

## Definição de Pronto

- CRUD funcional, RBAC aplicado, auditoria gerada.
- Lint + unit + integração verdes; cobertura backend ≥ 80%.

## Fora de Escopo

- UI de gestão (#11).
