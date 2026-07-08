# Roadmap de Implementação — GRUPO5-DELIVERY

Planejamento incremental da aplicação web full stack (e-micro-commerce de fluxo duplo:
vitrine para o **Cliente** + painel de gestão para o **Administrador**), decomposto em
mudanças OpenSpec independentes e testáveis.

## Princípios de dimensionamento

- **Nenhuma mudança ultrapassa o nível Médio** em Tamanho, Complexidade ou Risco.
- **Fatias verticais finas**: API (backend) e UI (frontend) são separadas por capability
  sempre que a junção excederia Médio.
- **Fundações primeiro**: plataforma, dados, identidade, auditoria, observabilidade e o
  **pipeline de CI/CD** precedem as features, para que toda feature já nasça sob os gates de teste.
- **Definição de Pronto inegociável**: nenhuma mudança é concluída sem o conjunto de testes
  correspondente verde e dentro das metas de cobertura (Backend 80% linhas/branches; Frontend 70%).

## Fonte das interfaces

UI dimensionada a partir de `docs/spec.md` (telas e comandos). Os tokens de UI usados como
referência provisória vêm de `docs/design.md`.

> **Ressalva importante sobre `docs/design.md`:** o arquivo se identifica como
> `Shopifi-design-analysis` — um sistema de design **genérico inspirado na Shopify**. **Não**
> há evidência de que tenha sido extraído do projeto Stitch deste produto, nem de que
> represente a identidade visual oficial do GRUPO5-DELIVERY. Deve ser tratado como
> **template de exemplo**, não como o design definitivo.
>
> **Projeto no Stitch:** `DELIVERY` (ID `projects/7259599975311263388`).
> Atenção: `GRUPO5-DELIVERY` é o nome do **produto/repositório** (README), **não** o nome
> do projeto no Stitch. Os **protótipos/telas reais** das mudanças de frontend (#10, #11, #14,
> #17, #18, #21) ainda precisam ser obtidos/gerados nesse projeto Stitch via MCP correspondente
> (inacessível na sessão atual do Claude Code) — só então a UI estará definitivamente especificada.

> **Nota sobre `docs/problem.md`:** atualmente é um template em branco (apenas placeholders),
> sem conteúdo aproveitável; o problema/solução estão descritos em `docs/prd.md`.

## Metas de cobertura e ferramentas (de `docs/architecture.md`)

| Camada    | Lint   | Unidade | Integração      | E2E        | Cobertura mínima        |
| --------- | ------ | ------- | --------------- | ---------- | ----------------------- |
| Backend   | ESLint | Jest    | Jest + Supertest| —          | 80% linhas / 80% branches |
| Frontend  | ESLint | Jest    | —               | Playwright | 70% linhas / 70% branches |

## Sequência e dependências

Cada mudança é registrada no OpenSpec com o id `iteracao-NN-<descritor>` (NN = número abaixo).

```
FASE 0 — FUNDAÇÕES & PLATAFORMA
 iteracao-01-project-foundation
 iteracao-02-backend-core-platform ........... dep: 01
 iteracao-03-observability-foundation ........ dep: 02
 iteracao-04-database-schema-foundation ...... dep: 02
 iteracao-05-identity-rbac-foundation ........ dep: 02, 04
 iteracao-06-audit-foundation ................ dep: 02, 04
 iteracao-07-cicd-test-pipeline .............. dep: 01

FASE 1 — CATÁLOGO (RF-01/03/04)
 iteracao-08-catalog-categories-api .......... dep: 04, 05, 06
 iteracao-09-catalog-products-api ............ dep: 08
 iteracao-10-public-storefront ............... dep: 09
 iteracao-11-admin-catalog-ui ................ dep: 08, 09, 05

FASE 2 — CLIENTES & IDENTIDADE (RF-05)
 iteracao-12-customer-crud-api ............... dep: 04, 05, 06
 iteracao-13-customer-registration-auth ...... dep: 05, 12
 iteracao-14-admin-customer-ui ............... dep: 12, 05

FASE 3 — PEDIDOS & PAGAMENTOS (RF-02/06)
 iteracao-15-cart-and-checkout ............... dep: 09, 13
 iteracao-16-order-state-machine ............. dep: 15, 06
 iteracao-17-order-tracking-customer ......... dep: 15, 13
 iteracao-18-admin-order-management .......... dep: 16, 05
 iteracao-19-payments-management ............. dep: 16, 06

FASE 4 — DASHBOARD (RF-07)
 iteracao-20-dashboard-metrics-api ........... dep: 16, 19
 iteracao-21-dashboard-ui .................... dep: 20, 05

FASE 5 — ENDURECIMENTO (NFR)
 iteracao-22-security-hardening .............. dep: 05, 15
```

## Quadro de mudanças

> O id da mudança no OpenSpec é `iteracao-<#>-<Mudança>` (ex.: `# 15` + `cart-and-checkout` → `iteracao-15-cart-and-checkout`).

| #  | Mudança                    | RF/NFR            | Tamanho | Complexidade | Risco | Testes-chave            |
| -- | -------------------------- | ----------------- | ------- | ------------ | ----- | ----------------------- |
| 01 | project-foundation         | RNF-06            | Médio   | Baixa        | Baixo | Lint + smoke unit       |
| 02 | backend-core-platform      | Confiabilidade    | Médio   | Média        | Baixo | Unit + Integração       |
| 03 | observability-foundation   | RNF-03            | Médio   | Média        | Baixo | Unit + Integração       |
| 04 | database-schema-foundation | Persistência      | Médio   | Média        | Médio | Integração (migration)  |
| 05 | identity-rbac-foundation   | RNF-01 / Segurança| Médio   | Média        | Médio | Unit + Integração       |
| 06 | audit-foundation           | RNF-02            | Pequeno | Média        | Baixo | Unit + Integração       |
| 07 | cicd-test-pipeline         | RNF-06            | Médio   | Média        | Baixo | Pipeline verde          |
| 08 | catalog-categories-api     | RF-03             | Pequeno | Baixa        | Baixo | Unit + Integração       |
| 09 | catalog-products-api       | RF-04             | Médio   | Média        | Baixo | Unit + Integração       |
| 10 | public-storefront          | RF-01             | Médio   | Média        | Baixo | Unit + E2E              |
| 11 | admin-catalog-ui           | RF-03/04          | Médio   | Média        | Baixo | Unit + E2E              |
| 12 | customer-crud-api          | RF-05             | Médio   | Média        | Baixo | Unit + Integração       |
| 13 | customer-registration-auth | RF-05 / Segurança | Médio   | Média        | Médio | Unit + Integração + E2E |
| 14 | admin-customer-ui          | RF-05             | Pequeno | Baixa        | Baixo | Unit + E2E              |
| 15 | cart-and-checkout          | RF-02 / IDOR      | Médio   | Média        | Médio | Unit + Integração + E2E |
| 16 | order-state-machine        | RF-02/06          | Médio   | Média        | Médio | Unit + Integração       |
| 17 | order-tracking-customer    | RF-02             | Médio   | Média        | Baixo | Unit + E2E              |
| 18 | admin-order-management     | RF-06             | Médio   | Média        | Baixo | Unit + E2E              |
| 19 | payments-management        | RF-06             | Médio   | Média        | Médio | Unit + Integração       |
| 20 | dashboard-metrics-api      | RF-07             | Médio   | Média        | Baixo | Unit + Integração       |
| 21 | dashboard-ui               | RF-07             | Pequeno | Baixa        | Baixo | Unit + E2E              |
| 22 | security-hardening         | RNF-01            | Médio   | Média        | Médio | Integração + E2E        |

## Marcos (milestones)

- **M0 — Plataforma pronta (01–07):** app sobe, migrations rodam, identidade/RBAC e auditoria
  ativos, pipeline de CI/CD verde com os 4 tipos de teste.
- **M1 — Catálogo navegável (08–11):** vitrine pública + gestão admin de catálogo.
- **M2 — Clientes e contas (12–14):** cadastro/login próprios e gestão admin de clientes.
- **M3 — Pedidos ponta a ponta (15–19):** checkout autenticado, ciclo de status, histórico, pagamentos.
- **M4 — Dashboard (20–21):** indicadores de venda com filtro de período.
- **M5 — Endurecimento (22):** rate limit, CORS, headers e revisão de IDOR.

## Fora de escopo (todas as fases)

Multi-tenancy e qualquer artefato de tenancy, gateway de pagamento real, WhatsApp/e-mail
transacional, app mobile, relatórios PDF/Excel — conforme PRD (Versões futuras) e os
Limites de Implementação do MVP em `docs/architecture.md`.
