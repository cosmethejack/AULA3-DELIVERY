# Checkout Autenticado (protege pedidos + IDOR)

## Resumo

Exigir **cliente autenticado** para criar pedido; derivar o cliente do **token**
(não do body); re-proteger `POST /orders` e `GET /orders/:id` com RBAC + verificação
de **propriedade (IDOR)**. Reverte os patches temporários de checkout guest aplicados
para destravar o fluxo enquanto a autenticação de cliente não existia.

## Risco

**Médio** — segurança (IDOR) e reversão de comportamento público atual.

## Bug latente corrigido por esta mudança

Em `orders.service.ts`, `findAll`/ownership comparam `Order.clienteId` (uuid do `Customer`)
com `req.user.sub` (id do usuário no Clerk) — **valores que não batem**. Esta mudança
resolve o mapeamento `clerkUserId → Customer.id`, viabilizando ownership e histórico.

## Artefatos

### Backend

- `POST /v1/orders` → `@Roles("CUSTOMER","ADMIN")`; `clienteId` derivado do token
  (`req.user` → `clerkUserId` → `Customer`), **ignorando** `clienteId` do body.
- `GET /v1/orders/:id` → `@Roles` + **ownership**: CUSTOMER só acessa o próprio pedido;
  ADMIN acessa todos (substitui a confiança apenas na opacidade do UUID).
- Resolver `req.user.sub` → `Customer` em `orders.service` (corrige o bug latente).
- `POST /v1/customers` deixa de ser público (criação de cliente ocorre no `register`).

### Frontend

- `checkout` exige login (redireciona ao sign-in se não autenticado).
- `checkout` deriva os dados do cliente autenticado (remove a coleta de nome/e-mail a cada
  compra; mantém apenas o endereço de entrega).
- Reverter o upsert "guest" de cliente quando não for mais necessário.

## Regras de Negócio

- O cliente deve estar autenticado para criar pedidos (spec.md RF-02).
- IDOR: validar propriedade dos recursos via identidade autenticada (architecture.md).
- Endpoints de pedido são protegidos (architecture.md).

## Dependências

`customer-authentication` (identidade + `clerkUserId`).

## Fora de Escopo

- Histórico de pedidos / "Meus Pedidos" (tratado em `order-history`).

## Tarefas Principais

1. Re-aplicar `@Roles` em `POST /orders` e `GET /orders/:id`.
2. Derivar `clienteId` do token; ignorar `body.clienteId`.
3. Ownership no `findOne` (403/404 conforme o dono).
4. Reverter patches guest (`POST /customers` público; upsert de cliente).
5. Frontend: guard de rota no checkout + prefill do cliente autenticado.
6. Testes (Happy/Sad/Edge): criação autenticada; IDOR (cliente A não acessa pedido de B); 401 sem token.
