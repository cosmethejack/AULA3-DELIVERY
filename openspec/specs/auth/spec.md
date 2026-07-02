## Purpose

Autenticação e autorização do backend: validação de tokens JWT contra Clerk via guard, com RBAC por decorator `@Roles()`.

## Requirements

### Requirement: ClerkGuard com validação JWKS
O backend DEVE (MUST) validar tokens JWT contra as chaves públicas JWKS do Clerk. O guard DEVE ser aplicável a controllers ou métodos via decorator.

#### Scenario: Token válido
- **WHEN** requisição inclui Authorization: Bearer <token-válido>
- **THEN** ClerkGuard valida o token e permite acesso ao recurso

#### Scenario: Token ausente
- **WHEN** requisição não inclui token
- **THEN** sistema retorna 401 Unauthorized

#### Scenario: Token inválido ou expirado
- **WHEN** uma rota protegida é acessada com token inválido, expirado ou de emissor incorreto
- **THEN** sistema retorna 401 no formato RFC 9457

### Requirement: RBAC com @Roles(ADMIN)
O sistema DEVE (MUST) expor decorator `@Roles()` que restringe acesso baseado na role do usuário no Clerk.

#### Scenario: Admin acessa recurso protegido
- **WHEN** usuário com role ADMIN acessa endpoint com @Roles(ADMIN)
- **THEN** acesso é permitido

#### Scenario: Customer acessa recurso de admin
- **WHEN** usuário com role CUSTOMER acessa endpoint @Roles(ADMIN)
- **THEN** sistema retorna 403 Forbidden

### Requirement: Login BFF via Clerk
O backend DEVE (MUST) expor `POST /v1/auth/login` que autentica via API backend do Clerk
seguindo o fluxo `findUserByEmail → verifyPassword → createSession → mintToken`, retornando
um token de sessão. É PROIBIDO (MUST NOT) usar SDKs/componentes oficiais do Clerk no frontend;
o frontend NÃO DEVE (MUST NOT) falar diretamente com o Clerk.

#### Scenario: Login com credenciais válidas
- **WHEN** `POST /v1/auth/login` recebe e-mail e senha válidos
- **THEN** o backend retorna um token de sessão emitido pelo Clerk

#### Scenario: Login com credenciais inválidas
- **WHEN** `POST /v1/auth/login` recebe e-mail inexistente ou senha incorreta
- **THEN** o backend responde `401` no formato RFC 9457

### Requirement: Proteção opt-in por papel
O `ClerkGuard` global DEVE (MUST) liberar rotas sem `@Roles` (públicas por padrão) e DEVE
(MUST) exigir token válido e papel compatível nas rotas anotadas com `@Roles(...)`. Ao
autenticar, o guard DEVE (MUST) popular `req.user` com os dados do token (`sub`, `role`, `email`).

#### Scenario: Rota pública sem @Roles
- **WHEN** uma rota sem `@Roles` é acessada sem token
- **THEN** o acesso é liberado

#### Scenario: Rota protegida popula req.user
- **WHEN** uma rota com `@Roles` é acessada com token válido do papel permitido
- **THEN** o acesso é liberado e `req.user` contém os dados do token
