# Fundação de Auditoria — Trilha de CUD (#06)

## Resumo

Criar a capability de **auditoria**: toda operação de Create, Update ou Delete em entidades
críticas gera um registro com `usuário`, `objeto`, `ação`, `payload` e `timestamp`. Exposta
como interceptor/serviço reutilizável pelos módulos de negócio. Atende RNF-02.

## Dimensionamento

- **Tamanho:** Pequeno — um módulo transversal focado.
- **Complexidade:** Média — captura de contexto (usuário) e payload de forma genérica.
- **Risco:** Baixo — adiciona trilha; não altera fluxo de negócio.

## Escopo Funcional

### Backend
- Entidade/tabela `AuditLog` (migration Prisma) com os campos obrigatórios.
- `AuditService.record(...)` e `@Audited()` interceptor para CUD em entidades críticas.
- Resolução do usuário a partir de `req.user` (integra com #05).
- Redaction de campos sensíveis no `payload`.

## Dependências

- #02 backend-core-platform, #04 database-schema-foundation (usuário vem de #05 quando disponível).

## Riscos

- Auditoria silenciosamente não gravada. Mitigação: testes verificando persistência por ação.
- Payload com dado sensível. Mitigação: redaction + teste.

## Qualidade & Testes

### Linter
- `npm run lint` (backend) verde.

### Testes Unitários
- `AuditService.record` monta registro com todos os campos obrigatórios; redaction aplicada.
- Interceptor dispara em Create/Update/Delete e ignora leituras.

### Testes de Integração
- Supertest + Postgres de teste: uma mutação em entidade crítica gera linha em `AuditLog` com `usuário/ação/objeto`.

### Testes E2E
- Não se aplica.

## Definição de Pronto

- Mutações críticas geram trilha completa e auditável.
- Lint + unit + integração verdes; cobertura backend ≥ 80%.

## Fora de Escopo

- Tela de consulta de auditoria (não prevista no MVP).
