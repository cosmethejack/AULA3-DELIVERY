## Context

A vitrine opera de forma anônima, mas `spec.md` (RF-02) e `architecture.md` exigem cliente
autenticado ("todo cliente corresponde a um usuário autenticado"). O fluxo BFF de login
(Frontend → Backend → Clerk) **já existe** em `apps/backend/src/modules/auth/`
(`AuthService`: `findUserByEmail` → `verifyPassword` → `createSession` → `mintToken`), e o
`ClerkGuard` valida o JWT via JWKS. Falta o **registro** de cliente e o **vínculo**
`Customer ↔ usuário Clerk`.

## Goals / Non-Goals

**Goals:**
- `POST /v1/auth/register`: cria usuário Clerk (role CUSTOMER) + `Customer` vinculado (`clerkUserId`)
- Reuso de `POST /v1/auth/login` para clientes
- `Customer.clerkUserId` (único, nullable) + migration Prisma
- Telas próprias de sign-up/sign-in (sem SDK/componentes Clerk)
- Token de sessão unificado no frontend (`api.ts`)
- Cobertura ≥ 80% backend / 70% frontend

**Non-Goals:**
- Recuperação de senha e MFA (delegados ao Clerk / versões futuras)
- Edição de perfil do cliente
- Proteção dos endpoints de pedido (tratada em `authenticated-checkout`)

## Decisions

| Decisão | Alternativa | Rationale |
|---------|-------------|-----------|
| Vínculo via `clerkUserId` | Casar por e-mail | Robusto e estável; habilita ownership/IDOR direto |
| Registro via Clerk Backend API | SDK Clerk no frontend | Regra de arquitetura: proibido SDK/componentes Clerk no frontend |
| Role em `public_metadata.role` (Clerk) | Tabela de roles local | Clerk é a fonte de identidade; `ClerkGuard` já lê esse claim |
| `clerkUserId` nullable | Not null | Clientes guest legados já existem; backfill posterior |

## Risks / Trade-offs

- [Clerk API] Indisponibilidade no registro → tratar erros com RFC 9457; não criar `Customer` órfão (transação).
- [Clientes legados] Criados como guest sem `clerkUserId` → coluna nullable + backfill opcional por e-mail.
- [Senha] Trafega ao backend → repassada diretamente ao Clerk, nunca persistida nem logada.
