## ADDED Requirements

### Requirement: Tracing por endpoint HTTP
O backend DEVE (MUST) gerar traces OpenTelemetry para toda requisição HTTP, com export
configurável (OTLP) por variáveis de ambiente. Os traces DEVEM (MUST) propagar
`trace_id` e `span_id`.

#### Scenario: Requisição gera trace
- **WHEN** uma requisição HTTP é processada pelo backend
- **THEN** um span OpenTelemetry é criado com `trace_id` e `span_id` e exportado conforme a configuração OTLP

### Requirement: Logging estruturado com campos mínimos
O backend DEVE (MUST) emitir logs em JSON estruturado contendo ao menos os campos
`timestamp`, `level`, `service`, `trace_id` e `user_id`. É PROIBIDO (MUST NOT) usar
`console.log` fora da implementação do logger.

#### Scenario: Log contém os campos mínimos
- **WHEN** o backend registra uma entrada de log
- **THEN** a entrada é um JSON contendo `timestamp`, `level`, `service`, `trace_id` e `user_id`

#### Scenario: Lint barra console.log
- **WHEN** um arquivo (que não seja a implementação do logger) usa `console.log`
- **THEN** o `npm run lint` falha pela regra `no-console`

### Requirement: Correlação log-trace por id único
O `trace_id` presente nos logs DEVE (MUST) derivar do span OpenTelemetry ativo, de modo
que logs, métricas e traces compartilhem o mesmo correlation id. Quando não houver span
ativo, o campo DEVE (MUST) ser emitido vazio, sem quebrar o log.

#### Scenario: Log correlacionado com o trace ativo
- **WHEN** um log é emitido durante o processamento de uma requisição instrumentada
- **THEN** o `trace_id` do log é igual ao `trace_id` do span ativo

#### Scenario: Log sem span ativo
- **WHEN** um log é emitido sem span OpenTelemetry ativo
- **THEN** o `trace_id` é emitido vazio e o log é registrado normalmente

### Requirement: Propagação de request_id
O backend DEVE (MUST) gerar um `request_id` quando ausente no header da requisição e
DEVE (MUST) reutilizar o valor recebido quando presente, ecoando-o no header da resposta
e disponibilizando-o para correlação nos logs.

#### Scenario: request_id gerado quando ausente
- **WHEN** uma requisição chega sem header de `request_id`
- **THEN** o backend gera um `request_id` e o retorna no header da resposta

#### Scenario: request_id reutilizado quando presente
- **WHEN** uma requisição chega com um `request_id` no header
- **THEN** o backend reutiliza o mesmo valor na resposta e na correlação de logs

### Requirement: Redaction de dados sensíveis
O logger DEVE (MUST) ofuscar valores de campos sensíveis (ex.: `password`, `token`,
`authorization`, `secret`) antes de serializar a entrada de log.

#### Scenario: Campo sensível é ofuscado
- **WHEN** um log inclui um campo sensível como `password` ou `token`
- **THEN** o valor é substituído por um marcador de redaction e o valor original não aparece no log
