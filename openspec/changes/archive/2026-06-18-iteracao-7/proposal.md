# Observabilidade — OpenTelemetry

## Resumo

Instrumentar o backend com OpenTelemetry para gerar traces, logs estruturados e métricas compatíveis com Grafana Cloud.

## Risco

**Pequeno** — configuração de SDK, sem alteração de lógica de negócio.

## Artefatos

- SDK OpenTelemetry (`@opentelemetry/sdk-node`)
- Auto-instrumentação (`@opentelemetry/auto-instrumentations-node`)
- Exporter OTLP/HTTP configurável via env
- Inicializador `otel.ts` (primeiro import em `main.ts`)
- Logs estruturados (substituir `console.log`)
- Propagação de `trace_id`, `span_id`, `request_id`

## Dependências

- `iteracao 1` (backend scaffold)

## Protótipos (Stitch)

Projeto: **DELIVERY** (ID: `projects/7259599975311263388`)

N/A — mudança de infraestrutura, sem interface gráfica.

## Fora de Escopo

- Dashboard Grafana (configuração externa)
- Métricas de frontend (futuro)

## Tarefas Principais

1. Instalar pacotes OpenTelemetry
2. Criar `src/core/observability/otel.ts`
3. Configurar exporter OTLP/HTTP
4. Adicionar variáveis de ambiente (`OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_SERVICE_NAME`)
5. Substituir `console.log()` por logging estruturado
6. Propagar `trace_id` e `request_id` nas respostas HTTP
