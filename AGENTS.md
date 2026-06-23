# AGENTS.md

Guia operacional para agentes de IA (Antigravity, Claude Code, Cursor, Codex, OpenCode etc.) no projeto **DELIVERY**. Leia integralmente antes de qualquer alteração.

---

## 1. Comportamento geral

> Ref.: [karpathy-skills / CLAUDE.md](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md)

- Não suponha. Diante de ambiguidade, **pare e pergunte** — explicite a dúvida e os tradeoffs.
- Escreva o **mínimo de código** que resolve o problema. Nada especulativo.
- Faça **mudanças cirúrgicas**: toque só no necessário; não refatore sem pedido; siga o estilo existente.
- Defina critérios de sucesso verificáveis e **valide** antes de concluir.
- **Não remova** código pré-existente não relacionado às suas mudanças.

---

## 2. Stack tecnológica

> Base: [`docs/architecture.md`](docs/architecture.md)

| Camada | Tecnologias |
|--------|-------------|
| Frontend | TypeScript · Next.js 16+ (App Router) · Vanilla CSS |
| Backend | TypeScript · Node.js 24+ · NestJS 11+ · Prisma 7+ |
| Banco | PostgreSQL 15+ |
| Identidade | Clerk (OIDC / OAuth 2.0) |
| Observabilidade | OpenTelemetry · Grafana Cloud |
| DevOps | Docker · Terraform · GitHub Actions · npm Workspaces |

Estilo: web com backend desacoplado via APIs REST (JSON/HTTPS), backend como **fonte única de verdade** e política **Backend for Frontend (BFF)**.

---

## 3. Estrutura do monorepo

> Base: [`docs/architecture.md`](docs/architecture.md)

```text
apps/
 ├── frontend/src/   # app/ components/ features/ services/ hooks/ types/
 └── backend/src/    # core/{auth,database,observability,audit} + modules/{catalog,orders,customers}
infra/   # Terraform
docs/    # Documentação
.env     # Variáveis de ambiente (único, na raiz)
```

> `services/` é a única camada do frontend que integra com as APIs.

---

## 4. Comandos

```bash
# Setup inicial
npm install

# Banco de dados
docker compose up -d     # sobe PostgreSQL local
npm run db:migrate       # aplica migrations Prisma
npm run db:seed          # (opcional) carga inicial

# Build / Run
npm run build
npm run dev              # Frontend :3000 · Backend :3001
```

---

## 5. Qualidade e testes

> Base: [`docs/architecture.md`](docs/architecture.md)

```bash
npm run lint     # ESLint
npm run test     # Jest (unidade) + Supertest (integração)
npm run build
```

- E2E com **Playwright**.
- Cobertura mínima: **backend 80%** / **frontend 70%** (linhas e branches).
- Toda regra de negócio exige testes: **happy / sad / edge**. Não remover testes existentes.
- Erros de API seguem **RFC 9457 (Problem Details)**.
- Alteração de schema **sempre** gera migration Prisma versionada (proibido alterar tabelas manualmente).
- Create/Update/Delete em entidades críticas geram **auditoria** (usuário, objeto, ação, payload, timestamp).
- Proibido `console.log()` — usar logging estruturado (timestamp, level, service, trace_id, user_id).

---

## 6. Governança e autonomia no terminal

**Always (autônomo, sem confirmação):** ler qualquer arquivo/diretório do workspace; **criar, editar, renomear e mover** arquivos dentro do workspace; criar diretórios; reorganizar a estrutura de pastas **desde que nenhum conteúdo seja apagado ou sobrescrito**; `git status`/`git diff`; `npm run lint|test|build`; `openspec view`.

> Reorganizações não destrutivas (ex.: mover docs para `docs/`, renomear arquivos) **não exigem confirmação** — execute e informe o resultado. Sobrescrever um arquivo que **você não criou** nesta sessão exige lê-lo antes e, se o conteúdo divergir do esperado, perguntar.

**Ask first (confirmar):** **apagar** arquivos/diretórios pré-existentes (que você não criou nesta sessão), inclusive `rm -rf` e deleção em massa; mover/renomear que **sobrescreva** conteúdo existente; `git commit|push|reset --hard|rebase`; instalar nova dependência (com justificativa); migrations destrutivas (`prisma migrate reset`); ações em serviços externos (Vercel, Supabase, Clerk).

**Never (proibido):** commitar `.env` ou expor segredos; alterar a arquitetura definida; introduzir multi-tenancy (fora do MVP); implementar auth própria ou usar SDKs/componentes oficiais do Clerk no frontend; acessar PostgreSQL/Prisma/Supabase direto pelo frontend.

> Em automações 100% autônomas explicitamente solicitadas, use flags não interativas (`-y`, `-f`, `--quiet`).

---

## 7. Aprendizado contínuo

Ao final de **cada mudança**:

1. **Refletir** sobre decisões, dificuldades e divergências em relação a estas regras.
2. **Validar**: rodar lint + testes afetados; atualizar documentação impactada; listar arquivos modificados.
3. **Sugerir regra**: se identificar padrão recorrente ou lacuna, propor ajuste neste `AGENTS.md` (indicando seção e texto) antes de encerrar.

---

## 8. Documentação ([`docs/`](docs/))

- [`architecture.md`](docs/architecture.md) — arquitetura e requisitos não funcionais.
- [`prd.md`](docs/prd.md) — requisitos do produto.
- [`spec.md`](docs/spec.md) — especificação funcional (requisitos, entidades, interfaces).
- [`design.md`](docs/design.md) — design das interfaces.
- [`problem.md`](docs/problem.md) — definição do problema.

---

## 9. Context7 (informação atualizada)

Use o **MCP server do Context7** para obter documentação técnica atualizada de bibliotecas (Next.js, NestJS, Prisma, Clerk etc.) em vez de confiar em conhecimento possivelmente desatualizado. Fluxo: resolver ID da biblioteca → buscar doc do tópico → aplicar.

---

## 10. Checklist de conclusão

- [ ] Li a documentação relevante e verifiquei impacto (arquitetura, auth, observabilidade, testes).
- [ ] Escrevi/atualizei testes (happy/sad/edge) mantendo a cobertura mínima.
- [ ] `npm run lint` e `npm run test` passaram.
- [ ] Gerei migration Prisma quando alterei schema.
- [ ] Atualizei documentação afetada e listei arquivos modificados.
