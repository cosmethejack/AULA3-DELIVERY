# Autenticação de Cliente (registro + login + vínculo Clerk)

## Resumo

Habilitar que o cliente da vitrine **crie conta** e **faça login** usando o fluxo BFF
já existente (Frontend → Backend → Clerk), com **formulários próprios** (sem SDK Clerk).
Cada `Customer` passa a ser vinculado ao usuário do Clerk via `clerkUserId`,
estabelecendo a base de identidade para o checkout autenticado e o histórico de pedidos.

Resolve a contradição atual: a spec/arquitetura exige cliente autenticado, mas a
vitrine opera de forma anônima (guest). Esta mudança é o **alicerce** do Caminho B.

## Risco

**Médio** — toca autenticação, schema (migration Prisma) e integração com a Clerk Backend API.

## Contexto Técnico (reuso)

O fluxo BFF de login **já existe** em `apps/backend/src/modules/auth/` e é reaproveitado:
`findUserByEmail → verifyPassword → createSession → mintToken(JWT)`, validado pelo `ClerkGuard` via JWKS.
Falta apenas o **registro** e o **vínculo** com o `Customer`.

## Artefatos

### Backend

- `POST /v1/auth/register` — cria usuário no Clerk (Backend API) com `public_metadata.role = CUSTOMER`
  e cria o `Customer` vinculado (`clerkUserId`). Retorna token de sessão (auto-login) ou 201.
- Reuso de `POST /v1/auth/login` (já existente) para clientes.
- Schema Prisma: `Customer.clerkUserId String? @unique` + migration versionada.
- `AuthService.register(...)`: `createClerkUser` + define role + cria `Customer`.

### Frontend (formulários próprios — proibido SDK Clerk)

- Tela de **cadastro** (sign-up): nome, e-mail, senha, endereço, telefone.
- Ajuste da tela de **login** para clientes (hoje só admin); roteamento pós-login por role.
- `services/api.ts`: gestão unificada do token de sessão (cliente + admin) via `Authorization: Bearer`.

## Regras de Negócio

- Todo cliente corresponde a um usuário autenticado (architecture.md).
- Role `CUSTOMER` atribuída no provedor de identidade (Clerk `public_metadata.role`).
- E-mail único por cliente (`Customer.email` já é `@unique`).
- Senha apenas repassada ao Clerk — nunca persistida no backend.
- Proibido SDKs/componentes oficiais do Clerk no frontend.

## Dependências

Nenhuma (reusa o `AuthModule` existente). **Pré-requisito** de `authenticated-checkout` e `order-history`.

## Fora de Escopo

- Recuperação de senha e MFA (delegados ao Clerk / versões futuras).
- Edição de perfil do cliente.
- Proteção dos endpoints de pedido (tratada em `authenticated-checkout`).

## Tarefas Principais

1. Migration Prisma: `Customer.clerkUserId` (unique, nullable).
2. `AuthService.register`: criar usuário Clerk + metadata role + `Customer` vinculado.
3. `AuthController`: `POST /auth/register` com DTO validado (`class-validator`).
4. Frontend: tela de sign-up (form próprio) + ajuste do sign-in para clientes.
5. `api.ts`: token de sessão unificado.
6. Testes (Happy/Sad/Edge): registro, e-mail duplicado (409), senha inválida, login com role CUSTOMER.
