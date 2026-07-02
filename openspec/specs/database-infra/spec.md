## Purpose

Infraestrutura de banco de dados local para desenvolvimento: container PostgreSQL via Docker Compose, schema Prisma com entidades do MVP e conexão configurável via variáveis de ambiente.

## Requirements

### Requirement: PostgreSQL container via Docker Compose
O sistema DEVE (MUST) fornecer um `docker-compose.yml` que inicialize PostgreSQL 15+ com porta, usuário e banco de dados configuráveis via variáveis de ambiente.

#### Scenario: Container sobe com configuração padrão
- **WHEN** o desenvolvedor executa `docker compose up -d`
- **THEN** o container PostgreSQL 15+ inicia e fica acessível na porta configurada

#### Scenario: Persistência entre reinicializações
- **WHEN** o container é reiniciado
- **THEN** os dados persistidos em volume Docker são mantidos

### Requirement: Schema Prisma com entidades do MVP
O schema Prisma DEVE (MUST) mapear as entidades Category, Product, Customer, Order, OrderItem e Payment com relacionamentos e constraints adequados.

#### Scenario: Geração do Prisma Client
- **WHEN** `prisma generate` é executado
- **THEN** o Prisma Client é gerado com tipos TypeScript para todas as entidades

#### Scenario: Migração inicial aplicada
- **WHEN** `prisma migrate dev` é executado
- **THEN** as tabelas são criadas no PostgreSQL conforme o schema

### Requirement: Conexão via variável de ambiente
A string de conexão com o banco DEVE (MUST) ser lida da variável `DATABASE_URL` no arquivo `.env` na raiz do monorepo.

#### Scenario: Conexão bem-sucedida
- **WHEN** o backend inicia com `DATABASE_URL` válida
- **THEN** o Prisma Client conecta ao PostgreSQL sem erros

#### Scenario: Conexão ausente
- **WHEN** `DATABASE_URL` não está definida
- **THEN** o backend falha ao iniciar com mensagem de erro clara

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
