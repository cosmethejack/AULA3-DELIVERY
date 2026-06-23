# Infraestrutura de Banco de Dados

## Resumo

Configurar o ambiente de banco de dados PostgreSQL via Docker e o ORM Prisma com schema inicial, migrations e seed opcional.

## Risco

**Pequeno** — não envolve lógica de negócio, apenas configuração.

## Artefatos

- `docker-compose.yml` com PostgreSQL 15+
- Schema Prisma (`schema.prisma`) com entidades: `Category`, `Product`, `Customer`, `Order`, `OrderItem`, `Payment`
- Migration inicial versionada
- Script de seed (dados para desenvolvimento)
- Conexão via variável de ambiente `.env`

## Dependências

Nenhuma.

## Frontend for Backend (BFF)

- Backend NestJS como única fonte de verdade para acesso a dados
- Proibido acesso direto ao PostgreSQL/Prisma pelo frontend
- Proibido raw queries SQL — usar Prisma com parâmetros

## Regras e Restrições

- Proibido recursos específicos de fornecedores SaaS PostgreSQL
- Migrations versionadas obrigatórias (proibido alterar tabelas manualmente)
- Portabilidade entre provedores PostgreSQL

## Protótipos (Stitch)

Projeto: **DELIVERY** (ID: `projects/7259599975311263388`)

N/A — mudança de infraestrutura, sem interface gráfica.

## Fora de Escopo

- Multi-tenancy (MVP não tem tenant_id)
- Supabase / provedor externo (MVP usa Docker local)

## Tarefas Principais

1. Criar `docker-compose.yml` com PostgreSQL 15+
2. Instalar e configurar Prisma no workspace backend
3. Mapear entidades no `schema.prisma`
4. Gerar migration `init`
5. (Opcional) Criar script de seed
6. Verificar `prisma generate` e conexão
