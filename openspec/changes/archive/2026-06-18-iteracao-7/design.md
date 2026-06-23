## Context

Instrumentação do backend com OpenTelemetry para traces, logs estruturados e métricas compatíveis com Grafana Cloud.

## Goals / Non-Goals

**Goals:**
- SDK OpenTelemetry (`@opentelemetry/sdk-node`)
- Auto-instrumentação HTTP + Prisma + NestJS
- Exporter OTLP/HTTP configurável via env
- Inicializador `otel.ts` como primeiro import em `main.ts`
- Substituir `console.log()` por logging estruturado
- Propagação de `trace_id`, `span_id` e `request_id`

**Non-Goals:**
- Dashboard Grafana (configuração externa)
- Métricas de frontend
- Alertas

## Decisions

| Decisão | Alternativa | Rationale |
|---------|-------------|-----------|
| OTLP/HTTP vs OTLP/gRPC | gRPC | HTTP é mais simples e não requer dependências gRPC |
| Auto-instrumentação vs manual | Manual | Auto-instrumentação cobre HTTP + Prisma; complementar com spans manuais |
| `otel.ts` separado vs integrado no main | Separado | Deve ser o primeiro import para capturar inicialização |

## Risks / Trade-offs

- [Overhead] Tracing adiciona latência → sampling rate configurável via env
- [Setup] Exporter OTLP sem endpoint configurado → fallback para console exporter em dev
