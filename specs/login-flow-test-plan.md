# Plano de Testes — Fluxo de Login (Clerk)

> Gerado seguindo o workflow `playwright-test-planner`. Base de exploração: spec
> [openspec/specs/auth/spec.md](../openspec/specs/auth/spec.md),
> [openspec/specs/admin-auth/spec.md](../openspec/specs/admin-auth/spec.md) e o código real
> ([sign-in/page.tsx](../apps/frontend/src/app/sign-in/page.tsx),
> [(dashboard)/layout.tsx](../apps/frontend/src/app/(dashboard)/layout.tsx),
> [services/api.ts](../apps/frontend/src/services/api.ts)).

## 1. Objetivo e escopo

Validar o fluxo de autenticação do admin, que usa **formulário próprio** (sem SDK/componentes
oficiais do Clerk) cujo BFF (`POST /api/auth/login`) autentica as credenciais contra o Clerk e
retorna um JWT. O escopo cobre:

- UI de login (`/sign-in`): campos, validações, estados e mensagens.
- Persistência do token (`localStorage["admin-token"]`) e redirecionamento.
- Proteção de rotas do dashboard e logout.
- Comportamento de token ausente/expirado (401) e RBAC (403) no backend protegido por `ClerkGuard`.

**Fora de escopo:** cadastro/recuperação de senha, webhooks de sincronização de usuários do Clerk
(`user.created`/`user.updated`) — pertencem a outra suíte.

## 2. Pré-condições e dados de teste

- Frontend em `http://localhost:3000`, backend em `http://localhost:3001` (ver
  [playwright.config.ts](../playwright.config.ts)).
- Testes E2E ficam em `apps/frontend/tests` (Playwright, projeto chromium).

| Perfil            | E-mail                    | Senha           | Observação                          |
|-------------------|---------------------------|-----------------|-------------------------------------|
| Admin válido      | `admin@delivery.test`     | `<válida>`      | role ADMIN no Clerk                 |
| Customer          | `customer@delivery.test`  | `<válida>`      | role CUSTOMER (para teste de 403)   |
| Credencial inválida | `admin@delivery.test`   | `senha-errada`  | dispara "Credenciais inválidas"     |

> As respostas do backend Clerk devem ser **mockadas/interceptadas** (`page.route`) para tornar os
> testes determinísticos e independentes de credenciais reais.

## 3. Mapa de elementos (`/sign-in`)

| Elemento            | Localizador sugerido                                  | Notas                                  |
|---------------------|------------------------------------------------------|----------------------------------------|
| Título              | `getByRole("heading", { name: "Admin Delivery" })`   | —                                      |
| Campo Email         | `getByLabel("Email")` / `input[type=email]`          | `required`                             |
| Campo Senha         | `getByLabel("Senha")` / `input[type=password]`       | `required`                             |
| Botão Entrar        | `getByRole("button", { name: "Entrar" })`            | vira "Entrando..." e `disabled` no loading |
| Mensagem de erro    | texto `Credenciais inválidas` / `Erro de conexão`    | só renderiza quando há erro            |

## 4. Mapa de fluxos do usuário

1. **Login bem-sucedido:** `/sign-in` → preenche credenciais → `POST /api/auth/login` 200 →
   grava `admin-token` → redireciona para `/dashboard/resumo`.
2. **Login com falha:** credenciais inválidas → resposta não-OK → exibe "Credenciais inválidas",
   permanece em `/sign-in`, sem token.
3. **Proteção de rota:** acessar `/dashboard/*` sem token → redireciona para `/sign-in`.
4. **Logout:** botão "Sair" no dashboard → remove token → redireciona para `/sign-in`.
5. **Sessão expirada:** requisição autenticada recebe 401 → (por spec) redireciona para `/sign-in`.

## 5. Cenários de teste

### 5.1 Happy paths

| ID    | Cenário                | Passos                                                                                   | Resultado esperado                                                                 |
|-------|------------------------|------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| HP-01 | Login válido           | Abrir `/sign-in`; preencher email/senha válidos; clicar "Entrar" (mock 200 `{token}`)    | `admin-token` salvo no localStorage; URL passa a `/dashboard/resumo`              |
| HP-02 | Estado de carregamento | Submeter com resposta atrasada                                                            | Botão exibe "Entrando..." e fica `disabled` durante a requisição                  |
| HP-03 | Dashboard com token    | Definir `admin-token` no localStorage; acessar `/dashboard/resumo`                        | Conteúdo do dashboard renderiza (sidebar + main), sem redirecionar para `/sign-in`|
| HP-04 | Logout                 | Estando logado, clicar "Sair"                                                             | `admin-token` removido; redireciona para `/sign-in`                               |

