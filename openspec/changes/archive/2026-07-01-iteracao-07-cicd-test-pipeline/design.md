## Context

A proposta #07 promete um **gate de cobertura** que faz o build falhar abaixo de
80% (backend) / 70% (frontend), tornando verificável a regra "nenhuma mudança
conclui sem testes" (RNF-06). A exploração do repositório revelou o estado atual:

- **Workflows já existem, mas fragmentados:** `.github/workflows/ci.yml` (jobs
  `backend` e `frontend`, cada um roda `lint` → `test` → `build`) e
  `playwright.yml` (E2E + serviço Postgres). Nenhum job de `coverage-gate`.
- **O CI não coleta cobertura:** `ci.yml` chama `npm run test` (backend `jest`,
  frontend `vitest run`) — nenhum dos dois com `--coverage`.
- **Nenhum threshold armado:** o `jest` do backend (config em `package.json`)
  tem `collectCoverageFrom` mas **não tem `coverageThreshold`**; o
  `vitest.config.ts` do frontend tem `coverage` (provider v8) mas **sem
  `thresholds`**.
- **Denominador do backend reduzido artificialmente:** o `collectCoverageFrom`
  **exclui** `catalog/**`, `customers/**` e `observability/**`.
- **Realidade dos testes:** 11 arquivos `*.spec.ts` no backend; **1** arquivo de
  teste no frontend.
- **Disparo dos workflows aponta para `main`**, mas a branch ativa do projeto é
  `master`.

O padrão organizacional (Test Quality) fixa a meta em backend 80% e frontend 70%,
ambos em linhas e branches. As decisões abaixo foram tomadas pelo responsável da
mudança.

## Goals / Non-Goals

**Goals:**
- Armar um `coverage-gate` real que falhe o build abaixo de **80% (backend) /
  70% (frontend)** em linhas e branches — gate **absoluto**, desde já.
- Medir cobertura sobre o **código inteiro** do backend (sem exclusões de
  módulos).
- Coletar cobertura de verdade no CI (backend e frontend) e publicar o relatório
  como artefato no PR.
- Corrigir o disparo dos workflows para a branch correta (`master`).

**Non-Goals:**
- Deploy/CD para produção (fora de escopo da #07).
- Reestruturar os workflows num único arquivo (CI e E2E permanecem separados).

## Decisions

### Decisão 1 — Gate **absoluto** 80/70 desde já
O `coverageThreshold` (jest) e `coverage.thresholds` (vitest) são fixados em 80%
(backend) e 70% (frontend), linhas **e** branches. O build falha enquanto a
cobertura estiver abaixo. Não há fase de *ratchet*: a meta organizacional é
também o piso de entrada.

- **Implicação assumida:** a #07 passa a **incluir a escrita dos testes
  faltantes** necessários para atingir 80/70. Sem isso, o build fica vermelho.
  Esse esforço é parte do escopo da mudança (refletir em `tasks.md`).
- **Alternativa considerada (ratchet — piso atual subindo):** rejeitada. Optou-se
  por cravar a meta imediatamente em vez de uma subida incremental.

### Decisão 2 — Remover as exclusões `catalog`, `customers`, `observability`
O `collectCoverageFrom` do backend passa a medir todos os módulos. Os 80% valem
sobre o escopo completo do código.

- **Por quê:** medir só metade do código dá falsa segurança e contradiz o
  propósito do gate. Combinada com a Decisão 1, eleva o esforço de teste (80% de
  um denominador maior), mas torna o número verdadeiro.
- **Alternativa considerada (manter exclusões):** rejeitada — perpetua ponto cego
  nos módulos de negócio centrais.

### Decisão 3 — Job `coverage-gate` coletando cobertura via thresholds nativos
Backend roda `jest --coverage`; frontend roda `vitest run --coverage`. O gate é
aplicado pelos thresholds nativos das ferramentas (sem script externo de parse).
Relatórios publicados com `upload-artifact`.

- **Por quê:** thresholds nativos são a fonte da verdade e evitam lógica frágil
  de parsing de relatório.

### Decisão 4 — Corrigir branch de disparo `main` → `master` na #07
Os três workflows (`ci.yml`, `playwright.yml`, `deploy-*`) passam a disparar em
`master`. Faz parte desta mudança.

- **Por quê:** com o disparo em `main` e a branch ativa em `master`, os pipelines
  provavelmente nunca executam — o que inviabiliza a Definição de Pronto ("pipeline
  verde em um PR"). É o gap mais barato e mais crítico.

### Decisão 5 — Manter CI e E2E em workflows separados
Mantém-se `playwright.yml` (E2E lento, com Postgres) separado do CI rápido
(lint + unit + cobertura), em vez do `ci.yml` único de 5 jobs sugerido na
proposta.

- **Por quê:** isolar a suíte lenta/flaky do feedback rápido reduz o custo de
  instabilidade sobre o sinal principal.

### Decisão 6 — Lint de verdade: ESLint + `actionlint`
O job `lint` deixa de ser apenas `tsc --noEmit`. Introduz-se **ESLint** nos dois
apps (a stack oficial do projeto cita ESLint) e **`actionlint`** para validar os
próprios YAMLs de workflow. O `tsc --noEmit` permanece como checagem de tipos
complementar, não como o "lint".

- **Por quê:** type-check não captura problemas de estilo, antipadrões e regras
  de qualidade que o ESLint cobre; e `actionlint` evita YAML de CI quebrado
  passar despercebido. Alinha com a stack declarada (ESLint).
- **Alternativa considerada (manter só `tsc --noEmit`):** rejeitada — menor
  escopo, mas não é lint de verdade e diverge da stack.

## Risks / Trade-offs

- **80/70 absoluto + escopo completo = build vermelho até os testes existirem**
  → o gate só fica verde após escrever os testes faltantes (hoje 11 specs back /
  1 teste front). Mitigação: tratar a escrita dos testes como parte explícita do
  escopo da #07 (tasks), não como pré-requisito externo.
- **Frontend é o ponto mais distante da meta** (1 teste → 70%) → maior bloco de
  esforço. Mitigação: priorizar testes de maior cobertura por linha (componentes
  e serviços de uso amplo) primeiro.
- **Remover exclusões derruba o número aparente do backend** → não é regressão
  real, é correção de medição. Mitigação: comunicar no PR.

## Open Questions

- **Branches de longa duração:** além de `master`, os workflows devem disparar em
  PRs de outras branches base, ou só `master`? (Assumido: só `master` por ora.)