## ADDED Requirements

### Requirement: Registro de Cliente
O sistema DEVE (MUST) permitir que um cliente crie conta via formulário próprio, criando um usuário no
provedor de identidade (Clerk) com role CUSTOMER e um `Customer` vinculado por `clerkUserId`.
É proibido o uso de SDK/componentes oficiais do Clerk no frontend.

#### Scenario: Registro bem-sucedido
- **WHEN** o cliente envia POST /v1/auth/register com nome, e-mail e senha válidos
- **THEN** um usuário é criado no Clerk com role CUSTOMER, um Customer vinculado é persistido e um token de sessão é retornado

#### Scenario: E-mail já cadastrado
- **WHEN** o cliente envia POST /v1/auth/register com e-mail já existente
- **THEN** o sistema retorna 409 Conflict (RFC 9457) e nenhum registro é criado

#### Scenario: Senha inválida
- **WHEN** o cliente envia POST /v1/auth/register com senha que não atende à política
- **THEN** o sistema retorna 422 Unprocessable Entity (RFC 9457)

### Requirement: Login de Cliente
O sistema DEVE (MUST) autenticar clientes pelo fluxo BFF (Frontend → Backend → Clerk), emitindo um JWT
de sessão validado pelo ClerkGuard via JWKS.

#### Scenario: Login válido
- **WHEN** o cliente envia POST /v1/auth/login com credenciais corretas
- **THEN** o sistema retorna um token de sessão JWT

#### Scenario: Credenciais inválidas
- **WHEN** o cliente envia POST /v1/auth/login com senha incorreta
- **THEN** o sistema retorna 401 Unauthorized
