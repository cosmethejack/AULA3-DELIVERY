## 1. Bootstrap NestJS

- [x] 1.1 Inicializar o app NestJS em `apps/backend/src` (`AppModule`, `main.ts`)
- [x] 1.2 Configurar prefixo global `/v1` via `setGlobalPrefix`
- [x] 1.3 Registrar `ValidationPipe` global com `whitelist` e `forbidNonWhitelisted`
- [x] 1.4 Adicionar placeholder de CORS no bootstrap

## 2. Filtro de erros RFC 9457

- [x] 2.1 Implementar `ProblemDetailsFilter` emitindo `{ type, title, status, detail, instance }`
- [x] 2.2 Registrar o filtro globalmente no bootstrap
- [x] 2.3 Garantir que erros genéricos viram `500` sem vazar stack trace

## 3. Configuração global

- [x] 3.1 Registrar `ConfigModule` global lendo o `.env` da raiz
- [x] 3.2 Definir schema de validação das variáveis obrigatórias (fail-fast no boot)

## 4. Documentação e health

- [x] 4.1 Configurar Swagger/OpenAPI servido em `/docs`
- [x] 4.2 Implementar `GET /v1/health` (liveness/readiness) com decorators Swagger

## 5. Testes

- [x] 5.1 Testes unitários do `ProblemDetailsFilter` (HTTP, genérico, edge) → envelope RFC 9457
- [x] 5.2 Teste unitário da validação de config (boot falha sem variável obrigatória)
- [x] 5.3 Integração (Supertest): `GET /v1/health` → 200
- [x] 5.4 Integração (Supertest): rota inexistente → 404 RFC 9457; payload inválido → 400 RFC 9457
- [x] 5.5 Rodar `npm run lint` + testes do backend e confirmar cobertura ≥ 80%
