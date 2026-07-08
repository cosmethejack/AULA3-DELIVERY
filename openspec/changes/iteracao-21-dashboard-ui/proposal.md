# UI do Dashboard (#21) — RF-07

## Resumo

Tela de **Dashboard** (admin) exibindo Vendas Totais, Recebido e Pendente com **filtro de
período**; aplicar filtro atualiza os indicadores. Conforme `docs/spec.md` e `docs/design.md`.

## Dimensionamento

- **Tamanho:** Pequeno — uma tela consumindo um endpoint.
- **Complexidade:** Baixa — exibição + filtro.
- **Risco:** Baixo — somente leitura, protegido por RBAC.

## Escopo Funcional

### Frontend
- Cartões de indicadores: Vendas Totais, Recebido, Pendente.
- **Filtro de período** (padrão últimos 30 dias); comando **Aplicar filtro** atualiza os valores.
- Estados de carregamento/erro/vazio; rota protegida (ADMIN); integração via `services`.
- Componentes/tokens conforme `docs/design.md`.

## Dependências

- #20 dashboard-metrics-api, #05 identity-rbac-foundation.

## Riscos

- Indicadores desatualizados após filtrar. Mitigação: re-fetch ao aplicar filtro + teste.

## Qualidade & Testes

### Linter
- `npm run lint` (frontend) verde.

### Testes Unitários
- Cartões renderizam valores; aplicar filtro dispara nova consulta e atualiza; estados de loading/erro.

### Testes de Integração
- Não se aplica (UI); contrato via mock de `services`.

### Testes E2E (Playwright)
- ADMIN abre o dashboard, vê indicadores padrão (30 dias) e altera o período vendo os valores atualizarem.

## Definição de Pronto

- Dashboard exibindo indicadores corretos com filtro funcional.
- Lint + unit + E2E verdes; cobertura frontend ≥ 70%.

## Fora de Escopo

- Exportação e gráficos avançados (futuro).
