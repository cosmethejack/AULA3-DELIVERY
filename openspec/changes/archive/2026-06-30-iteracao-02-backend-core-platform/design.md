## Context

A fundação do monorepo (#01) já entrega o app `apps/backend` com TypeScript, ESLint e Jest,
mas sem a aplicação NestJS de fato inicializada. Esta mudança estabelece a **plataforma core
do backend**: o bootstrap NestJS 11+ e os fundamentos transversais sobre os quais todos os
módulos de negócio (catálogo, clientes, pedidos, pagamentos) serão plugados.

Os fundamentos são fixados pelas convenções do projeto: versionamento de rota via URI (`/v1`),
erros no formato **RFC 9457 (Problem Details)**, validação por DTO com `class-validator`,
documentação OpenAPI/Swagger, `ConfigModule` global lendo o `.env` único da raiz, e um endpoint
de `health`. Não há regra de negócio, persistência nem autenticação nesta mudança.

## Goals / Non-Goals

**Goals:**
- Bootstrap NestJS em `apps/backend/src/main.ts` com prefixo global `/v1`, `ValidationPipe`
  global e Swagger servido em `/docs`.
- `ProblemDetailsFilter` global emitindo o envelope RFC 9457
  (`{ type, title, status, detail, instance }`) para exceções HTTP e genéricas.
- `ConfigModule` global lendo o `.env` da raiz, com validação das variáveis obrigatórias
  na inicialização (falha rápida no boot).
- `GET /v1/health` (liveness/readiness).
- Convenções de DTO (`class-validator`) e decorators Swagger documentadas e exemplificadas.

**Non-Goals:**
- Autenticação/autorização (Clerk, Guards, RBAC) — iterações posteriores.
- Persistência/Prisma e qualquer módulo de negócio.
- Observabilidade (OpenTelemetry/Grafana) — iteração 03.
- CORS com whitelist real e rate limiting — apenas placeholder aqui.

## Decisions

**Filtro global único de exceções (`ProblemDetailsFilter`).** Um único filtro registrado
globalmente converte tanto `HttpException` quanto erros não tratados no envelope RFC 9457.
Centralizar em um só ponto garante consistência de contrato entre todas as rotas — a
alternativa (tratar por controller) fragmentaria o formato e é justamente o risco citado
na proposta. `type` usa uma URI de referência do problema; `instance` reflete o path da
requisição; `status`/`title` derivam do status HTTP; `detail` traz a mensagem.

**Versionamento por URI (`/v1`) via `setGlobalPrefix`.** Alinhado à convenção do projeto
(versionamento na URI). Aplicado globalmente no bootstrap, com `health` e demais rotas sob
`/v1`. Preferido ao versionamento por header por ser explícito e cacheável.

**`ValidationPipe` global com `whitelist` + `forbidNonWhitelisted`.** Rejeita payloads com
campos desconhecidos e aplica as regras dos DTOs (`class-validator`) automaticamente, sem
repetir validação por handler. Erros de validação passam pelo mesmo filtro e saem em RFC 9457.

**`ConfigModule` global com validação de schema no boot.** O módulo lê o `.env` da raiz e
valida variáveis obrigatórias na inicialização; ausência de variável obrigatória derruba o
boot com mensagem clara (fail-fast), evitando estados parcialmente configurados em runtime.

**Swagger em `/docs` via `@nestjs/swagger`.** Documentação OpenAPI gerada a partir dos
decorators dos DTOs/controllers, servida fora do prefixo de versão (`/docs`) para navegação
direta. Decorar APIs para OpenAPI é convenção obrigatória do projeto.

## Risks / Trade-offs

- **[Formato de erro inconsistente entre rotas]** → Filtro global único (`ProblemDetailsFilter`)
  + teste de contrato (Supertest) validando o envelope RFC 9457 em 404 e 400.
- **[Variável de ambiente obrigatória ausente só falha em runtime tardio]** → Validação de
  schema no `ConfigModule` durante o boot (fail-fast), coberta por teste unitário.
- **[Divergência entre documentação Swagger e comportamento real]** → OpenAPI gerada a partir
  dos próprios decorators dos DTOs/controllers (fonte única), não mantida à mão.
- **[CORS/rate limit como placeholder podem ser esquecidos]** → Marcados explicitamente como
  Non-Goals e endereçados nas iterações de segurança/observabilidade.
