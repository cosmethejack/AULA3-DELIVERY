## 1. Módulo e DTOs

- [x] 1.1 Criar `CategoriesModule` (`apps/backend/src/modules/categories`) e registrar no `AppModule`
- [x] 1.2 Criar `CreateCategoryDto` (`nome` obrigatório, `slug` opcional) com `class-validator` + decorators Swagger
- [x] 1.3 Criar `UpdateCategoryDto` (parcial)

## 2. Service

- [x] 2.1 Implementar `CategoriesService` (Prisma) com create/findAll/findOne/update/remove
- [x] 2.2 Gerar `slug` a partir do nome quando ausente (minúsculas, sem acentos, hífens)
- [x] 2.3 Tratar conflito de `slug` (Prisma `P2002`) convertendo em `409` (RFC 9457)
- [x] 2.4 `remove` como soft-delete (`ativo=false`)
- [x] 2.5 Paginação em `findAll` (envelope `{ data, total, page, limit }`)

## 3. Controller e RBAC

- [x] 3.1 Implementar `CategoriesController` (`POST/GET/GET:id/PATCH/DELETE /v1/categories`)
- [x] 3.2 Proteger todos os endpoints com `@Roles(ADMIN)`
- [x] 3.3 Documentar via decorators Swagger

## 4. Testes

- [x] 4.1 Unit `CategoriesService`: cria e gera slug; rejeita slug duplicado (409); update; soft-delete; paginação (happy/sad/edge)
- [x] 4.2 Unit/integração `CategoriesController`: matriz RBAC (anônimo 401, CUSTOMER 403, ADMIN 200/201)
- [x] 4.3 Integração (Supertest): CRUD completo; slug duplicado → 409; paginação funciona
- [x] 4.4 Rodar `npm run lint` + testes do backend e confirmar cobertura ≥ 80%
