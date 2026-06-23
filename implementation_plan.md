# Plano de Implementação — GRUPO5-DELIVERY

## Status Atual

| Camada | Status |
|---|---|
| Monorepo (npm workspaces) | ✅ Pronto |
| Frontend scaffold (Next.js) | ✅ Pronto |
| Backend scaffold (NestJS) | ✅ Pronto |
| Prisma schema + generate | ✅ Pronto |
| docker-compose (PostgreSQL) | ✅ Pronto |
| Documentação (docs/) | ✅ Pronto |
| Agent skills | ✅ Instaladas |
| Backend lint + build | ✅ Zero erros |
| Backend testes (Jest) | ✅ 56 testes · 100% lines/stmts/funcs |
| Backend Fase 2 (módulos) | ✅ Concluída |
| Frontend Fase 3 (vitrine) | ✅ Concluída · lint/build ok |
| Frontend Fase 4 (dashboard) | ✅ Concluída · rotas protegidas |
| Frontend Fase 5 (auth plumbing) | ✅ token em memória · ⚠️ login Clerk ao vivo pendente |
| Frontend testes (Vitest) | ✅ 53 testes · 89% stmts / 91% lines |
| Fase 6 (OpenTelemetry) | ✅ SDK + exporter OTLP (ativa via env) |
| Fase 7 (CI/CD + Terraform) | ✅ workflows + infra · ⚠️ segredos/conexões externas |
| Fase 1 (Supabase/Docker) | ⚠️ Externa — Terraform pronto; falta provisionar/migrar |

---

## Fase 1 — Infraestrutura e Banco de Dados

