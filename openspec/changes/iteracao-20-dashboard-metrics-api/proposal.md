# API de Métricas do Dashboard (#20) — RF-07

## Resumo

Expor endpoint que calcula os indicadores do dashboard para um período (padrão últimos 30
dias): **Vendas Totais** (pedidos não cancelados), **Recebido** (pagamentos registrados) e
**Pendente** (pedidos sem pagamento registrado). Apenas ADMIN.

## Dimensionamento

- **Tamanho:** Médio — agregações com filtro de período.
- **Complexidade:** Média — consultas de agregação corretas por período.
- **Risco:** Baixo — somente leitura.

## Escopo Funcional

### Backend
- `GET /v1/dashboard/metrics?from&to` (ADMIN); padrão = últimos 30 dias.
- Cálculos conforme `docs/spec.md`:
  - Vendas Totais = soma de pedidos não cancelados no período.
  - Recebido = soma de pagamentos registrados no período.
  - Pendente = valor de pedidos sem pagamento registrado no período.
- Dados refletem apenas pedidos registrados; erros RFC 9457.

## Dependências

- #16 order-state-machine, #19 payments-management.

## Riscos

- Agregação incorreta por borda de período. Mitigação: testes de edge (limites do intervalo).
- Pedidos cancelados contados em vendas. Mitigação: exclusão explícita + teste.

## Qualidade & Testes

### Linter
- `npm run lint` (backend) verde.

### Testes Unitários
- Funções de agregação: somatórios corretos; cancelados excluídos; default 30 dias quando sem filtro.

### Testes de Integração
- Supertest + dados semeados: métricas batem para um período conhecido; ADMIN 200, CUSTOMER 403; bordas de data.

### Testes E2E
- Não se aplica (UI em #21).

## Definição de Pronto

- Indicadores corretos por período, restritos a ADMIN.
- Lint + unit + integração verdes; cobertura backend ≥ 80%.

## Fora de Escopo

- Relatórios PDF/Excel e gráficos avançados (futuro).
