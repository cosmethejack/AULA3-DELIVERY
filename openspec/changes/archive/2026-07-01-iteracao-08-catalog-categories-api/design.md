## Context

As fundações (#02 core, #04 dados, #05 RBAC, #06 auditoria) estão prontas. O módulo `catalog`
atual é **público e somente-leitura** (`GET /v1/catalog`, `GET /v1/catalog/:id`) — a vitrine.
**Não existe** ainda a API administrativa de categorias.

Esta mudança é **greenfield**: constrói o CRUD administrativo de **categorias** em
`/v1/categories`, restrito a ADMIN, com `slug` único, flag `ativo`, paginação, erros RFC 9457
e auditoria automática (via o interceptor global de #06). É a base de organização da vitrine
(RF-03).

## Goals / Non-Goals

**Goals:**
- Novo módulo `categories` com `POST/GET/GET:id/PATCH/DELETE /v1/categories`.
- DTOs `class-validator`; geração/validação de `slug` a partir do nome.
- RBAC: mutações (criar/editar/remover) apenas ADMIN; endpoints de gestão sob `@Roles(ADMIN)`.
- `slug` único com tratamento de conflito → `409` (RFC 9457).
- Paginação obrigatória na listagem.
- Auditoria de CUD automática (interceptor global).

**Non-Goals:**
- UI de gestão de categorias (#11).
- Alterar o módulo público `catalog` (vitrine) — permanece read-only e separado.
- CRUD de produtos (#09).

## Decisions

**Módulo `categories` separado do `catalog` público.** O `catalog` serve a vitrine
(read-only, público); a gestão administrativa fica em um módulo próprio `categories` sob
`/v1/categories`, protegido por `@Roles(ADMIN)`. Separar leitura pública de escrita
administrativa mantém as superfícies de segurança distintas e evita acoplar vitrine a CRUD.

**Todos os endpoints `/v1/categories` exigem ADMIN.** A navegação pública do catálogo já é
atendida por `/v1/catalog`; portanto a API `/v1/categories` é puramente administrativa e todos
os seus endpoints (inclusive listar/obter) usam `@Roles(ADMIN)`. Simplifica o modelo de acesso
e evita expor gestão a não-admins.

**Geração de `slug` a partir do nome quando ausente.** O `CreateCategoryDto` aceita `slug`
opcional; quando não informado, o serviço deriva um slug do `nome` (minúsculas, sem acentos,
espaços → hífens). A unicidade é garantida pela constraint `Category.slug @unique`; conflito é
convertido em `409` (captura do erro Prisma `P2002`).

**Remoção como desativação (soft-delete).** `DELETE /v1/categories/:id` marca `ativo=false` em
vez de apagar, preservando integridade referencial com produtos que apontam para a categoria.
Categorias inativas não aparecem na vitrine pública. Alternativa (hard delete) foi descartada
por quebrar a FK de `Product.categoriaId`.

**Paginação com envelope `{ data, total, page, limit }`.** A listagem administrativa é paginada
por padrão (parâmetros `page`/`limit` com defaults), atendendo à regra de paginação obrigatória
em coleções.

## Risks / Trade-offs

- **[Conflito de `slug`]** → Constraint única + captura de `P2002` → `409` RFC 9457; coberto por
  teste unitário e de integração.
- **[Slug gerado colidir com existente]** → Tratado pela mesma via de `409`; o admin pode
  informar um `slug` explícito para resolver.
- **[Remoção física quebraria produtos vinculados]** → Soft-delete (`ativo=false`) preserva a FK.
- **[Exposição indevida de gestão]** → Todos os endpoints `/v1/categories` sob `@Roles(ADMIN)`;
  testes de matriz (anônimo 401, CUSTOMER 403, ADMIN 200/201).