### 1.1 Supabase
- [ ] Criar projeto no Supabase
- [ ] Copiar `DATABASE_URL` e `DIRECT_URL` para o `.env`
- [ ] Copiar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` para o `.env`
- [ ] Executar `npx prisma migrate dev` apontando para Supabase

### 1.2 Migrations locais (Docker)
- [ ] `docker compose up -d`
- [ ] `cd apps/backend && npx prisma migrate dev --name init`
- [ ] Verificar tabelas criadas no banco

---

## Fase 2 — Backend: Finalização dos Módulos

### 2.1 Dashboard endpoint ✅
- [x] Criar `src/modules/dashboard/dashboard.service.ts`
  - Vendas do dia/semana/mês (soma de `order.total` onde `paymentStatus = PAID`)
  - Contagem de pedidos por status
  - Top 5 produtos mais vendidos (count de `orderItem`)
- [x] Criar `src/modules/dashboard/dashboard.controller.ts` — `GET /dashboard/summary`
- [x] Registrar `DashboardModule` no `AppModule`

### 2.2 Testes unitários (cobertura mínima 80%) ✅
- [x] `catalog.service.spec.ts` — happy path, not found, validação
- [x] `orders.service.spec.ts` — criação de pedido, cálculo de total, atualização de status
- [x] `customers.service.spec.ts` — CRUD básico
- [x] `dashboard.service.spec.ts` — agregações
- [x] Specs de controllers + stubs de teste (Prisma client / jose) para o ts-jest
- Cobertura: 100% lines/stmts/funcs · branch 79,8% (teto pelos decorators do NestJS)

### 2.3 Validações e melhorias ✅
- [x] Adicionar `PartialType` nos DTOs de update (usar `@nestjs/mapped-types`) — agora wirados nos controllers
- [x] Adicionar paginação nos endpoints de listagem (`?page=1&limit=20`) — produtos, pedidos, clientes
- [x] Retornar `409 Conflict` quando slug de categoria já existe

---

## Fase 3 — Frontend: Vitrine Pública ✅

> Rotas sem autenticação, acessíveis pelo cliente final.

### 3.1 Serviço de API (`apps/frontend/src/services/`) ✅
- [x] `catalog.service.ts` — `getCategories()`, `getProducts(categoryId?)`, `getProduct(id)`
- [x] `orders.service.ts` — `createOrder(dto)`
- [x] `customers.service.ts` — `createCustomer(dto)` (para cadastro no checkout)
- [x] `lib/api.ts` (cliente fetch + `ApiError`), `lib/format.ts`, `types/`

### 3.2 Páginas da vitrine (`app/(vitrine)/`) ✅
- [x] `page.tsx` — grade de produtos com filtro por categoria
- [x] `[productId]/page.tsx` — detalhe do produto + botão "Adicionar ao carrinho"
- [x] `checkout/page.tsx` — carrinho + formulário do cliente + escolha de pagamento
- [x] `pedido/[id]/page.tsx` — confirmação do pedido (lê do sessionStorage; `GET /orders/:id` é protegido)

### 3.3 Componentes da vitrine ✅
- [x] `ProductCard` — imagem, nome, preço, botão
- [x] `CategoryFilter` — pills/tabs de categoria
- [x] `CartDrawer` — gaveta lateral com itens e total (+ `CartContext` global, persistência localStorage)
- [x] `CheckoutForm` — nome, telefone, endereço, forma de pagamento
- [x] Testes: Vitest + Testing Library — 25 testes, cobertura 88% stmts / 91% lines (≥70%)

---

## Fase 4 — Frontend: Dashboard do Empreendedor ✅

> Rotas protegidas por Clerk.

### 4.1 Layout do dashboard (`app/(dashboard)/layout.tsx`) ✅
- [x] Sidebar com links: Pedidos, Produtos, Categorias, Clientes, Resumo
- [x] Botão de logout no sidebar (header de username via claims do JWT fica como melhoria)
- [x] Proteção de rota: redireciona para `/sign-in` se não autenticado

### 4.2 Serviços autenticados ✅
- [x] `lib/apiClient.ts` (`authedGet`/`authedSend`) injeta `Authorization: Bearer`
- [x] Hook `useAuthedData` para carregar recursos protegidos
- [x] Services admin: `dashboard`, `catalog.admin`, `orders.admin`, `customers.admin`

### 4.3 Páginas do dashboard ✅
- [x] `pedidos/page.tsx` — lista de pedidos + avançar status
- [x] `produtos/page.tsx` — tabela de produtos com ações CRUD
- [x] `produtos/novo/page.tsx` — formulário de criação
- [x] `produtos/[id]/editar/page.tsx` — formulário de edição
- [x] `categorias/page.tsx` — CRUD de categorias (com 409 em slug duplicado)
- [x] `clientes/page.tsx` — lista de clientes
- [x] `clientes/[id]/page.tsx` — detalhe + histórico de pedidos
- [x] `dashboard/page.tsx` — cards de vendas + gráfico de status + mais vendidos

### 4.4 Componentes do dashboard ✅
- [x] `OrderStatusBadge` — badge colorido por status
- [x] `OrderCard` — card com info do pedido + ação de avançar status
- [x] `SalesChart` — gráfico de barras (pedidos por status; sem dependências externas)
- [x] `StatsCard` — card de métrica
- [x] `DataTable` — tabela reutilizável (paginação via parâmetros do service)

---

## Fase 5 — Autenticação (Clerk) ✅ (plumbing)

### 5.1 Frontend ✅
- [x] Página `app/sign-in/page.tsx` (recebe o token de sessão Clerk e autentica)
- [x] `AuthContext`/`useAuth` — token JWT + `signIn`/`signOut`
- [x] Token mantido **em memória** (não localStorage)
- [ ] ⚠️ Login Clerk completo via `@clerk/nextjs`/FAPI (UI hospedada) — passo com credenciais ao vivo

### 5.2 Backend (já tem o guard) ✅
- [x] `ClerkGuard` valida o JWT contra o JWKS do Clerk (instância `sacred-tiger-84`)
- [ ] ⚠️ Testar com token real do Clerk (requer login ao vivo)

---

## Fase 6 — Observabilidade ✅

### 6.1 OpenTelemetry no backend ✅
- [x] Instalado `@opentelemetry/sdk-node`, `@opentelemetry/auto-instrumentations-node`, `@opentelemetry/exporter-trace-otlp-http`
- [x] `src/core/observability/otel.ts` — inicializa o SDK (primeiro import do `main.ts`)
- [x] Exporter OTLP/HTTP configurável (ativa só com `OTEL_EXPORTER_OTLP_ENDPOINT` — Grafana Cloud)
- [x] `OTEL_EXPORTER_OTLP_ENDPOINT` e `OTEL_SERVICE_NAME` adicionados ao `.env`

---

## Fase 7 — CI/CD e Deploy ✅ (código) / ⚠️ (segredos externos)

### 7.1 GitHub Actions ✅
- [x] `.github/workflows/ci.yml` — lint + test (back+front) + build em todo PR/push
- [x] `.github/workflows/deploy-frontend.yml` — deploy no Vercel ao push em `main`
- [x] `.github/workflows/deploy-backend.yml` — deploy do backend (Railway)

### 7.2 Vercel (frontend) ⚠️ passos externos
- [ ] Conectar repositório no Vercel
- [ ] Configurar variáveis de ambiente no painel Vercel
- [ ] Adicionar `VERCEL_API_TOKEN`/`VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` aos GitHub Secrets

### 7.3 Terraform (infra/) ✅
- [x] `infra/main.tf` — provisiona projeto Supabase (provider `supabase/supabase`)
- [x] `infra/variables.tf` — variáveis de entrada
- [x] `infra/outputs.tf` — outputs: `project_id`, `api_url`, `database_url` + `infra/README.md`

---

## Ordem de Execução Recomendada

```
Fase 1 → Fase 2.1 (dashboard) → Fase 2.2 (testes) →
Fase 3 (vitrine) → Fase 4 (dashboard frontend) →
Fase 5 (auth) → Fase 6 (otel) → Fase 7 (ci/cd)
```

---

## Critérios de Conclusão (AGENTS.md)

Uma fase só está concluída quando:
- `npm run lint` → saída zero
- `npm run test` → saída zero (cobertura ≥ 80% backend / ≥ 70% frontend)
- `npm run build` → sem erros
