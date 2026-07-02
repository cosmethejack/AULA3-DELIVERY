## 1. Backend — Proteção e Ownership

- [ ] 1.1 Re-aplicar `@Roles("CUSTOMER","ADMIN")` em `POST /orders`
- [ ] 1.2 Derivar `clienteId` do token (resolver `clerkUserId` → `Customer`); ignorar `body.clienteId`
- [ ] 1.3 `@Roles` + ownership em `GET /orders/:id` (ADMIN vê todos; cliente só o próprio → 404)
- [ ] 1.4 Corrigir mapeamento `req.user.sub` → `Customer.id` em `orders.service`
- [ ] 1.5 `POST /customers`: remover acesso público (restringir a ADMIN)

## 2. Reverter patches guest

- [ ] 2.1 Remover/ajustar o upsert de cliente por e-mail
- [ ] 2.2 Revisar o checkout que criava cliente anônimo

## 3. Frontend

- [ ] 3.1 Guard de rota no checkout (redireciona ao sign-in se não autenticado)
- [ ] 3.2 Checkout deriva dados do cliente autenticado (mantém endereço de entrega)

## 4. Testes

- [ ] 4.1 Integração: criar pedido autenticado (201)
- [ ] 4.2 Integração: 401 sem token
- [ ] 4.3 IDOR: cliente A não acessa pedido de B (404)
- [ ] 4.4 ADMIN acessa qualquer pedido
- [ ] 4.5 Verificar cobertura ≥ 80%
