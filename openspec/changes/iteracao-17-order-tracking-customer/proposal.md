# Histórico & Acompanhamento do Cliente — "Meus Pedidos" (#17) — RF-02

## Resumo

Permitir que o cliente autenticado **visualize o histórico** e **acompanhe** seus pedidos, e
**cancele** pedidos ainda não pagos. `GET /v1/orders` é escopado ao cliente do token; tela
"Meus Pedidos" + detalhe. UI conforme `docs/design.md`.

## Dimensionamento

- **Tamanho:** Médio — endpoint escopado + telas de lista e detalhe.
- **Complexidade:** Média — escopo por identidade e estados de UI.
- **Risco:** Baixo — leitura escopada (mutação de cancelamento reusa #16).

## Escopo Funcional

### Backend
- `GET /v1/orders` para CUSTOMER filtra pelos pedidos do `Customer` do token; ADMIN vê todos. Paginação obrigatória.
- `GET /v1/orders/:id` com **ownership** (CUSTOMER só o próprio; ADMIN todos) — fecha IDOR.

### Frontend
- Tela **"Meus Pedidos"**: número, status, total, link de acompanhamento; visível no cabeçalho quando autenticado.
- **Detalhe do Pedido**: número, status, produtos; ação de **cancelar** quando não pago (usa #16).
- Integração via `services`.

## Dependências

- #15 cart-and-checkout, #13 customer-registration-auth (e #16 para cancelar).

## Riscos

- Vazamento de pedidos de outro cliente. Mitigação: escopo por token + ownership + teste IDOR.

## Qualidade & Testes

### Linter
- `npm run lint` (ambos) verde.

### Testes Unitários
- Backend: `findAll` escopa por cliente do token; ADMIN não escopa. Frontend: render de lista/detalhe e botão cancelar condicionado a "não pago".

### Testes de Integração
- Supertest: CUSTOMER vê só os próprios; tentativa de `GET /orders/:id` de outro → 403/404; paginação aplicada.

### Testes E2E (Playwright)
- Cliente logado abre "Meus Pedidos", vê apenas os seus, acessa detalhe e cancela um pedido não pago.

## Definição de Pronto

- Histórico escopado e seguro; acompanhamento e cancelamento funcionando na UI.
- Lint + unit + integração + E2E verdes; cobertura backend ≥ 80% / frontend ≥ 70%.

## Fora de Escopo

- Filtros avançados e exportação (PDF/Excel) — futuro.
