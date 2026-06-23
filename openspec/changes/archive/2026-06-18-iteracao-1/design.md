## Context

Infraestrutura de banco de dados para o MVP do DELIVERY. O backend NestJS depende de PostgreSQL 15+ gerenciado via Docker Compose e Prisma ORM para acesso a dados. Atualmente não há banco configurado — esta mudança estabelece a base para todos os módulos seguintes.

## Goals / Non-Goals

**Goals:**
- PostgreSQL 15+ rodando em container Docker via `docker-compose.yml`
- Schema Prisma com todas as entidades do MVP (Category, Product, Customer, Order, OrderItem, Payment)
- Migration inicial versionada
- Script de seed opcional para dados de desenvolvimento
- Conexão configurada via `.env` na raiz do monorepo

**Non-Goals:**
- Cluster ou replicação (MVP monobanco)
- Supabase ou provedor externo (apenas Docker local)
- Multi-tenancy ou tenant_id
- Configuração de backup/restore

## Decisions

| Decisão | Alternativa | Rationale |
|---------|-------------|-----------|
| Docker Compose vs instalação nativa | Nativa | Portabilidade entre máquinas dos devs; mesma versão do PostgreSQL |
| Prisma vs TypeORM | TypeORM | Prisma 7+ é o stack definido na arquitetura; geração de tipos automática |
| Migrations versionadas vs sync | Sync | Controle explícito de mudanças no schema; rollback possível |
| `schema.prisma` na raiz do backend vs monorepo | Monorepo | Prisma busca schema por path configurável; centraliza entidades |

## Risks / Trade-offs

- [Portabilidade] Docker requer Docker Desktop ou engine instalado → documentado no README
- [Seed] Dados de seed podem ficar dessincronizados com migrations → seed versionado junto com schema
- [Conexão] `.env` na raiz com múltiplos consumers → prefixo `DATABASE_URL` padronizado
