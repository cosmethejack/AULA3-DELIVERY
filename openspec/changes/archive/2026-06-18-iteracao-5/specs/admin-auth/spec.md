## ADDED Requirements

### Requirement: Login com Formulário Próprio
A página `/sign-in` DEVE exibir formulário de e-mail/senha que envia credenciais ao backend (BFF), que autentica via Clerk. Proibido uso de SDK/componentes oficiais do Clerk.

#### Scenario: Login bem-sucedido
- **WHEN** usuário informa e-mail e senha válidos
- **THEN** backend retorna JWT e frontend redireciona para /dashboard

#### Scenario: Credenciais inválidas
- **WHEN** usuário informa e-mail ou senha incorretos
- **THEN** formulário exibe mensagem "Credenciais inválidas"

### Requirement: AuthContext com Token JWT
O frontend DEVE gerenciar o token JWT em memória via `AuthContext`. Requisições autenticadas usam `apiClient.ts` que injeta o token no header.

#### Scenario: Token expirado
- **WHEN** token JWT expira durante a sessão
- **THEN** apiClient intercepta 401 e redireciona para /sign-in
