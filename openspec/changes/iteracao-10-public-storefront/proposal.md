# Vitrine Pública (#10) — RF-01

## Resumo

Tela **Página Principal** (Next.js) que exibe o catálogo de produtos ativos em formato de
catálogo, com busca, consumindo a API pública via camada `services`. Acessível sem login.
UI conforme `docs/design.md`.

## Dimensionamento

- **Tamanho:** Médio — página + componentes de catálogo e busca.
- **Complexidade:** Média — estados de carregamento/erro/vazio e regra de estoque na UI.
- **Risco:** Baixo — somente leitura, sem dados sensíveis.

## Escopo Funcional

### Frontend
- Página principal com grid de produtos (nome, descrição, preço, imagem).
- Campo de **busca de produtos**; navegação para áreas do sistema.
- **Sem estoque**: produto visível, porém botão "Adicionar ao carrinho" desabilitado (regra RF-01).
- Toda integração via camada `services`; **nenhuma regra de negócio no frontend**.
- Componentização e tokens de design conforme `docs/design.md` (cores, tipografia, cards, inputs).
- Responsivo (breakpoints e touch targets do design).

## Dependências

- #09 catalog-products-api.

## Riscos

- Acoplar regra de negócio à página. Mitigação: regras no backend; UI só reflete `ativo`/`estoque`.

## Qualidade & Testes

### Linter
- `npm run lint` (frontend) verde.

### Testes Unitários
- Componentes: card renderiza dados; botão desabilita quando estoque = 0; busca filtra/dispara consulta; estados vazio/erro.

### Testes de Integração
- Não se aplica como Jest+Supertest (camada de UI); contratos cobertos via mocks de `services` nos testes unitários.

### Testes E2E (Playwright)
- Usuário anônimo abre a vitrine, vê produtos ativos, busca por termo e vê resultados; produto sem estoque não permite adicionar.

## Definição de Pronto

- Vitrine navegável e buscável; regra de estoque refletida na UI.
- Lint + unit + E2E verdes; cobertura frontend ≥ 70%.

## Fora de Escopo

- Carrinho/checkout (entram em #15).
