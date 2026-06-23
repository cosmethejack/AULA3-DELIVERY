## ADDED Requirements

### Requirement: Sincronização de Usuários via Webhook
O sistema DEVE expor webhook para sincronizar usuários do Clerk com a tabela local de usuários.

#### Scenario: Usuário criado no Clerk
- **WHEN** Clerk envia webhook user.created
- **THEN** sistema cria registro local do usuário com externalId, email e role

#### Scenario: Usuário atualizado no Clerk
- **WHEN** Clerk envia webhook user.updated
- **THEN** sistema atualiza registro local do usuário

## MODIFIED Requirements

### Requirement: ClerkGuard com validação JWKS

#### Scenario: Token válido
- **WHEN** requisição inclui Authorization: Bearer <token-válido>
- **THEN** ClerkGuard valida o token contra JWKS do Clerk e permite acesso ao recurso

#### Scenario: Token ausente
- **WHEN** requisição não inclui token
- **THEN** sistema retorna 401 Unauthorized

#### Scenario: Token expirado
- **WHEN** requisição inclui token JWT expirado
- **THEN** sistema retorna 401 Unauthorized

### Requirement: RBAC com @Roles(ADMIN, CUSTOMER)
O sistema DEVE expor decorator `@Roles()` que aceita ADMIN e/ou CUSTOMER, restringindo acesso baseado na role do usuário extraída do token Clerk.

#### Scenario: Admin acessa recurso protegido
- **WHEN** usuário com role ADMIN acessa endpoint com @Roles(ADMIN)
- **THEN** acesso é permitido

#### Scenario: Customer acessa recurso de admin
- **WHEN** usuário com role CUSTOMER acessa endpoint @Roles(ADMIN)
- **THEN** sistema retorna 403 Forbidden

#### Scenario: Usuário sem role acessa recurso protegido
- **WHEN** usuário sem role conhecida acessa endpoint @Roles(ADMIN)
- **THEN** sistema retorna 403 Forbidden
