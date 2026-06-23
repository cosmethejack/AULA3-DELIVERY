## Purpose

Autenticação e autorização do backend: validação de tokens JWT contra Clerk via guard, com RBAC por decorator `@Roles()`.

## Requirements

### Requirement: ClerkGuard com validação JWKS
O backend DEVE validar tokens JWT contra as chaves públicas JWKS do Clerk. O guard DEVE ser aplicável a controllers ou métodos via decorator.

#### Scenario: Token válido
- **WHEN** requisição inclui Authorization: Bearer <token-válido>
- **THEN** ClerkGuard valida o token e permite acesso ao recurso

#### Scenario: Token ausente
- **WHEN** requisição não inclui token
- **THEN** sistema retorna 401 Unauthorized

### Requirement: RBAC com @Roles(ADMIN)
O sistema DEVE expor decorator `@Roles()` que restringe acesso baseado na role do usuário no Clerk.

#### Scenario: Admin acessa recurso protegido
- **WHEN** usuário com role ADMIN acessa endpoint com @Roles(ADMIN)
- **THEN** acesso é permitido

#### Scenario: Customer acessa recurso de admin
- **WHEN** usuário com role CUSTOMER acessa endpoint @Roles(ADMIN)
- **THEN** sistema retorna 403 Forbidden
