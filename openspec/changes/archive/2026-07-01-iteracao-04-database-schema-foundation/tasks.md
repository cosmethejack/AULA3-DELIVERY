## 1. Schema Prisma

- [x] 1.1 Modelar as 6 entidades do MVP (`Category`, `Product`, `Customer`, `Order`, `OrderItem`, `Payment`) com relações
- [x] 1.2 Definir enums `OrderStatus`, `PaymentStatus`, `PaymentMethod`
- [x] 1.3 Garantir unicidade em `Category.slug`, `Customer.email`, `Order.numero`
- [x] 1.4 Usar `Decimal(10,2)` para campos monetários; sem `tenant_id` (proibido no MVP)
- [x] 1.5 Rodar `prisma format` e `prisma validate` no schema

## 2. Migrations

- [x] 2.1 Gerar a migration inicial versionada (aplicável do zero)
- [x] 2.2 Confirmar `migration_lock.toml` e histórico versionado em `prisma/migrations`

## 3. PrismaService

- [x] 3.1 Implementar `PrismaService` (adapter `PrismaPg`, `DATABASE_URL`)
- [x] 3.2 Gerenciar ciclo de vida com `OnModuleInit` (`$connect`) e `OnModuleDestroy` (`$disconnect`)
- [x] 3.3 Registrar `DatabaseModule` exportando o `PrismaService`

## 4. Seed de desenvolvimento

- [x] 4.1 Criar `seed` com categorias/produtos/admin de exemplo (sem segredos)
- [x] 4.2 Tornar o seed idempotente (reexecução não quebra por unicidade)

## 5. Testes

- [x] 5.1 Unit: `PrismaService` conecta/desconecta (lifecycle) — no `jest` (mockado, sem DB)
- [x] 5.2 Validação local (Docker + `prisma migrate deploy` em banco vazio): migration do zero cria as 7 tabelas — fora do `jest` do CI (que não tem Postgres)
- [x] 5.3 Validação local: constraint de unicidade (`Category.slug`) rejeita duplicata
- [x] 5.4 Validação local: `seed` roda 2× e permanece idempotente (3 categorias / 6 produtos)
- [x] 5.5 Rodar `npm run lint` + testes do backend e confirmar cobertura ≥ 80% (gate verde)
