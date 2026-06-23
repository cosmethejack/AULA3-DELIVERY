## Context

Módulo de pedidos com máquina de estados (Novo → Pago → Preparação → Faturado → Despachado → Entregue + Cancelado), registro manual de pagamentos, guard de autenticação Clerk com RBAC, dashboard de métricas agregadas e auditoria em operações CUD. Backend NestJS 11+, Prisma 7+, PostgreSQL 15+.

## Goals / Non-Goals

**Goals:**
- `OrdersModule` com estado persistido no banco e lógica de transição no service
- Validação de estoque na criação do pedido (consulta estoque atual do produto)
- `PaymentsModule` como sub-recurso de orders (`POST /v1/orders/:id/payments`)
- `DashboardModule` com métricas via query agregada (vendas do dia/semana/mês, pedidos por status, top 5 produtos)
- `ClerkGuard` validando JWT contra JWKS do Clerk com cache de chaves
- `@Roles(ADMIN, CUSTOMER)` decorator para RBAC
- `AuditService` + tabela `AuditLog` no Prisma para operações CUD
- Erros seguem RFC 9457 (Problem Details)
- Testes unitários e de integração com cobertura ≥ 80%

**Non-Goals:**
- Gateway de pagamento real (MVP usa registro manual)
- E-mail/WhatsApp transacional
- Multi-tenancy

## Decisions

| Decisão | Alternativa | Rationale |
|---------|-------------|-----------|
| Clerk como IdP externo vs auth própria | Clerk | Requisito de arquitetura; delega identidade para provedor OIDC |
| Máquina de estados no service + banco vs apenas em memória | Service + banco | Status persiste no banco para consulta; lógica de transição validada no service |
| Auditoria em tabela separada vs logs estruturados apenas | Tabela separada (`AuditLog`) | Consultável via queries; consistente com operações CUD |
| Dashboard metrics via query agregada vs cache | Query agregada | MVP sem necessidade de cache; revisar se houver degradação |
| Kwes rados vs `node-jose` para validação JWKS | `jose` | Biblioteca nativa, sem dependências pesadas, suporte a JWKS |

## Risks / Trade-offs

- [JWKS] Clerk pode rotacionar chaves → cache com refresh periódico (padrão 1h)
- [Concorrência] Dois admins avançam status simultaneamente → usar transação Prisma
- [Auditoria] Volume alto de registros → índice composto por entidade + timestamp
- [Estoque] Condição de corrida na validação → transação Prisma com lock otimista
