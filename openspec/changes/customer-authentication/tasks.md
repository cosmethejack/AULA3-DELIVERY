## 1. Schema & Migration

- [ ] 1.1 Adicionar `Customer.clerkUserId String? @unique` ao schema Prisma
- [ ] 1.2 Gerar migration Prisma versionada

## 2. Backend — Registro

- [ ] 2.1 `AuthService.register`: criar usuário no Clerk (Backend API) com `public_metadata.role=CUSTOMER`
- [ ] 2.2 Criar `Customer` vinculado (`clerkUserId`) de forma atômica
- [ ] 2.3 `AuthController` `POST /auth/register` com DTO validado (`class-validator`)
- [ ] 2.4 Tratar e-mail duplicado (409) e senha inválida (422) em formato RFC 9457
- [ ] 2.5 Auto-login: retornar token de sessão (reuso do `mintToken`)

## 3. Frontend — Telas próprias (sem SDK Clerk)

- [ ] 3.1 Tela de cadastro (form próprio: nome, e-mail, senha, endereço, telefone)
- [ ] 3.2 Ajustar sign-in para clientes + roteamento pós-login por role
- [ ] 3.3 `api.ts`: token de sessão unificado (cliente/admin)

## 4. Testes

- [ ] 4.1 Unit: `AuthService.register` (happy/sad/edge)
- [ ] 4.2 Integração: `POST /auth/register` (201, 409 e-mail duplicado, 422 senha)
- [ ] 4.3 `ClerkGuard` com role CUSTOMER
- [ ] 4.4 Verificar cobertura ≥ 80% backend / 70% frontend
