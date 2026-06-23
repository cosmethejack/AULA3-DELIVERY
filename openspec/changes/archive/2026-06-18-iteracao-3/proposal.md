## Why

O backend precisa dos módulos de **Pedidos** (com máquina de estados), **Autenticação** (validação JWT contra Clerk), **Dashboard** (métricas de vendas) e **Auditoria** (rastreio de operações CUD). Sem esses módulos o sistema não tem fluxo de pedidos, controle de acesso nem rastreabilidade — requisitos centrais do MVP (RF-02, RF-05, RF-06, RF-07).

## What Changes

- Criar `OrdersModule` com máquina de estados de 6 status + cancelamento
- Implementar validação de estoque na criação do pedido
- Criar `PaymentsModule` com registro manual de pagamento
- Criar `DashboardModule` com endpoint de métricas agregadas
- Implementar `ClerkGuard` com validação de JWT contra JWKS do Clerk
- Implementar decorator `@Roles(ADMIN, CUSTOMER)` para RBAC
- Criar schema e serviço de `AuditLog` para auditoria CUD
- Cobrir com testes unitários e de integração (cobertura ≥ 80%)

## Capabilities

### New Capabilities
- `audit`: Auditoria de operações Create/Update/Delete com registro de usuário, objeto, ação, payload e timestamp

### Modified Capabilities
- `orders-api`: Adicionar endpoints de pagamento, cancelamento e validação de estoque; máquina de estados
- `auth`: Adicionar decorator `@Roles()` e integração com Clerk (validação JWKS)
- `dashboard`: Adicionar endpoint `GET /v1/dashboard/summary` com métricas de vendas

## Impact

- `apps/backend/src/modules/orders/` — novo módulo
- `apps/backend/src/modules/dashboard/` — novo módulo
- `apps/backend/src/core/auth/` — ClerkGuard + Roles decorator
- `apps/backend/src/core/audit/` — AuditService + AuditLog schema
- `apps/backend/prisma/schema.prisma` — nova tabela `AuditLog`
- `apps/backend/src/app.module.ts` — registro dos novos módulos
