# DELIVERY

> Plataforma de **e-micro-commerce** de fluxo duplo: uma vitrine digital simples para o **cliente** realizar pedidos e um painel de gestão completo para o **empreendedor** — do pedido ao pagamento.

A falta de controle em pedidos e pagamentos gera prejuízos diários para o microempreendedor. O **DELIVERY** resolve isso com simplicidade radical, vitrine profissional e controle financeiro, reduzindo a inadimplência e as perdas por esquecimento.

---

## Sumário

- [Visão geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Stack tecnológica](#stack-tecnológica)
- [Arquitetura](#arquitetura)
- [Estrutura do monorepo](#estrutura-do-monorepo)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Instalação e execução](#instalação-e-execução)
- [Testes e qualidade](#testes-e-qualidade)
- [Documentação](#documentação)
- [Roadmap](#roadmap)
- [Licença](#licença)

---

## Visão geral

O sistema atende a dois perfis de usuário:

| Perfil | Objetivo |
|--------|----------|
| **Administrador** (empreendedor) | Gerir vendas (fluxo de pedidos e pagamentos), produtos, categorias e clientes. |
| **Cliente** | Navegar pela vitrine e realizar pedidos de forma simples e transparente. |

**Métricas de sucesso:** aumentar em 20% o total recebido (R$) e reduzir em 10% o total pendente (R$) em 12 meses.

---

## Funcionalidades

| ID | Funcionalidade | Descrição |
|------|----------------|-----------|
| RF-01 | **Vitrine de Produtos** | Catálogo digital com nome, descrição, preço e imagem. |
| RF-02 | **Criação e Acompanhamento de Pedidos** | Criação de pedidos, cálculo automático de totais e histórico. |
| RF-03 | **Gestão de Categorias** | Cadastro, edição e organização de categorias (admin). |
| RF-04 | **Gestão de Produtos** | Cadastro, edição e controle de visibilidade na vitrine (admin). |
| RF-05 | **Gestão de Clientes** | Cadastro e manutenção de clientes (admin). |
| RF-06 | **Gestão de Pedidos** | Acompanhamento por status e registro manual de pagamentos (admin). |
| RF-07 | **Dashboard** | Vendas totais, recebidos, pendentes e filtros por período. |

**Fluxo de status do pedido:** `Novo → Pago → Preparação → Faturado → Despachado → Entregue` (qualquer estado, exceto Entregue, pode ir para `Cancelado`).

---

## Stack tecnológica

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | TypeScript, Next.js 16+ (App Router), Vanilla CSS |
| **Backend** | TypeScript, Node.js 24+, NestJS 11+, Prisma 7+ |
| **Banco de dados** | PostgreSQL 15+ |
| **Identidade** | Clerk (OIDC / OAuth 2.0) |
| **Observabilidade** | OpenTelemetry, Grafana Cloud |
| **DevOps** | Docker, Terraform, GitHub Actions |
| **Dev** | Google Antigravity, npm Workspaces |

---

## Arquitetura

- **Estilo:** aplicação web com backend desacoplado via APIs RESTful (JSON sobre HTTP/HTTPS).
- **Backend como fonte única de verdade:** toda regra de negócio reside no backend NestJS.
- **Política Backend for Frontend (BFF):** é proibido acesso direto do frontend ao PostgreSQL, Prisma, Supabase ou a recursos administrativos.
- **APIs versionadas:** base `https://api.dominio.com/v1`, padrão `/v1/recurso/id`, com paginação obrigatória em coleções.
- **Erros padronizados:** RFC 9457 (Problem Details).
- **Segurança:** autenticação/autorização exclusivamente no backend; RBAC com papéis `ADMIN` e `CUSTOMER`; HTTPS/TLS 1.2+, CSP, HSTS; Prisma com parâmetros (sem raw queries).
- **Auditoria:** toda operação de Create/Update/Delete em entidades críticas gera registro (usuário, objeto, ação, payload, timestamp).

> **MVP sem multi-tenancy.** Não há `tenant_id` nem abstrações de tenancy — isso pertence a versões futuras.

---

## Estrutura do monorepo

```text
apps/
 ├── frontend/
 │    └── src/
 │         ├── app/
 │         ├── components/
 │         ├── features/
 │         ├── services/
 │         ├── hooks/
 │         └── types/
 └── backend/
      └── src/
           ├── core/
           │    ├── auth/
           │    ├── database/
           │    ├── observability/
           │    └── audit/
           └── modules/
                ├── catalog/
                ├── orders/
                └── customers/
infra/        # Infraestrutura como código (Terraform)
docs/         # Documentação do projeto
.env          # Variáveis de ambiente (único, na raiz)
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 24+
- [Git](https://git-scm.com/)
- [Docker e Docker Compose](https://docker.com)
- Contas em: [GitHub](https://github.com/), [Vercel](https://vercel.com/), [Supabase](https://www.supabase.com/), [Clerk](https://clerk.com/), [Context7](https://context7.com/)

---

## Configuração do ambiente

> ⚠️ Utilize **apenas um arquivo `.env` na raiz** do projeto. É proibido criar `.env.local`, `.env` em módulos ou usar links simbólicos. Frontend e backend consomem o mesmo arquivo. O `.env` **nunca** deve ser commitado (já está no `.gitignore`).

Crie o arquivo `.env` na raiz com as chaves abaixo (preencha com seus valores):

```dotenv
PROJECT_NAME=DELIVERY
GLOBAL_PREFIX=api/v1

# Context7  — https://context7.com/dashboard
CONTEXT7_API_KEY=

# Stitch — https://stitch.withgoogle.com/settings
STITCH_API_KEY=

# Vercel — https://vercel.com/account/settings/tokens
VERCEL_API_TOKEN=

# Supabase — https://supabase.com/dashboard/account/tokens
SUPABASE_ACCESS_TOKEN=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
DIRECT_URL=

# Clerk — https://dashboard.clerk.com/apps/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_JWT_KEY=""

# Aplicação
FRONTEND_PORT=3000
BACKEND_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3005/v1
```

---

## Instalação e execução

```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd DELIVERY

# 2. Instalar dependências (npm Workspaces)
npm install

# 3. Subir o banco PostgreSQL local
docker compose up -d

# 4. Aplicar as migrations do Prisma
npm run db:migrate

# 5. Executar em modo desenvolvimento
npm run dev
```

Endpoints locais:

- **Frontend:** <http://localhost:3000>
- **Backend:** <http://localhost:3001>

---

## Testes e qualidade

| Tipo | Ferramenta |
|------|------------|
| Lint | ESLint |
| Unidade | Jest |
| Integração | Jest + Supertest |
| E2E | Playwright |

```bash
npm run lint     # análise estática
npm run test     # testes automatizados
npm run build    # build de produção
```

**Cobertura mínima exigida:**

- Backend: 80% de linhas e branches
- Frontend: 70% de linhas e branches

Toda alteração de regra de negócio exige testes cobrindo **happy path**, **sad path** e **edge cases**.

---

## Documentação

A documentação completa do projeto está em [`docs/`](docs/):

- [`architecture.md`](docs/architecture.md) — arquitetura, requisitos não funcionais e diretrizes técnicas.
- [`prd.md`](docs/prd.md) — definição de requisitos do produto.
- [`spec.md`](docs/spec.md) — especificação funcional (requisitos, entidades e interfaces).
- [`design.md`](docs/design.md) — design das interfaces.
- [`problem.md`](docs/problem.md) — definição do problema.

---

## Roadmap

Itens previstos para versões futuras (fora do escopo do MVP):

- Multi-tenancy (banco/schema por tenant)
- Gateway de pagamento real
- Notificações por WhatsApp e e-mail transacional
- Aplicativo mobile
- Relatórios em PDF/Excel
- Controle avançado de estoque e CRM de clientes

---

## Licença

Defina aqui a licença do projeto (ex.: MIT). Projeto desenvolvido no contexto da disciplina **CI/CD - Pipelines e Testes Automatizados** (Pós-graduação QE — PUC).
