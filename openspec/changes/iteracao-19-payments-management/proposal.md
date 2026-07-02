# Gestão de Pagamentos (#19) — RF-06

## Resumo

Permitir que o **ADMIN registre pagamentos** manualmente para um pedido (valor, método, data,
status, observação). Um pagamento pertence a **exatamente um** pedido; o pedido é considerado
**Pago** quando existir pagamento com status **Confirmado** (transiciona via #16).

## Dimensionamento

- **Tamanho:** Médio — endpoint + UI de registro + regra de "pago".
- **Complexidade:** Média — vínculo 1:1 com pedido e efeito no status.
- **Risco:** Médio — operação financeira e auditada.

## Escopo Funcional

### Backend
- `POST /v1/orders/:id/payments` (ADMIN): registra pagamento; **método obrigatório** no registro manual.
- Regra: pagamento Confirmado → pedido passa a **Pago** (transição via máquina de estados #16).
- Um pagamento pertence a exatamente um pedido; auditoria obrigatória (#06); erros RFC 9457.

### Frontend
- Ação no detalhe do pedido (admin) para **registrar pagamento** (valor, método, data, status, observação).

## Dependências

- #16 order-state-machine, #06 audit-foundation.

## Riscos

- Registrar pagamento por não-admin. Mitigação: RBAC + teste 403.
- Inconsistência entre pagamento confirmado e status do pedido. Mitigação: transição atômica + teste.

## Qualidade & Testes

### Linter
- `npm run lint` (ambos) verde.

### Testes Unitários
- Backend: método obrigatório; pagamento Confirmado marca pedido como Pago; vínculo 1:1 respeitado.
- Frontend: formulário valida campos obrigatórios do pagamento.

### Testes de Integração
- Supertest: ADMIN registra pagamento (201) e pedido vira Pago; CUSTOMER → 403; método ausente → 400; auditoria gravada.

### Testes E2E (Playwright)
- ADMIN abre um pedido Novo, registra pagamento Confirmado e vê o pedido como Pago.

## Definição de Pronto

- Registro de pagamento funcional, com efeito correto no status e auditoria.
- Lint + unit + integração + E2E verdes; cobertura backend ≥ 80% / frontend ≥ 70%.

## Fora de Escopo

- Gateway de pagamento real e divisão de pagamento (futuro).
