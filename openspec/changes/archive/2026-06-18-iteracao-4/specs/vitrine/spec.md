## ADDED Requirements

### Requirement: Grade de Produtos com Filtro
A página inicial DEVE exibir produtos em grade com filtro por categoria. Produtos sem estoque aparecem mas não podem ser adicionados ao carrinho.

#### Scenario: Filtrar por categoria
- **WHEN** usuário clica em uma categoria no filtro
- **THEN** grade é atualizada com apenas produtos daquela categoria

### Requirement: Detalhe do Produto
A página `/produtos/[id]` DEVE exibir nome, descrição, preço e imagem do produto com botão "Adicionar ao carrinho".

#### Scenario: Produto sem estoque
- **WHEN** produto visitado tem estoque = 0
- **THEN** botão "Adicionar ao carrinho" é desabilitado com texto "Indisponível"
