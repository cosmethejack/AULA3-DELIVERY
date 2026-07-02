## 1. Tracing OpenTelemetry

- [x] 1.1 Confirmar/ajustar o `otel.ts` (NodeSDK + auto-instrumentações + exporters OTLP)
- [x] 1.2 Garantir export configurável por variáveis de ambiente OTel padrão

## 2. Logger estruturado

- [x] 2.1 Adicionar os campos mínimos `trace_id` e `user_id` ao `AppLogger`
- [x] 2.2 Derivar `trace_id`/`span_id` do span OpenTelemetry ativo (correlação)
- [x] 2.3 Emitir `trace_id` vazio quando não houver span ativo (sem quebrar o log)
- [x] 2.4 Implementar redaction de campos sensíveis (`password`, `token`, `authorization`, `secret`)

## 3. Propagação de request_id

- [x] 3.1 Criar interceptor que gera `request_id` quando ausente e reutiliza o do header
- [x] 3.2 Ecoar o `request_id` no header da resposta e disponibilizá-lo para os logs
- [x] 3.3 Registrar o interceptor globalmente

## 4. Regra de lint no-console

- [x] 4.1 Ativar a regra ESLint `no-console` no backend
- [x] 4.2 Adicionar exceção localizada apenas na implementação do `AppLogger`

## 5. Testes

- [x] 5.1 Unit: logger inclui os campos mínimos obrigatórios
- [x] 5.2 Unit: redaction de campo sensível funciona
- [x] 5.3 Unit: `request_id` é gerado quando ausente e reutilizado quando presente
- [x] 5.4 Integração (Supertest): resposta expõe/propaga `request_id`; log contém `trace_id` correlacionado
- [x] 5.5 Rodar `npm run lint` + testes do backend e confirmar cobertura ≥ 80%
