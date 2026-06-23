## ADDED Requirements

### Requirement: Carrinho com Persistência Local
O carrinho DEVE ser gerenciado via `CartContext` com persistência em localStorage. Itens, quantidades e total são mantidos entre sessões.

#### Scenario: Adicionar item ao carrinho
- **WHEN** usuário clica "Adicionar ao carrinho"
- **THEN** item é adicionado ao CartContext e badge do carrinho atualiza

### Requirement: Checkout com Dados do Cliente
O checkout DEVE coletar nome, endereço, e-mail e telefone do cliente antes de confirmar o pedido.

#### Scenario: Checkout com campos obrigatórios vazios
- **WHEN** usuário tenta confirmar pedido sem preencher campos obrigatórios
- **THEN** formulário exibe mensagens de validação e não envia

### Requirement: Confirmação de Pedido
Após checkout bem-sucedido, o sistema DEVE redirecionar para página de confirmação com resumo do pedido.

#### Scenario: Pedido criado com sucesso
- **WHEN** checkout é concluído
- **THEN** usuário é redirecionado para `/pedido/[id]` com resumo e número do pedido
