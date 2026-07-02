# Plano de Testes — Autenticação de Cliente (Registro + Login, Clerk)

> ⚠️ **STATUS: NÃO IMPLEMENTADO.** Este plano descreve uma funcionalidade **planejada**, não
> construída. Nenhuma task de [openspec/changes/customer-authentication/tasks.md](../openspec/changes/customer-authentication/tasks.md)
> está marcada, não existe `POST /v1/auth/register` em
> [auth.controller.ts](../apps/backend/src/modules/auth/auth.controller.ts), não existe tela de
> sign-up no frontend e o schema Prisma ainda não tem `Customer.clerkUserId`. Diferente de
> [specs/login-flow-test-plan.md](login-flow-test-plan.md) — que foi validado contra código e UI
> reais — este plano foi gerado **só a partir da spec** (não houve exploração de interface via
> `playwright-test-planner`, porque não há interface para explorar). Sirva como guia de aceite
> para quem for construir a feature; os localizadores de UI (`getByRole`, `getByLabel` etc.) e
> caminhos de rota **precisam ser revisados/ajustados contra a implementação real** antes de
> qualquer automação, seguindo o mesmo processo já aplicado ao plano de login do admin.

> Gerado seguindo o workflow [.agents/prompts/playwright-test-planner.md](../.agents/prompts/playwright-test-planner.md).
> Base de exploração: [openspec/changes/customer-authentication/proposal.md](../openspec/changes/customer-authentication/proposal.md),
> [design.md](../openspec/changes/customer-authentication/design.md),
> [specs/customer-auth/spec.md](../openspec/changes/customer-authentication/specs/customer-auth/spec.md),
> [specs/customers-api/spec.md](../openspec/changes/customer-authentication/specs/customers-api/spec.md) e
> [tasks.md](../openspec/changes/customer-authentication/tasks.md) — mais o código reaproveitado do
> login de admin ([AuthService](../apps/backend/src/modules/auth/auth.service.ts),
> [AuthController](../apps/backend/src/modules/auth/auth.controller.ts),
> [ClerkGuard](../apps/backend/src/core/auth/clerk.guard.ts)), já que `POST /v1/auth/login` será
> reutilizado tal qual para clientes.
>
> Gerado em 2026-07-02.

## 1. Objetivo e escopo

Validar o fluxo de **registro e login de cliente** da vitrine, hoje anônima, que passa a exigir
identidade (RF-02 / architecture.md: "todo cliente corresponde a um usuário autenticado"). Cobre:

- Registro via formulário próprio (`POST /v1/auth/register`): cria usuário no Clerk com
  `public_metadata.role = CUSTOMER` e um `Customer` vinculado por `clerkUserId`.
- Reuso de `POST /v1/auth/login` (já existente e já testado para admin) para clientes.
- Vínculo `Customer ↔ clerkUserId` e resolução do cliente a partir do subject do JWT.
- Token de sessão unificado no frontend (`services/api.ts`) — mesmo mecanismo para cliente e admin.
- Roteamento pós-login por role (cliente vs admin).

**Fora de escopo (Non-Goals da change):**
- Recuperação de senha e MFA (delegados ao Clerk).
- Edição de perfil do cliente.
- Proteção dos endpoints de pedido — tratada em `authenticated-checkout` (outra change).
- Backfill de `clerkUserId` para clientes guest legados (mencionado em design.md como risco, não
  como funcionalidade desta change).

## 2. Pré-condições e dados de teste

- **Dependência de implementação:** todas as tasks de
  [tasks.md](../openspec/changes/customer-authentication/tasks.md) precisam estar concluídas
  (migration `Customer.clerkUserId`, `AuthService.register`, `POST /auth/register`, tela de
  sign-up, `api.ts` unificado) antes de qualquer cenário abaixo ser executável.
- Ambiente: frontend `http://localhost:3000`, backend `http://localhost:3001` (mesma convenção de
  [playwright.config.ts](../playwright.config.ts)).
- `Customer.email` já é `@unique` no schema atual — reaproveitado para a checagem de duplicidade.

| Perfil                     | Nome    | E-mail                        | Senha              | Observação                              |
|-----------------------------|---------|--------------------------------|---------------------|------------------------------------------|
| Cliente novo                | Ana     | `ana.registro+e2e@delivery.test` | `SenhaForte#123`   | e-mail único, gerado por teste (timestamp) |
| Cliente já cadastrado       | Bruno   | `bruno.existente@delivery.test`  | `SenhaForte#123`   | usado para forçar 409 no registro         |
| Cliente com senha fraca     | Carla   | `carla.senhafraca@delivery.test` | `123`               | deve violar a política de senha do Clerk  |

> Assim como no plano de login do admin, as respostas do Clerk (`POST /v1/auth/register`,
> `POST /v1/auth/login`) devem ser **mockadas/interceptadas** (`page.route`) nos testes de UI para
> determinismo. Os testes de contrato do backend (§5.4) podem bater direto na API real de sandbox
> do Clerk, como já faz `specs/login-flow.spec.ts` via `tests/helpers/auth.ts`.

