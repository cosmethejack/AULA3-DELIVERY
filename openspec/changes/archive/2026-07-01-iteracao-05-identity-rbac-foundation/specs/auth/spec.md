## ADDED Requirements

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

### Requirement: Respostas de erro de autenticação e autorização
As falhas de autenticação e autorização DEVEM (MUST) seguir o formato RFC 9457: token ausente
ou inválido resulta em `401`; papel insuficiente resulta em `403`.

#### Scenario: Token ausente em rota protegida
- **WHEN** uma rota com `@Roles` é acessada sem cabeçalho `Authorization`
- **THEN** o backend responde `401` no formato RFC 9457

#### Scenario: Token inválido ou expirado
- **WHEN** uma rota com `@Roles` é acessada com token inválido, expirado ou de emissor incorreto
- **THEN** o backend responde `401` no formato RFC 9457

#### Scenario: Papel insuficiente
- **WHEN** uma rota `@Roles(ADMIN)` é acessada por um token de papel `CUSTOMER`
- **THEN** o backend responde `403` no formato RFC 9457
