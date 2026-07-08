## ADDED Requirements

### Requirement: Vínculo Cliente com Identidade
O `Customer` DEVE (MUST) referenciar o usuário do provedor de identidade via `clerkUserId` (único).
O vínculo é a base para ownership de pedidos e histórico do cliente.

#### Scenario: Cliente registrado é vinculado
- **WHEN** um cliente se registra com sucesso
- **THEN** o Customer correspondente é persistido com o `clerkUserId` do usuário Clerk

#### Scenario: Resolver cliente pelo token
- **WHEN** uma requisição autenticada chega com o JWT do cliente
- **THEN** o backend resolve o Customer por `clerkUserId` a partir do subject do token
