# UI de Gestão de Pedidos (Admin) (#18) — RF-06

## Resumo

Telas administrativas para **acompanhar e movimentar pedidos**: listagem com **filtro por
status**, detalhe do pedido e **alteração de status** (usando #16). Conforme `docs/spec.md`
(Gestão de Pedidos, Acompanhamento, Detalhe). UI conforme `docs/design.md`.

## Dimensionamento

- **Tamanho:** Médio — telas de lista/detalhe + ações de status.
- **Complexidade:** Média — filtros e refletir transições válidas na UI.
- **Risco:** Baixo — protegido por RBAC no backend.

## Escopo Funcional

### Frontend
- **Gestão de Pedidos**: lista com filtro por status; identificar pendentes/atrasados.
- **Detalhe do Pedido**: número, status, produtos; comando **alterar status** (apenas transições válidas).
- Atualização de status refletida imediatamente na lista.
- Rota protegida (ADMIN); integração via `services`.

## Dependências

- #16 order-state-machine, #05 identity-rbac-foundation.

## Riscos

- Oferecer transição inválida na UI. Mitigação: derivar opções do estado atual; backend valida de novo.

## Qualidade & Testes

### Linter
- `npm run lint` (frontend) verde.

### Testes Unitários
- Filtro por status atualiza a lista; seletor de status oferece apenas próximas transições; estados de erro/sucesso.

### Testes de Integração
- Não se aplica (UI); contratos via mocks de `services`.

### Testes E2E (Playwright)
- ADMIN filtra por status, abre detalhe e avança o status; mudança reflete imediatamente; não-ADMIN é bloqueado.

## Definição de Pronto

- Acompanhamento e movimentação de pedidos operáveis pela UI por um ADMIN.
- Lint + unit + E2E verdes; cobertura frontend ≥ 70%.

## Fora de Escopo

- Registro de pagamento (#19) e dashboard (#21).
