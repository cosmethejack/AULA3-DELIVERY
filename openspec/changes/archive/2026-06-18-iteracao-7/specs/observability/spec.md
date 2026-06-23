## ADDED Requirements

### Requirement: Instrumentação OpenTelemetry
O backend DEVE inicializar o SDK OpenTelemetry como primeiro import, com auto-instrumentação HTTP e Prisma, exporter OTLP/HTTP configurável via env.

#### Scenario: Trace gerado em requisição HTTP
- **WHEN** qualquer requisição HTTP chega ao backend
- **THEN** um trace é gerado com trace_id e span_id propagados na resposta

### Requirement: Logs Estruturados
É proibido utilizar `console.log()`. Todo logging DEVE usar logger estruturado com campos timestamp, level, service, trace_id, user_id.

#### Scenario: Log substitui console.log
- **WHEN** qualquer parte do sistema registra um log
- **THEN** ele contém os campos estruturados mínimos
