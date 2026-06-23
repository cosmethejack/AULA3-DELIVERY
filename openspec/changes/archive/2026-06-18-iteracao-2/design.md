## Context

Módulos de backend para catálogo (categorias + produtos), clientes e dashboard. O backend NestJS já tem estrutura inicial do monorepo — esta mudança adiciona os controllers, services, DTOs e testes.

## Goals / Non-Goals

**Goals:**
- `CatalogModule` com CRUD de categorias e produtos + validação de slug único
- `CustomersModule` com CRUD de clientes
- Paginação (`?page=1&limit=20`) em todas as listagens
- DTOs com `class-validator`
- Erros seguem RFC 9457
- Cobertura ≥ 80%

**Non-Goals:**
- Autenticação/autorização (adiante em iteracao-3)
- Upload de imagens (MVP usa URLs)
- Dashboard (movido para iteracao-3)

## Decisions

| Decisão | Alternativa | Rationale |
|---------|-------------|-----------|
| Controllers REST vs GraphQL | GraphQL | Stack definida; REST + JSON suficiente para MVP |
| `class-validator` vs Zod | Zod | Stack definida; NestJS prefere class-validator nativamente |
| Slug gerado automático vs manual | Manual com validação | Admin informa slug; backend valida unicidade e formata |
| Soft delete vs exclusão física | Soft delete | Clientes com pedidos associados não podem ser excluídos |

## Risks / Trade-offs

- [Slug] Usuário pode informar slug inválido → validação com regex + 422
- [Paginação] Sem índice adequado pode degradar → índices no schema Prisma
- [Clientes] Sem auth ainda, endpoints de cliente são públicos → protegidos em iteracao-3
