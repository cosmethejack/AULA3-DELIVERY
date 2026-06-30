# Pipeline de CI/CD — Lint + Testes + Gates de Cobertura (#07)

## Resumo

Configurar o pipeline **GitHub Actions** que executa, a cada push/PR, as quatro camadas de
qualidade — **lint, testes unitários, testes de integração e E2E** — com **gates de
cobertura** (Backend 80% linhas/branches; Frontend 70%). É o instrumento que torna a regra
"nenhuma mudança conclui sem testes" verificável automaticamente. Atende RNF-06.

## Dimensionamento

- **Tamanho:** Médio — workflow multi-job com serviços.
- **Complexidade:** Média — orquestração de serviços (Postgres) e cache.
- **Risco:** Baixo — não altera código de produção.

## Escopo Funcional

- Workflow `.github/workflows/ci.yml` com jobs: `lint`, `test-unit`, `test-integration`
  (serviço PostgreSQL), `test-e2e` (Playwright), `coverage-gate`.
- Cache de dependências; matriz por workspace (frontend/backend).
- Gate de cobertura falha o build se abaixo das metas (80%/70%).
- Relatório de cobertura publicado como artefato; status obrigatório no PR.

## Dependências

- #01 project-foundation (scripts e ferramentas de teste já existentes).

## Riscos

- Flakiness de E2E quebrando builds. Mitigação: retry controlado + isolamento de serviços.
- Pipeline lenta. Mitigação: jobs paralelos + cache.

## Qualidade & Testes

### Linter
- O próprio pipeline executa `npm run lint`; o YAML é validado (actionlint).

### Testes Unitários
- O pipeline executa as suítes unitárias de ambos os apps e coleta cobertura.

### Testes de Integração
- O pipeline sobe o serviço PostgreSQL e executa as suítes de integração (Supertest).

### Testes E2E
- O pipeline executa Playwright contra o app em modo de teste.

## Definição de Pronto

- Pipeline verde em um PR de exemplo, com os 4 jobs executando e o gate de cobertura ativo.
- Build falha corretamente quando a cobertura fica abaixo da meta (validado).

## Fora de Escopo

- Deploy/CD para produção (Terraform/infra) — versões futuras.
