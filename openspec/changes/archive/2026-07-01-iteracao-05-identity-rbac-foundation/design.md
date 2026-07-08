## Context

A plataforma core (#02) e a fundação de dados (#04) já existem. Esta mudança integra o
backend como **BFF** ao Clerk para identidade e autorização, mantendo a regra do projeto:
toda decisão de autorização é exclusiva do backend e é PROIBIDO usar SDKs/componentes oficiais
do Clerk no frontend.

O repositório já implementa a fundação em `apps/backend/src/core/auth` e
`apps/backend/src/modules/auth`:

- `ClerkGuard` (global, `APP_GUARD`): valida o JWT do Clerk via JWKS (`jose`), popula
  `req.user` e aplica RBAC a partir de `@Roles(...)`.
- `@Roles(...)` (`roles.decorator.ts`): metadata que marca a rota como protegida e define os
  papéis permitidos.
- `AuthController` + `AuthService`: `POST /v1/auth/login` (BFF) usando a API backend do Clerk.

## Goals / Non-Goals

**Goals:**
- Validação de tokens Clerk via JWKS no `ClerkGuard`, populando `req.user` (`sub`, `role`, `email`).
- RBAC por papel (ADMIN/CUSTOMER) via `@Roles(...)`, com a role lida do token/metadata do Clerk.
- Login BFF `POST /v1/auth/login`: `findUserByEmail → verifyPassword → createSession → mintToken`.
- Respostas de erro de auth (401/403) no formato RFC 9457, via o filtro global existente.

**Non-Goals:**
- Registro de cliente e telas próprias de login/cadastro (entram em #13).
- SDKs/componentes oficiais do Clerk (proibidos, inclusive no frontend).
- Gestão de sessão no frontend; refresh tokens e rotação (fora do MVP desta fundação).

## Decisions

**Guard único combinando autenticação e autorização.** Em vez de um `ClerkGuard` (authn) e
um `RolesGuard` (authz) separados, a implementação usa **um único `ClerkGuard`** global que
valida o token e aplica o RBAC. Simplifica o pipeline e mantém uma única fonte de decisão de
acesso. Alternativa (dois guards) foi descartada por adicionar indireção sem ganho no MVP.

**Proteção opt-in via `@Roles(...)` (público por padrão).** O `ClerkGuard` libera a rota
quando não há `@Roles`; quando há, exige token válido e papel compatível. Assim, rotas
públicas (ex.: catálogo, `POST /v1/auth/login`) não precisam de decorator, e proteger uma rota
é explícito: basta anotar `@Roles(ADMIN)` / `@Roles(CUSTOMER)`. Não há `@Public()` — a ausência
de `@Roles` já significa público. Trade-off: exige disciplina para não esquecer de proteger
rotas sensíveis; mitigado por testes de matriz papel × rota.

**Validação JWKS com `jose`.** O token é verificado contra as chaves públicas remotas do Clerk
(`createRemoteJWKSet` + `jwtVerify`) com checagem de `issuer`. Sem SDK do Clerk; apenas a
verificação padrão de JWT/JWKS. Token ausente → 401; assinatura/emissor inválidos → 401;
papel insuficiente → 403.

**Login BFF via API backend do Clerk.** `AuthService.login` orquestra
`findUserByEmail → verifyPassword → createSession → mintToken` chamando a API `api.clerk.com`
com `CLERK_SECRET_KEY` no backend. O frontend nunca fala com o Clerk diretamente. Credenciais
inválidas resultam em 401; falhas de infraestrutura do Clerk em 500.

## Risks / Trade-offs

- **[Falha de validação de token abre acesso indevido]** → Verificação JWKS + issuer; testes de
  token ausente, inválido e expirado retornando 401.
- **[Bypass de RBAC]** → Testes de matriz papel × rota (papel correto → 200; papel errado → 403;
  sem token → 401).
- **[Esquecer de proteger rota sensível (modelo opt-in)]** → Convenção documentada + testes por
  módulo garantindo `@Roles` nas rotas protegidas.
- **[Vazamento de `CLERK_SECRET_KEY`]** → Segredo apenas no backend; nunca exposto ao frontend;
  ausência derruba o login com erro claro.
