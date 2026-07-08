## Context

Esta é a mudança inicial do e-micro-commerce (DevAI). Não existe ainda estrutura de
repositório, tooling ou ambiente de desenvolvimento. Todas as demais iterações
(backend NestJS, frontend Next.js, observabilidade, RBAC, catálogo, pedidos, pagamentos)
dependem deste alicerce.

O objetivo é padronizar o monorepo com `npm workspaces`, a toolchain de TypeScript,
lint, testes (unitário/integração/E2E) e o ambiente local de banco (PostgreSQL via
Docker), sem introduzir nenhuma regra de negócio. A stack alvo é fixa: Node.js 24+,
NestJS 11+, Next.js 16+, Prisma 7+, PostgreSQL 15+, e as ferramentas de teste ESLint,
Jest, Supertest e Playwright.

Restrições relevantes já definidas no projeto:
- Política BFF: o frontend nunca acessa banco/Prisma diretamente.
- `.env` único na raiz — proibido `.env.local` ou `.env` por módulo.
- PostgreSQL padrão e portável (sem extensões de fornecedor).
- Cobertura mínima de testes: backend 80% (linhas e branches), frontend 70%.

## Goals / Non-Goals

**Goals:**
- Monorepo com `apps/frontend` e `apps/backend` e scripts raiz
  (`lint`, `test`, `test:e2e`, `build`) que orquestram os apps via `npm --prefix`.
- Configuração TypeScript por app (`tsconfig.json` em cada app).
- ESLint (flat config) por app com regras compatíveis com NestJS e Next.js.
- Cobertura habilitada nos dois apps (Jest no backend, Vitest no frontend) e
  Playwright na raiz para E2E.
- `.env` único na raiz + `.env.example`; `docker-compose.yml` com PostgreSQL 15+.
- README de bootstrap (instalar, subir banco, rodar testes) e estrutura de pastas
  conforme `docs/architecture.md`.

**Non-Goals:**
- Qualquer entidade, endpoint, tela ou regra de negócio.
- Configuração de CI/CD (GitHub Actions) — coberta na iteração 07.
- Integração com Clerk, OpenTelemetry, Grafana ou Terraform.
- Schema/migrations Prisma de domínio (apenas a fundação do ambiente).

## Decisions

**Organização do monorepo: apps orquestrados pela raiz (via `npm --prefix`).**
Os apps `apps/backend` e `apps/frontend` são pacotes npm próprios (cada um com seu
`package.json` e `package-lock.json`), e o `package.json` raiz orquestra os comandos
com `npm --prefix apps/<app> run <script>`. Isso mantém isolamento entre os apps e
evita hoisting inesperado; não foi adotado o campo `workspaces` do npm.

**Configuração de TypeScript por app.** Cada app tem seu próprio `tsconfig.json`
ajustado à sua stack (NestJS no backend, Next.js no frontend). Não há um
`tsconfig.base.json` compartilhado na raiz — o isolamento por app foi preferido à
centralização.

**ESLint flat config (`eslint.config.mjs`) por app.** O ESLint 9+ adota flat config
como padrão. Cada app mantém seu próprio `eslint.config.mjs` com regras adequadas à
sua stack (NestJS no backend, Next.js/React no frontend), em vez de uma config raiz
compartilhada.

**Runners de teste: Jest no backend, Vitest no frontend, Playwright na raiz.**
Cobertura é habilitada nos dois apps (Jest no backend, Vitest no frontend), e o
Playwright fica na raiz (`playwright.config.ts`) para os testes E2E. Os gates de
porcentagem (80%/70%) são aplicados em CI na iteração 07.

**`.env` único na raiz.** Um único arquivo de ambiente na raiz, carregado pelos apps,
com `.env.example` versionado e `.env` no `.gitignore`. Simplifica o bootstrap local e
evita configuração fragmentada por módulo (regra explícita do projeto).

**PostgreSQL via `docker-compose`.** Banco local reproduzível em PostgreSQL 15+, sem
extensões de fornecedor, garantindo portabilidade. Volume nomeado para persistência
local; porta e credenciais vindas do `.env`.

## Risks / Trade-offs

- **[Divergência de versões entre workspaces]** → Versões fixadas na raiz e um único
  `package-lock.json`; workspaces herdam dependências compartilhadas.
- **[Config de ESLint/TS divergente entre apps]** → Cada app mantém sua própria
  config alinhada à sua stack; revisões de tooling avaliam os dois apps em conjunto.
- **[Ambiente Docker indisponível na máquina do dev]** → README documenta pré-requisitos
  e o `.env.example` traz valores padrão; testes unitários não dependem do banco.
- **[Toolchain de E2E (Playwright) pesada de instalar]** → Teste E2E inicial é apenas um
  smoke placeholder (verde), validando que a toolchain instala e executa, sem cobertura
  de fluxo de negócio.