## 3. Mapa de elementos esperado (a confirmar contra a implementação)

> Tela de sign-up ainda não existe — esta tabela é uma **expectativa** baseada em
> `tasks.md` ("form próprio: nome, e-mail, senha, endereço, telefone"), não um mapeamento real.
> **Antes de automatizar, reabrir esta seção e substituir pelos localizadores reais**, do mesmo
> jeito que a §3 de [login-flow-test-plan.md](login-flow-test-plan.md) precisou ser corrigida após
> checar o DOM verdadeiro (labels sem `htmlFor`, por exemplo — verificar se o mesmo padrão se
> repete aqui).

| Elemento              | Localizador sugerido (provisório)         | Notas                                       |
|------------------------|--------------------------------------------|----------------------------------------------|
| Campo Nome             | `input[name="nome"]` (a confirmar)         | `required`                                    |
| Campo Email            | `input[type="email"]`                      | `required`; reaproveita padrão do sign-in admin |
| Campo Senha            | `input[type="password"]`                   | `required`; validar política de senha do Clerk |
| Campo Endereço         | `input[name="endereco"]` ou `textarea` (a confirmar) | `required`                          |
| Campo Telefone         | `input[type="tel"]` (a confirmar)          | `required`                                    |
| Botão Cadastrar        | `getByRole("button", { name: /Cadastrar|Criar conta/ })` | texto exato a confirmar         |
| Mensagem de erro (409) | texto a definir (ex.: "E-mail já cadastrado") | mensagem exata a confirmar na implementação |
| Mensagem de erro (422) | texto a definir (ex.: "Senha inválida")    | mensagem exata a confirmar na implementação   |
| Link para login        | `getByRole("link", { name: /Já tenho conta|Entrar/ })` | a confirmar                        |

## 4. Mapa de fluxos esperados

1. **Registro bem-sucedido:** tela de cadastro → preenche nome/e-mail/senha/endereço/telefone →
   `POST /v1/auth/register` 201 → usuário Clerk criado (role `CUSTOMER`) → `Customer` persistido
   com `clerkUserId` → auto-login (token salvo) → redireciona para a vitrine (ou área do cliente).
2. **Registro com e-mail duplicado:** `POST /v1/auth/register` retorna 409 → formulário exibe erro
   → nenhum `Customer` novo é criado.
3. **Registro com senha fraca:** `POST /v1/auth/register` retorna 422 → formulário exibe erro.
4. **Login de cliente (reuso do fluxo admin):** tela de login → credenciais válidas →
   `POST /v1/auth/login` 200 → token salvo → roteamento por role (`CUSTOMER` → área do cliente,
   não a `/dashboard` do admin).
5. **Resolução por token:** requisição autenticada com JWT de cliente → backend resolve o
   `Customer` correspondente via `clerkUserId` extraído do subject do token.

## 5. Cenários de teste

### 5.1 Happy paths — Registro

| ID     | Cenário                          | Passos                                                                                     | Resultado esperado                                                                 |
|--------|------------------------------------|----------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| REG-01 | Registro válido                  | Abrir tela de cadastro; preencher nome/e-mail único/senha forte/endereço/telefone; submeter (mock 201) | Usuário Clerk criado com role CUSTOMER; `Customer.clerkUserId` persistido; token salvo; redireciona para área autenticada do cliente |
| REG-02 | Auto-login após registro         | Completar REG-01                                                                              | Cliente já entra autenticado, sem precisar logar de novo                              |

### 5.2 Sad paths — Registro

| ID     | Cenário                          | Passos                                                                       | Resultado esperado                                                    |
|--------|------------------------------------|--------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| REG-03 | E-mail já cadastrado             | Registrar com e-mail já existente (mock 409)                                  | Exibe erro de e-mail duplicado; nenhum registro novo é criado (RFC 9457) |
| REG-04 | Senha fora da política            | Registrar com senha fraca, ex. `"123"` (mock 422)                             | Exibe erro de senha inválida (RFC 9457); nenhum usuário/Customer criado  |
| REG-05 | Clerk indisponível durante registro | Interceptar `POST /v1/auth/register` com `route.abort()` ou 500              | Exibe erro de conexão/servidor; nenhum `Customer` órfão é criado (transação atômica — risco documentado em design.md) |

### 5.3 Edge cases — Registro

| ID     | Cenário                          | Passos                                                                       | Resultado esperado                                                    |
|--------|------------------------------------|--------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| REG-06 | Campos obrigatórios vazios       | Submeter formulário em branco                                                 | Validação nativa/client-side bloqueia envio; sem chamada à API           |
| REG-07 | E-mail mal formatado             | Preencher e-mail `cliente@` (sem domínio válido)                              | Validação de `type=email` bloqueia o submit                              |
| REG-08 | Espaços em branco nos campos     | Nome/e-mail/senha só com espaços                                              | Tratado como vazio; não chama a API (consistente com REG-06)             |
| REG-09 | Reenvio após erro                | Corrigir dados após REG-03/REG-04 e reenviar                                  | Mensagem de erro anterior some; registro conclui com sucesso (REG-01)    |

