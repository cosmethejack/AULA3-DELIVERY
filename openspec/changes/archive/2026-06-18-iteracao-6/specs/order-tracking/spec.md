## ADDED Requirements

### Requirement: Listagem de Pedidos do Cliente
A página `/pedidos` DEVE listar os pedidos do cliente autenticado com status, data e valor total.

#### Scenario: Cliente sem pedidos
- **WHEN** cliente acessa /pedidos e não tem pedidos
- **THEN** exibe mensagem "Nenhum pedido encontrado"

### Requirement: Timeline de Acompanhamento
A página `/pedidos/[id]/acompanhamento` DEVE exibir timeline vertical com os 6 estados do pedido, destacando o estado atual.

#### Scenario: Timeline com estado atual
- **WHEN** cliente acessa acompanhamento de pedido com status "Preparação"
- **THEN** timeline mostra "Novo" e "Pago" como concluídos, "Preparação" como atual, demais como pendentes

### Requirement: Alerta de Atraso
O sistema DEVE exibir `DelayAlert` com cupom quando o pedido exceder o prazo estimado de entrega.

#### Scenario: Pedido atrasado
- **WHEN** tempo desde criação do pedido > prazo estimado
- **THEN** banner laranja é exibido com mensagem de atraso e código de cupom
