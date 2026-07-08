# Plataforma Core do Backend — NestJS, RFC 9457, Swagger (#02)

## Resumo

Inicializar a aplicação NestJS 11+ com fundamentos transversais: filtro global de erros no
formato **RFC 9457 (Problem Details)**, validação por DTO (`class-validator`), documentação
Swagger/OpenAPI, versionamento de rota `/v1`, `ConfigModule` (lendo o `.env` da raiz) e
endpoint de `health`. Define o esqueleto onde os módulos de negócio serão plugados.

## Dimensionamento

- **Tamanho:** Médio — bootstrap + transversais, porém sem regra de negócio.
- **Complexidade:** Média — filtro de exceções e padronização exigem cuidado.
- **Risco:** Baixo — fundação isolada, sem dados sensíveis.

## Escopo Funcional

### Backend
- `main.ts`: prefixo global `/v1`, `ValidationPipe` global, CORS placeholder, Swagger em `/docs`.
- `ProblemDetailsFilter` global emitindo `{ type, title, status, detail, instance }` (RFC 9457).
- `ConfigModule` global lendo `.env` da raiz; validação de variáveis obrigatórias na inicialização.
- `GET /v1/health` (liveness/readiness).
- Convenções: DTOs com `class-validator`, decorators Swagger.

## Dependências

- #01 project-foundation.

## Riscos

- Formato de erro inconsistente entre rotas. Mitigação: filtro global único + teste de contrato.

## Qualidade & Testes

### Linter
- `npm run lint` (backend) verde.

### Testes Unitários
- `ProblemDetailsFilter`: mapeia exceções HTTP e genéricas para o envelope RFC 9457 (happy/sad/edge).
- Validação de config: falha de boot quando variável obrigatória ausente.

### Testes de Integração
- Supertest: `GET /v1/health` → 200; rota inexistente → 404 no formato RFC 9457; payload inválido → 400 RFC 9457.

### Testes E2E
- Não se aplica (sem frontend nesta mudança).

## Definição de Pronto

- App sobe; `/docs` acessível; `/v1/health` responde 200.
- Lint + unit + integração verdes; cobertura backend ≥ 80%.

## Fora de Escopo

- Autenticação, persistência e módulos de negócio.