### 5.4 Login de cliente (reuso do fluxo BFF)

| ID     | Cenário                          | Passos                                                                       | Resultado esperado                                                    |
|--------|------------------------------------|--------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| LOG-01 | Login válido de cliente          | Login com credenciais de cliente registrado (mock 200 `{token}`)              | Token salvo; roteamento pós-login leva à área do cliente (não `/dashboard` admin) |
| LOG-02 | Credenciais inválidas            | Login com senha incorreta (mock 401)                                          | Exibe "Credenciais inválidas"; sem token salvo                           |
| LOG-03 | Roteamento por role              | Login com token de role `ADMIN` vs. token de role `CUSTOMER`                  | Admin vai para `/dashboard/resumo`; cliente vai para a área de cliente (rota a confirmar) |

### 5.5 Backend / API — Vínculo e contrato

> Testáveis via chamadas diretas à API (`request` do Playwright), no mesmo padrão de
> `specs/login-flow.spec.ts` §5.4.

| ID     | Cenário                                   | Requisição                                              | Resultado esperado                                              |
|--------|----------------------------------------------|------------------------------------------------------------|----------------------------------------------------------------------|
| API-C1 | Registro cria Customer vinculado          | `POST /v1/auth/register` com dados válidos                | 201; `Customer` persistido com `clerkUserId` não nulo                |
| API-C2 | E-mail duplicado retorna 409              | `POST /v1/auth/register` com e-mail existente              | 409, formato RFC 9457                                                 |
| API-C3 | Senha inválida retorna 422                | `POST /v1/auth/register` com senha fraca                   | 422, formato RFC 9457                                                 |
| API-C4 | Login de cliente retorna JWT              | `POST /v1/auth/login` com credenciais de cliente            | 200 com token de sessão                                               |
| API-C5 | Resolução por clerkUserId                 | Requisição autenticada (JWT de cliente) a endpoint que resolve `Customer` | Backend retorna/associa o `Customer` correto via `clerkUserId` do subject do token |

## 6. Riscos e observações para implementação

- **Bloqueio total:** nenhum cenário acima é executável hoje — dependem de
  `tasks.md` estar 100% concluído (migration, `AuthService.register`, `AuthController`, tela de
  sign-up, `api.ts` unificado). Antes de automatizar, confirmar no código:
  - rota real da tela de cadastro (`/sign-up`? `/cadastro`?);
  - textos exatos de erro e sucesso;
  - se existe `htmlFor`/`id` nos `<label>` (para saber se `getByLabel` é seguro, diferente do que
    se descobriu no fluxo de admin);
  - rota de destino pós-login do cliente (LOG-03).
- **Transação atômica (REG-05):** design.md aponta o risco de criar usuário no Clerk mas falhar ao
  persistir o `Customer` (ou vice-versa) — o cenário REG-05 existe justamente para expor esse caso;
  vale reforçar com um teste de integração de backend (fora do escopo do Playwright) que force falha
  no meio da transação.
- **Senha nunca logada/persistida:** design.md exige que a senha só trafegue até o Clerk. Isso não
  é verificável via Playwright E2E (não inspeciona logs/DB do servidor) — deve ser coberto por
  revisão de código e/ou teste de integração no backend, não por este plano.
- **`clerkUserId` nullable:** clientes guest legados (se existirem) não têm vínculo; não há cenário
  de migração de dados aqui porque esta change não inclui backfill (Non-Goal).
- **Dependência de outras changes:** `authenticated-checkout` e `order-history` dependem desta
  change para existir — não testar esses fluxos aqui até `customer-authentication` estar arquivada.
- **Sem componentes oficiais do Clerk:** mesma regra do login de admin — mirar sempre o formulário
  próprio.

## 7. Rastreabilidade — cenário → teste

| IDs                      | Status |
|----------------------------|--------|
| REG-01 .. REG-09          | Não implementados — sem código para testar |
| LOG-01 .. LOG-03           | Não implementados — dependem da tela/roteamento de cliente |
| API-C1 .. API-C5           | Não implementados — endpoint `POST /v1/auth/register` não existe |

**Próximo passo:** quando `openspec/changes/customer-authentication` for implementada e arquivada
(specs sincronizadas para `openspec/specs/customer-auth/spec.md`), repetir o processo aplicado a
`login-flow-test-plan.md`: reabrir este plano, explorar a UI/código reais, corrigir localizadores e
rotas, criar `specs/customer-auth.spec.ts` e preencher a tabela acima com o status real de cada
teste.

---

**Resumo:** 17 cenários planejados — 2 happy paths de registro, 3 sad paths de registro, 4 edge
cases de registro, 3 de login de cliente, 5 de contrato de API/vínculo. Nenhum implementado; plano
serve como guia de aceite até `customer-authentication` sair do status `proposed`.