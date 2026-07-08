# Fundação de Observabilidade — OpenTelemetry & Logs Estruturados (#03)

## Resumo

Instrumentar o backend com **OpenTelemetry** (traces por endpoint HTTP) e **logging
estruturado** compatível com Grafana Cloud, propagando `trace_id`, `span_id` e `request_id`
e correlacionando logs/métricas/traces por um único correlation id. Atende RNF-03.

## Dimensionamento

- **Tamanho:** Médio — instrumentação transversal, majoritariamente wiring.
- **Complexidade:** Média — propagação de contexto e correlação exigem atenção.
- **Risco:** Baixo — não altera regra de negócio.

## Escopo Funcional

### Backend
- SDK OpenTelemetry: tracing automático de requisições HTTP; export configurável (OTLP/Grafana).
- Logger estruturado (JSON) com campos mínimos: `timestamp`, `level`, `service`, `trace_id`, `user_id`.
- Middleware/interceptor que gera e propaga `request_id` e injeta correlation id no log e no trace.
- **Proibido `console.log`** — regra de lint reforçando logging estruturado.

## Dependências

- #02 backend-core-platform.

## Riscos

- Overhead de tracing em produção. Mitigação: amostragem configurável por ambiente.
- Vazamento de dados sensíveis em logs. Mitigação: redaction de campos sensíveis.

## Qualidade & Testes

### Linter
- Regra ESLint `no-console` ativa; `npm run lint` verde.

### Testes Unitários
- Logger inclui os campos mínimos obrigatórios; redaction de campo sensível funciona.
- Geração/propagação de `request_id` quando ausente e reuso quando presente no header.

### Testes de Integração
- Supertest: resposta a uma rota expõe/propaga `request_id`; log emitido contém `trace_id` correlacionado.

### Testes E2E
- Não se aplica.

## Definição de Pronto

- Traces gerados por endpoint; logs estruturados com correlação; sem `console.log`.
- Lint + unit + integração verdes; cobertura backend ≥ 80%.

## Fora de Escopo

- Dashboards do Grafana e alertas (configuração de plataforma).
