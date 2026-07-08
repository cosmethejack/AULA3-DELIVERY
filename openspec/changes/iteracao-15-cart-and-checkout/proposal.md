# Carrinho & Checkout Autenticado (#15) — RF-02 / IDOR

## Resumo

Permitir que o **cliente autenticado** monte um carrinho e **crie um pedido**. O `clienteId`
é derivado do **token** (`clerkUserId → Customer`), nunca do body, fechando IDOR. O backend
valida estoque, calcula o total (não persistido) e exige ao menos um item.

## Dimensionamento

- **Tamanho:** Médio — carrinho (UI) + criação de pedido (API) em fatia fina.
- **Complexidade:** Média — validação de estoque e cálculo de total transacional.
- **Risco:** Médio — segurança (IDOR) e atomicidade da criação.

## Escopo Funcional

### Backend
- `POST /v1/orders` (`@Roles("CUSTOMER","ADMIN")`): `clienteId` derivado do token, ignorando o body.
- Regras: ≥ 1 item; quantidade ≤ estoque (revalidado na confirmação); produto **ativo**; preço unitário capturado do produto; total = soma dos itens.
- Transação Prisma para criação atômica de `Pedido` + `ItemPedido`; status inicial **Novo**.
- Auditoria (#06); erros RFC 9457.

### Frontend
- Carrinho: ajustar quantidade, excluir item, confirmar pedido (RF-02 / tela Carrinho).
- Checkout exige login (redireciona ao sign-in se anônimo); coleta apenas endereço de entrega.
- Recalcular total ao alterar quantidade (exibição); integração via `services`.

## Dependências

- #09 catalog-products-api, #13 customer-registration-auth.

## Riscos

- IDOR via `clienteId` no body. Mitigação: derivar do token + teste de tentativa de spoof.
- Venda acima do estoque por corrida. Mitigação: revalidação transacional + teste de concorrência.

## Qualidade & Testes

### Linter
- `npm run lint` (ambos) verde.

### Testes Unitários
- Backend: cálculo de total; rejeição de pedido sem item, com produto inativo, com quantidade > estoque.
- Frontend: carrinho recalcula total; remoção de item; bloqueio de checkout sem login.

### Testes de Integração
- Supertest: criação feliz (201) com `clienteId` do token; body tentando outro `clienteId` é ignorado; estoque insuficiente → 422; sem item → 400.

### Testes E2E (Playwright)
- Cliente logado adiciona itens, ajusta quantidade, confirma pedido e vê confirmação; anônimo é levado ao login.

## Definição de Pronto

- Pedido criado com cliente derivado do token, estoque validado e total correto.
- Lint + unit + integração + E2E verdes; cobertura backend ≥ 80% / frontend ≥ 70%.

## Fora de Escopo

- Transições de status (#16), histórico (#17) e pagamento (#19).
