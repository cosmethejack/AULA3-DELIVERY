## Context

A plataforma core (#02) já entrega o backend NestJS. Esta mudança estabelece a **fundação de
dados**: o Prisma contra PostgreSQL e a modelagem das 6 entidades do domínio, com migration
inicial versionada e seed de desenvolvimento. Todo acesso a dados é exclusivamente via Prisma
(sem raw SQL), com PostgreSQL padrão e portável (sem extensões de fornecedor).

O repositório já possui parte desta fundação em `apps/backend/prisma` e
`apps/backend/src/core/database`:

- `schema.prisma`: modela `Category`, `Product`, `Customer`, `Order`, `OrderItem`, `Payment`
  (mais `AuditLog`, de #06), com enums de status em inglês.
- `PrismaService`: estende `PrismaClient` com o adapter `PrismaPg`, gerenciando ciclo de vida
  via `OnModuleInit`/`OnModuleDestroy`.
- `migrations/`: `init` e `add_audit_log` versionadas; `seed.cjs` para dados de desenvolvimento.

## Goals / Non-Goals

**Goals:**
- Schema Prisma das 6 entidades do MVP com relacionamentos e constraints (unicidade em
  `Category.slug`, `Customer.email`, `Order.numero`).
- Enums de status: `OrderStatus`, `PaymentStatus`, `PaymentMethod`.
- Migration inicial versionada aplicável do zero; migrations para toda alteração de schema.
- `PrismaService` com ciclo de vida gerenciado (connect/disconnect).
- `seed` de desenvolvimento (categorias/produtos/exemplos) idempotente.
- Acesso a dados exclusivamente via Prisma (proibido raw SQL).

**Non-Goals:**
- Endpoints, DTOs e regras de negócio (entram nas mudanças de cada módulo).
- `Customer.clerkUserId` (vínculo de identidade) — introduzido em #13.
- Qualquer artefato de multi-tenancy (`tenant_id`) — proibido no MVP.

## Decisions

**Enums de status em inglês, semântica da máquina de estados no domínio.** `OrderStatus`
usa `PENDING → CONFIRMED → PREPARING → SHIPPED → DELIVERED` e `CANCELLED`. Os rótulos em
inglês são um detalhe de armazenamento; a máquina de estados e suas transições válidas são
regra de negócio implementada no módulo de pedidos (#16), não no schema.

**Adapter `PrismaPg` no `PrismaService`.** A conexão usa o driver adapter `@prisma/adapter-pg`
com `DATABASE_URL`, mantendo portabilidade PostgreSQL padrão. O ciclo de vida do cliente é
atrelado ao ciclo do módulo Nest (`$connect` no init, `$disconnect` no destroy), evitando
conexões órfãs.

**Migrations versionadas como fonte única de mudança de schema.** É proibido alterar tabelas
manualmente; toda alteração gera uma migration versionada em `prisma/migrations`. Isso garante
reprodutibilidade (aplicar do zero) e histórico auditável.

**Seed restrito a desenvolvimento.** O `seed` popula dados de exemplo (categorias, produtos,
admin) apenas para ambientes de desenvolvimento, sem segredos reais, e é idempotente para poder
rodar repetidamente sem quebrar por unicidade.

**Decimais monetários com precisão fixa.** Preços e valores usam `Decimal(10,2)` para evitar
erros de ponto flutuante em dinheiro.

## Risks / Trade-offs

- **[Erro de modelagem propaga para todos os módulos]** → Revisão do schema + teste de
  integração aplicando a migration do zero e validando tabelas/constraints.
- **[Dados sensíveis no seed]** → Seed apenas de desenvolvimento, sem segredos; valores de
  exemplo versionados.
- **[Divergência entre schema e banco por alteração manual]** → Migrations versionadas como
  única via de mudança; `prisma validate`/`format` no fluxo.
- **[Conexões órfãs do Prisma]** → Ciclo de vida gerenciado pelo `PrismaService`
  (`OnModuleInit`/`OnModuleDestroy`).
