## Context

A plataforma core (#02), a fundação de dados (#04) e a identidade/RBAC (#05) já existem.
Esta mudança adiciona a capability de **auditoria** (RNF-02): toda operação de Create/Update/
Delete em entidades críticas gera uma trilha com `usuário`, `objeto`, `ação`, `payload` e
`timestamp`, de forma reutilizável pelos módulos de negócio.

O repositório já implementa parte da fundação em `apps/backend/src/core/audit`:

- `AuditInterceptor` (global, `APP_INTERCEPTOR`): dispara para métodos CUD
  (`POST`/`PATCH`/`PUT`/`DELETE`) e ignora leituras (`GET`), montando o registro a partir da
  requisição e da resposta.
- `AuditService.log(...)`: persiste o registro em `AuditLog` via Prisma.
- Tabela `AuditLog` (migration `add_audit_log`): `userId`, `acao`, `entidade`, `entidadeId`,
  `payload` (Json), `createdAt`, com índices.

## Goals / Non-Goals

**Goals:**
- Trilha de auditoria para toda mutação CUD, ignorando leituras.
- Registro com campos obrigatórios: usuário, ação, objeto (entidade), `entidadeId`, payload e
  timestamp.
- Resolução do usuário a partir de `req.user` (integra com #05).
- Redaction de campos sensíveis no `payload` antes de persistir.
- Serviço/interceptor reutilizáveis pelos módulos de negócio.

**Non-Goals:**
- Tela/endpoint de consulta de auditoria (fora do MVP).
- Auditoria de leituras (`GET`) — apenas mutações.
- Versionamento/diff de estado anterior vs. novo (apenas o payload da requisição).

## Decisions

**Interceptor global sobre CUD (em vez de `@Audited()` opt-in).** A implementação usa um único
`AuditInterceptor` global que audita todas as rotas CUD automaticamente, sem exigir decorator
por handler. Vantagem: cobertura por padrão, sem risco de esquecer de anotar uma mutação
crítica. Trade-off: audita também mutações não essenciais; aceitável no MVP e mais seguro que
o modelo opt-in.

**`AuditService.log(...)` como ponto único de persistência.** O interceptor delega a
persistência ao serviço, que grava em `AuditLog` via Prisma. Centraliza a escrita e permite
reuso direto por serviços de domínio quando a trilha precisa de contexto que o interceptor não
tem.

**Usuário resolvido de `req.user.sub`.** O `ClerkGuard` (#05) popula `req.user`; o interceptor
lê `req.user?.sub` como autor da ação. Quando não há usuário autenticado (rota pública), o
campo fica nulo, sem quebrar a trilha.

**Redaction de campos sensíveis no payload.** Antes de persistir, o `payload` passa por uma
redaction que ofusca chaves sensíveis (ex.: `password`, `token`, `authorization`, `secret`),
evitando gravar credenciais na trilha. Reaproveita a mesma estratégia de redaction da
observabilidade (#03).

## Risks / Trade-offs

- **[Auditoria silenciosamente não gravada]** → Testes verificando persistência por ação
  (Create/Update/Delete) e que leituras não geram registro.
- **[Payload com dado sensível]** → Redaction por lista de chaves aplicada antes de persistir,
  coberta por teste.
- **[Falha na auditoria derrubar a operação de negócio]** → A escrita da trilha ocorre após a
  resposta do handler (`tap`), sem alterar o resultado da operação principal.
- **[Volume de registros de auditoria]** → Índices em `AuditLog` (`entidade,entidadeId` e
  `createdAt`) para consulta eficiente; retenção fica para evolução futura.
