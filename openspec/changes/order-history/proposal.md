# Histórico de Pedidos do Cliente ("Meus Pedidos") — RF-02

## Resumo

Permitir que o cliente autenticado visualize seu **histórico de pedidos**. Escopar
`GET /orders` ao cliente do token (para não-admin) e criar a tela "Meus Pedidos".
Fecha o requisito RF-02 ("visualizar o histórico de pedidos"), que só faz sentido pleno
com cliente autenticado.

## Risco

**Baixo** — leitura escopada + UI; depende da base já entregue nas mudanças anteriores.

## Artefatos

### Backend

- `GET /v1/orders` (`findAll`) → para CUSTOMER, filtra pelos pedidos do `Customer` do token
  (viabilizado pelo mapeamento `clerkUserId`); ADMIN continua vendo todos.
- Paginação obrigatória (`?page=1&limit=20`), conforme config.

### Frontend

- Tela **"Meus Pedidos"**: lista com número, status, total e link para acompanhamento.
- Navegação a partir do cabeçalho (visível quando autenticado).

## Regras de Negócio

- Cliente consulta apenas os próprios pedidos (RBAC CUSTOMER).
- RF-02: visualizar histórico de pedidos.
- Total exibido = soma dos itens (não persistido), conforme spec.

## Dependências

`customer-authentication`, `authenticated-checkout`.

## Fora de Escopo

- Filtros avançados e exportação (PDF/Excel — versões futuras).

## Tarefas Principais

1. Escopar `findAll` pelo `Customer` do token + paginação.
2. Endpoint/serviço de listagem do cliente.
3. Frontend: página "Meus Pedidos" + navegação no cabeçalho.
4. Testes (Happy/Sad/Edge): listagem escopada, paginação, estado vazio.
