## 1. OpenTelemetry SDK

- [x] 1.1 Instalar pacotes OpenTelemetry
- [x] 1.2 Criar `src/core/observability/otel.ts` como primeiro import em `main.ts`
- [x] 1.3 Configurar auto-instrumentação HTTP
- [x] 1.4 Configurar exporter OTLP/HTTP via variáveis de ambiente

## 2. Logs Estruturados

- [x] 2.1 Criar AppLogger com campos: timestamp, level, service
- [ ] 2.2 Substituir todos os `console.log()` pelo logger (parcial — AppLogger existe mas não substitui 100%)
- [ ] 2.3 Propagar `trace_id`, `span_id` e `request_id` nas respostas HTTP (postergado)

## 3. Qualidade

- [ ] 3.1 Verificar traces gerados (postergado — depende de setup Grafana)
- [x] 3.2 Verificar lint e build (tsc --noEmit ok)
