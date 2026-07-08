# Máquina de Estados do Pedido (#16) — RF-02/RF-06

## Resumo

Implementar as **transições de status** do pedido conforme `docs/spec.md`, com validação de
transições permitidas, auditoria obrigatória de toda mudança e RBAC (ADMIN movimenta o fluxo;
CUSTOMER pode cancelar pedido **não pago**).

## Dimensionamento

- **Tamanho:** Médio — endpoint de transição + tabela de transições.
- **Complexidade:** Média — validação da máquina de estados e regras de papel.
- **Risco:** Médio — integridade do ciclo de vida do pedido.

## Escopo Funcional

### Backend
- `PATCH /v1/orders/:id/status` validando a matriz de transições:
  `Novo→Pago→Preparação→Faturado→Despachado→Entregue`; qualquer estado exceto Entregue → `Cancelado`.
- RBAC: ADMIN movimenta; CUSTOMER só **cancela** o próprio pedido enquanto **não pago**.
- Pedido **cancelado não retorna** ao fluxo operacional.
- Toda transição gera **auditoria** (#06) com usuário/ação/payload/timestamp.
- Ownership no acesso ao pedido (IDOR); erros RFC 9457.

## Dependências

- #15 cart-and-checkout, #06 audit-foundation.

## Riscos

- Transição inválida aceita. Mitigação: tabela de transições + testes exaustivos (matriz).
- Cancelamento de pedido pago por cliente. Mitigação: regra + teste sad path.

## Qualidade & Testes

### Linter
- `npm run lint` (backend) verde.

### Testes Unitários
- Validador de transições: aceita transições válidas; rejeita inválidas e reentrada a partir de Cancelado/Entregue.
- Regra de cancelamento por CUSTOMER somente quando não pago.

### Testes de Integração
- Supertest: ADMIN avança status (200); transição inválida → 422; CUSTOMER cancela próprio pedido não pago (200) e é negado em pedido de outro (403/404) e em pedido pago.
- Auditoria persistida a cada transição.

### Testes E2E
- Não se aplica diretamente (validado nas UIs #17/#18).

## Definição de Pronto

- Ciclo de status íntegro, auditado e protegido por RBAC/ownership.
- Lint + unit + integração verdes; cobertura backend ≥ 80%.

## Fora de Escopo

- Registro de pagamento (#19) — aqui apenas o estado.
