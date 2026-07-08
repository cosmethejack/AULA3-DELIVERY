## Context

A plataforma core do backend (#02) já entrega o esqueleto NestJS (prefixo `/v1`, filtro
RFC 9457, `ConfigModule`, health). O backend já possui um bootstrap parcial de observabilidade
em `apps/backend/src/core/observability`:

- `otel.ts`: inicializa o `NodeSDK` do OpenTelemetry com auto-instrumentações HTTP e
  exporters OTLP para traces e métricas (endpoint configurável por env). Já cobre o tracing
  automático por requisição.
- `logger.service.ts` (`AppLogger`): logger JSON estruturado, mas emitindo apenas
  `timestamp`, `level`, `service`, `message`, `context`, `trace` — **sem `trace_id` nem
  `user_id`**, sem redaction e sem correlação com o trace ativo.

Esta mudança fecha as lacunas para atender ao RNF-03: campos mínimos de log, correlação por
um único id, propagação de `request_id`, redaction de dados sensíveis e a regra de lint
`no-console` (com exceção do próprio logger).

## Goals / Non-Goals

**Goals:**
- Logger estruturado JSON com os campos mínimos obrigatórios: `timestamp`, `level`,
  `service`, `trace_id`, `user_id` (além de `message`/`context`).
- Correlação: o `trace_id` do log deriva do span OpenTelemetry ativo; logs, métricas e traces
  compartilham o mesmo correlation id.
- Interceptor/middleware que gera `request_id` quando ausente e reutiliza o recebido no header,
  propagando-o na resposta e no contexto de log.
- Redaction de campos sensíveis nos logs (ex.: `password`, `token`, `authorization`).
- Regra ESLint `no-console` ativa no backend, com exceção pontual para a implementação do logger.

**Non-Goals:**
- Dashboards, alertas e configuração de plataforma no Grafana Cloud.
- Reescrever o bootstrap OTel existente (`otel.ts`) — permanece como está, salvo ajustes mínimos.
- Métricas de negócio customizadas (apenas as automáticas do SDK).

## Decisions

**Reaproveitar o `otel.ts` existente para tracing.** O `NodeSDK` com
`getNodeAutoInstrumentations()` já gera spans por requisição HTTP e exporta via OTLP. Mantemos
esse arquivo como fonte do tracing; a amostragem é controlável por variáveis de ambiente OTel
padrão. Alternativa (instrumentar manualmente) foi descartada por duplicar o que o SDK já faz.

**Correlação via API de contexto do OpenTelemetry.** O `AppLogger` lê o span ativo
(`trace.getActiveSpan()`) para extrair `trace_id`/`span_id` no momento do log, garantindo que
log e trace compartilhem o mesmo id sem acoplar o logger ao transporte HTTP. Quando não há
span ativo, os campos ficam vazios/nulos de forma explícita.

**`request_id` por interceptor.** Um interceptor NestJS gera um `request_id` (UUID) quando o
header correspondente (`x-request-id`) está ausente e reutiliza o valor recebido quando
presente, ecoando-o no header de resposta. Preferido a um middleware Express puro por integrar
ao ciclo de vida do Nest e ao contexto de execução.

**Redaction por lista de chaves sensíveis.** O logger remove/ofusca valores de um conjunto
configurável de chaves (`password`, `token`, `authorization`, `secret`) antes de serializar.
Simples e determinístico; evita vazamento acidental sem depender de scanners externos.

**`no-console` no ESLint com exceção para o logger.** A regra reforça o uso do logging
estruturado. O único ponto autorizado a chamar `console.*` é a implementação do `AppLogger`
(saída final), via override/`eslint-disable` localizado.

## Risks / Trade-offs

- **[Overhead de tracing em produção]** → Amostragem configurável por ambiente via variáveis
  OTel padrão; exporters já isolados por env.
- **[Vazamento de dados sensíveis em logs]** → Redaction por lista de chaves aplicada antes da
  serialização, coberta por teste unitário.
- **[Logger sem span ativo perde correlação]** → `trace_id`/`user_id` tratados como opcionais
  e emitidos vazios quando ausentes, sem quebrar o log.
- **[Regra `no-console` quebrar o próprio logger]** → Exceção localizada apenas na implementação
  do `AppLogger`; demais módulos permanecem proibidos de usar `console`.
