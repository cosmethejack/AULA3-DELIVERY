## MODIFIED Requirements

### Requirement: Checkout com Cliente Autenticado
O checkout DEVE (MUST) exigir cliente autenticado. Os dados do cliente são derivados da identidade;
apenas o endereço de entrega é coletado/confirmado no checkout. Cliente não autenticado é
redirecionado ao login.

#### Scenario: Cliente não autenticado tenta finalizar
- **WHEN** um visitante não autenticado aciona "Finalizar Pedido"
- **THEN** é redirecionado para a tela de login

#### Scenario: Cliente autenticado finaliza pedido
- **WHEN** um cliente autenticado finaliza o pedido com endereço informado
- **THEN** o pedido é criado e a tela de confirmação exibe o total da compra
