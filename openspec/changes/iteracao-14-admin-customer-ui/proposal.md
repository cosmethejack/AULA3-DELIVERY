# UI de Gestão de Clientes (#14) — RF-05

## Resumo

Telas administrativas de **clientes**: listagem com pesquisa e edição, conforme `docs/spec.md`
(Listagem de Clientes, Edição de Cliente). Restrito a ADMIN. UI conforme `docs/design.md`.

## Dimensionamento

- **Tamanho:** Pequeno — duas telas reutilizando componentes de formulário/lista.
- **Complexidade:** Baixa — CRUD direto.
- **Risco:** Baixo — protegido por RBAC no backend.

## Escopo Funcional

### Frontend
- **Listagem de Clientes**: nome, endereço, e-mail, telefone; cadastrar/pesquisar/editar/excluir.
- **Edição de Cliente**: formulário com salvar/cancelar.
- Refletir regra de desativação (UI desabilita exclusão quando o backend retorna conflito).
- Integração via `services`; rota protegida (ADMIN).

## Dependências

- #12 customer-crud-api, #05 identity-rbac-foundation.

## Riscos

- Mensagem de erro de exclusão pouco clara. Mitigação: tratar 409 com feedback explícito + teste.

## Qualidade & Testes

### Linter
- `npm run lint` (frontend) verde.

### Testes Unitários
- Formulário valida campos; submit chama `services`; tratamento de conflito de exclusão.

### Testes de Integração
- Não se aplica (UI); contratos via mocks de `services`.

### Testes E2E (Playwright)
- ADMIN lista, cria, edita e pesquisa clientes; tentativa de excluir cliente com pedido exibe aviso.

## Definição de Pronto

- Gestão de clientes operável pela UI por um ADMIN.
- Lint + unit + E2E verdes; cobertura frontend ≥ 70%.

## Fora de Escopo

- Regras de negócio (no backend).
