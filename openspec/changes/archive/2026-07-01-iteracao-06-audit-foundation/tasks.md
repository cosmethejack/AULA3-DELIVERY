## 1. Tabela AuditLog

- [x] 1.1 Confirmar entidade/tabela `AuditLog` (migration `add_audit_log`) com campos obrigatórios e índices

## 2. AuditService

- [x] 2.1 Implementar `AuditService.log(...)` persistindo em `AuditLog` via Prisma
- [x] 2.2 Aplicar redaction de campos sensíveis no `payload` antes de persistir
- [x] 2.3 Registrar `AuditModule` exportando o `AuditService`

## 3. AuditInterceptor

- [x] 3.1 Implementar `AuditInterceptor` disparando em CUD (`POST`/`PATCH`/`PUT`/`DELETE`) e ignorando `GET`
- [x] 3.2 Resolver usuário auditor de `req.user?.sub` (nulo quando ausente)
- [x] 3.3 Montar `acao`, `entidade`, `entidadeId` e `payload` a partir da requisição/resposta
- [x] 3.4 Registrar o interceptor globalmente (`APP_INTERCEPTOR`)

## 4. Testes

- [x] 4.1 Unit `AuditService`: monta registro com todos os campos obrigatórios; redaction aplicada
- [x] 4.2 Unit `AuditInterceptor`: dispara em Create/Update/Delete e ignora leituras (`GET`)
- [x] 4.3 Integração (interceptor → service, Prisma mockado): mutação persiste linha com usuário/ação/objeto
- [x] 4.4 Rodar `npm run lint` + testes do backend e confirmar cobertura ≥ 80%
