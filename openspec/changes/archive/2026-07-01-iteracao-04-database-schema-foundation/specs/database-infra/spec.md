## ADDED Requirements

### Requirement: Enums de status do domínio
O schema Prisma DEVE (MUST) definir os enums `OrderStatus`
(`PENDING`, `CONFIRMED`, `PREPARING`, `SHIPPED`, `DELIVERED`, `CANCELLED`),
`PaymentStatus` e `PaymentMethod`, usados pelos campos de status/método das entidades
`Order` e `Payment`.

#### Scenario: Campos de status usam os enums
- **WHEN** o schema é validado
- **THEN** `Order.status` referencia `OrderStatus` e `Payment.status`/`Payment.metodo` referenciam `PaymentStatus`/`PaymentMethod`

### Requirement: Migrations versionadas como única via de alteração
Toda alteração de schema DEVE (MUST) gerar uma migration Prisma versionada em
`prisma/migrations`, sendo PROIBIDO (MUST NOT) alterar tabelas manualmente. A migration
inicial DEVE (MUST) ser aplicável a um banco vazio (do zero).

#### Scenario: Migration inicial aplica do zero
- **WHEN** `prisma migrate` é executado contra um banco PostgreSQL vazio
- **THEN** todas as tabelas e constraints do MVP são criadas com sucesso

#### Scenario: Alteração de schema exige migration
- **WHEN** o schema Prisma é alterado
- **THEN** existe uma migration versionada correspondente à mudança

### Requirement: Seed de desenvolvimento idempotente
O projeto DEVE (MUST) fornecer um `seed` que popule dados de desenvolvimento
(categorias, produtos e exemplos), sem segredos reais, e DEVE (MUST) poder ser executado
repetidamente sem falhar por violação de unicidade.

#### Scenario: Seed popula dados de desenvolvimento
- **WHEN** o `seed` é executado em um banco migrado
- **THEN** os dados de exemplo são inseridos sem erro

#### Scenario: Seed reexecutado não quebra
- **WHEN** o `seed` é executado novamente sobre dados já existentes
- **THEN** ele conclui sem erro de unicidade

### Requirement: PrismaService com ciclo de vida gerenciado
O acesso a dados DEVE (MUST) ocorrer exclusivamente via Prisma (PROIBIDO (MUST NOT) raw SQL),
através de um `PrismaService` que conecta na inicialização do módulo e desconecta no
encerramento.

#### Scenario: Conecta e desconecta no ciclo do módulo
- **WHEN** o módulo do backend inicializa e depois é encerrado
- **THEN** o `PrismaService` executa `$connect` na inicialização e `$disconnect` no encerramento

### Requirement: Unicidade de chaves naturais
O schema DEVE (MUST) garantir unicidade em `Category.slug`, `Customer.email` e
`Order.numero`.

#### Scenario: Violação de unicidade é rejeitada
- **WHEN** uma inserção repete um valor único existente (ex.: `Customer.email`)
- **THEN** o banco rejeita a operação por violação de constraint de unicidade
