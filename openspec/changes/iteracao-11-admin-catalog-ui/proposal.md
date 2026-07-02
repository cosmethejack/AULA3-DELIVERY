# UI de Gestão de Catálogo (#11) — RF-03/RF-04

## Resumo

Telas administrativas para gestão de **categorias** e **produtos**: listagem com pesquisa,
cadastro, edição e exclusão, conforme `docs/spec.md` (Listagem de Categorias, Listagem/Edição
de Produto). Restrito a ADMIN. UI conforme `docs/design.md`.

## Dimensionamento

- **Tamanho:** Médio — múltiplas telas CRUD reutilizando componentes.
- **Complexidade:** Média — formulários, validação de UI e estados.
- **Risco:** Baixo — protegido por RBAC no backend.

## Escopo Funcional

### Frontend
- **Listagem de Categorias**: nome, ativo; comandos cadastrar/pesquisar/editar/excluir.
- **Listagem de Produtos**: nome, imagem, descrição, preço, estoque, categoria, ativo; cadastrar/pesquisar/editar/excluir.
- **Edição de Produto**: formulário com salvar/cancelar e validação de UI.
- Integração via `services`; rotas protegidas (redireciona não-ADMIN ao login).
- Componentes/inputs conforme `docs/design.md`.

## Dependências

- #08 catalog-categories-api, #09 catalog-products-api, #05 identity-rbac-foundation.

## Riscos

- Divergência entre validação de UI e backend. Mitigação: backend é a verdade; UI só antecipa erros.

## Qualidade & Testes

### Linter
- `npm run lint` (frontend) verde.

### Testes Unitários
- Formulários: validação de campos obrigatórios; submit chama `services` corretos; estados de erro/sucesso.

### Testes de Integração
- Não se aplica (UI); contratos verificados via mocks de `services`.

### Testes E2E (Playwright)
- ADMIN cria, edita e exclui categoria e produto; pesquisa filtra a lista; usuário sem papel é bloqueado.

## Definição de Pronto

- CRUD de catálogo operável pela UI por um ADMIN.
- Lint + unit + E2E verdes; cobertura frontend ≥ 70%.

## Fora de Escopo

- Regras de negócio (residem no backend).
