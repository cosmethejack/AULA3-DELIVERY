# Fundação de Identidade & RBAC — Clerk BFF (#05)

## Resumo

Integrar o backend como **BFF** ao Clerk: validação de tokens via JWKS (`ClerkGuard`),
`@Roles` decorator + `RolesGuard` para RBAC (ADMIN/CUSTOMER) e o endpoint de **login**
(`Frontend → Backend → Clerk`). Toda decisão de autorização reside no backend. Atende
RNF-01 e a seção de Segurança da arquitetura.

## Dimensionamento

- **Tamanho:** Médio — guard, decorator e fluxo de login.
- **Complexidade:** Média — validação JWKS e mapeamento de roles.
- **Risco:** Médio — superfície de segurança/autenticação.

## Escopo Funcional

### Backend
- `ClerkGuard`: valida JWT do Clerk via JWKS; popula `req.user` (`sub`, `role`, `email`).
- `@Roles(...)` + `RolesGuard`: autorização por papel; roles lidas do provedor de identidade.
- `POST /v1/auth/login` (BFF): `findUserByEmail → verifyPassword → createSession → mintToken`.
- `@Public()` decorator para liberar rotas (ex.: catálogo) explicitamente.
- Convenção: endpoints protegidos exigem autenticação por padrão.

## Dependências

- #02 backend-core-platform, #04 database-schema-foundation.

## Riscos

- Falha de validação de token (chave/JWKS) abrindo acesso indevido. Mitigação: testes de token inválido/expirado.
- Bypass de RBAC. Mitigação: testes de matriz papel × rota.

## Qualidade & Testes

### Linter
- `npm run lint` (backend) verde.

### Testes Unitários
- `ClerkGuard`: aceita token válido; rejeita ausente/expirado/assinatura inválida (sad/edge).
- `RolesGuard`: permite papel autorizado; nega papel insuficiente.

### Testes de Integração
- Supertest: rota protegida sem token → 401 (RFC 9457); com token de papel errado → 403; com papel correto → 200.
- `POST /v1/auth/login`: credenciais válidas retornam token; inválidas → 401.

### Testes E2E
- Não se aplica nesta mudança (UI de login entra em #13).

## Definição de Pronto

- Guards aplicáveis a qualquer módulo; login funcional via BFF.
- Lint + unit + integração verdes; cobertura backend ≥ 80%.

## Fora de Escopo

- Registro de cliente e telas próprias (entram em #13). SDKs/componentes oficiais do Clerk são **proibidos**.
