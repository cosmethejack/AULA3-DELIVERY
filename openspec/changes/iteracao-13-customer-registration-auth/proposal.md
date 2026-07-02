# Registro & Login de Cliente — Formulários Próprios (#13) — RF-05 / Segurança

## Resumo

Permitir que o cliente **crie conta** e **faça login** com **formulários próprios da aplicação**
(SDK/componentes oficiais do Clerk são **proibidos**), via fluxo BFF `Frontend → Backend → Clerk`.
O registro cria o usuário no Clerk (`public_metadata.role = CUSTOMER`) e o `Customer` vinculado
por `clerkUserId`, estabelecendo a identidade usada por checkout e histórico.

## Dimensionamento

- **Tamanho:** Médio — endpoint de registro + telas de sign-up/sign-in.
- **Complexidade:** Média — dupla escrita (Clerk + Customer) e roteamento por papel.
- **Risco:** Médio — autenticação e consistência entre Clerk e banco.

## Escopo Funcional

### Backend
- `POST /v1/auth/register`: cria usuário no Clerk (Backend API) + `Customer` vinculado (`clerkUserId`); retorna token/sessão.
- Tratamento de consistência: falha na criação do `Customer` reverte/compensa o usuário criado no Clerk (evita órfão).
- Reuso de `POST /v1/auth/login` (#05).

### Frontend
- Tela de **cadastro** (nome, e-mail, senha, endereço, telefone) e ajuste da tela de **login** para clientes.
- Roteamento pós-login por papel (ADMIN → painel; CUSTOMER → vitrine/conta).
- Gestão unificada de token de sessão em `services/api` (`Authorization: Bearer`).
- UI conforme `docs/design.md`.

## Dependências

- #05 identity-rbac-foundation, #12 customer-crud-api.

## Riscos

- Usuário órfão no Clerk sem `Customer` (transação distribuída). Mitigação: compensação + teste do caminho de falha.
- Vazamento de credenciais. Mitigação: backend é o único a falar com o Clerk; sem segredo no frontend.

## Qualidade & Testes

### Linter
- `npm run lint` (ambos) verde.

### Testes Unitários
- Backend: `register` cria usuário+Customer; em falha do Customer, executa compensação (sad path).
- Frontend: validação dos formulários; armazenamento/uso do token.

### Testes de Integração
- Supertest (Clerk mockado): registro feliz retorna token e cria `Customer`; e-mail duplicado → 409; falha simulada do Customer não deixa órfão.

### Testes E2E (Playwright)
- Visitante cria conta, é autenticado e roteado por papel; login subsequente funciona; credenciais inválidas mostram erro.

## Definição de Pronto

- Cadastro e login próprios funcionando ponta a ponta; vínculo `clerkUserId` estabelecido.
- Lint + unit + integração + E2E verdes; cobertura backend ≥ 80% / frontend ≥ 70%.

## Fora de Escopo

- Recuperação de senha/MFA (delegados ao provedor de identidade em evolução).