### 5.2 Edge cases

| ID    | Cenário                       | Passos                                                                 | Resultado esperado                                                          |
|-------|-------------------------------|-----------------------------------------------------------------------|----------------------------------------------------------------------------|
| EC-01 | Campos vazios                 | Clicar "Entrar" sem preencher nada                                     | Validação nativa HTML (`required`) bloqueia o submit; sem chamada à API     |
| EC-02 | E-mail mal formatado          | Email `admin@`, senha qualquer; submeter                              | Validação nativa de `type=email` bloqueia o submit                          |
| EC-03 | Espaços em branco             | Email/senha só com espaços                                            | Não autentica; comportamento consistente com EC-01 (campo considerado vazio)|
| EC-04 | Re-tentativa após erro        | Após erro, corrigir credenciais e submeter novamente                  | Mensagem de erro some; login conclui com sucesso (HP-01)                    |
| EC-05 | Token inválido/corrompido     | Definir `admin-token` com valor lixo; acessar `/dashboard/resumo`     | Layout considera presença do token; ao chamar API protegida deve cair em 401 (ver ER-04) |

### 5.3 Tratamento de erros

| ID    | Cenário                  | Passos                                                                          | Resultado esperado                                                            |
|-------|--------------------------|--------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| ER-01 | Credenciais inválidas    | Mock `POST /api/auth/login` → 401; submeter                                     | Exibe "Credenciais inválidas"; permanece em `/sign-in`; sem token salvo      |
| ER-02 | Erro de conexão/rede     | Interceptar `/api/auth/login` com `route.abort()`; submeter                     | Exibe "Erro de conexão"; botão volta a "Entrar" (loading resetado)           |
| ER-03 | Rota protegida sem token  | Limpar localStorage; acessar `/dashboard/resumo` direto                         | Redireciona para `/sign-in` (não renderiza dashboard)                         |
| ER-04 | Sessão expirada (401)     | Logado; mock de endpoint autenticado retornando 401 (token expirado)           | Por spec admin-auth: apiClient intercepta 401 e redireciona para `/sign-in`  |

### 5.4 Backend / API (`ClerkGuard` + RBAC)

> Testáveis via chamadas diretas à API (`request` do Playwright) contra o backend.

| ID    | Cenário                          | Requisição                                                  | Resultado esperado |
|-------|----------------------------------|------------------------------------------------------------|--------------------|
| API-01| Token válido                     | `Authorization: Bearer <jwt-válido>` em endpoint protegido | `200` / acesso permitido |
| API-02| Token ausente                    | Sem header `Authorization`                                 | `401 Unauthorized` |
| API-03| Token expirado                   | `Bearer <jwt-expirado>`                                    | `401 Unauthorized` |
| API-04| Admin acessa recurso `@Roles(ADMIN)` | JWT role ADMIN                                          | `200` / permitido  |
| API-05| Customer acessa recurso de admin | JWT role CUSTOMER em endpoint `@Roles(ADMIN)`             | `403 Forbidden`    |
| API-06| Usuário sem role conhecida       | JWT sem role em endpoint `@Roles(ADMIN)`                  | `403 Forbidden`    |

## 6. Riscos e observações para implementação

- **Divergência spec × código (ER-04):** a spec admin-auth determina que o `apiClient` intercepte
  401 e redirecione para `/sign-in`, mas [services/api.ts](../apps/frontend/src/services/api.ts)
  apenas lança `Error` em respostas não-OK, **sem** interceptar 401 nem redirecionar. ER-04 tende a
  **falhar** contra a implementação atual — é um achado a confirmar/corrigir antes ou registrar como
  bug conhecido.
- **Sem componentes oficiais do Clerk:** os testes devem mirar o formulário próprio; não há widget do
  Clerk para interagir.
- **Determinismo:** sempre mockar `POST /api/auth/login` e endpoints autenticados via `page.route`
  para evitar dependência do ambiente Clerk real.
- **Token em localStorage** (`admin-token`): preferir definir o token diretamente no `localStorage`
  como setup de testes de dashboard (HP-03/HP-04) em vez de repetir o login em cada cenário.

---

**Resumo:** 21 cenários — 4 happy paths, 5 edge cases, 4 de erro de UI, 6 de backend/RBAC, mais 2
fluxos de proteção de rota cobertos transversalmente.
