## 1. ClerkGuard (autenticação + RBAC)

- [x] 1.1 Implementar `ClerkGuard` validando JWT do Clerk via JWKS (`jose`) com checagem de `issuer`
- [x] 1.2 Popular `req.user` (`sub`, `role`, `email`) a partir do token
- [x] 1.3 Aplicar RBAC via `@Roles(...)`: liberar rotas sem `@Roles`; exigir papel compatível quando presente
- [x] 1.4 Registrar o `ClerkGuard` globalmente (`APP_GUARD`)

## 2. Decorator de papéis

- [x] 2.1 Implementar `@Roles(...)` (`roles.decorator.ts`) com `ROLES_KEY`

## 3. Login BFF

- [x] 3.1 Implementar `AuthService.login`: `findUserByEmail → verifyPassword → createSession → mintToken`
- [x] 3.2 Expor `POST /v1/auth/login` (`AuthController`) com `LoginDto` validado (`class-validator`)
- [x] 3.3 Retornar `401` em credenciais inválidas; nunca expor `CLERK_SECRET_KEY` ao frontend

## 4. Testes

- [x] 4.1 Unit `ClerkGuard`: token válido aceita; ausente/expirado/assinatura inválida → 401 (sad/edge)
- [x] 4.2 Unit RBAC: papel autorizado permite; papel insuficiente → 403
- [x] 4.3 Unit/integração `auth.service`/`auth.controller`: login válido retorna token; inválido → 401
- [x] 4.4 Integração (Supertest): rota protegida sem token → 401 RFC 9457; papel errado → 403; papel correto → 200
- [x] 4.5 Rodar `npm run lint` + testes do backend e confirmar cobertura ≥ 80%
