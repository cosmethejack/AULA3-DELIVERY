## ADDED Requirements

### Requirement: PostgreSQL container via Docker Compose
O sistema DEVE fornecer um `docker-compose.yml` que inicialize PostgreSQL 15+ com porta, usuário e banco de dados configuráveis via variáveis de ambiente.

#### Scenario: Container sobe com configuração padrão
- **WHEN** o desenvolvedor executa `docker compose up -d`
- **THEN** o container PostgreSQL 15+ inicia e fica acessível na porta configurada

#### Scenario: Persistência entre reinicializações
- **WHEN** o container é reiniciado
- **THEN** os dados persistidos em volume Docker são mantidos

### Requirement: Schema Prisma com entidades do MVP
O schema Prisma DEVE mapear as entidades Category, Product, Customer, Order, OrderItem e Payment com relacionamentos e constraints adequados.

#### Scenario: Geração do Prisma Client
- **WHEN** `prisma generate` é executado
- **THEN** o Prisma Client é gerado com tipos TypeScript para todas as entidades

#### Scenario: Migração inicial aplicada
- **WHEN** `prisma migrate dev` é executado
- **THEN** as tabelas são criadas no PostgreSQL conforme o schema

### Requirement: Conexão via variável de ambiente
A string de conexão com o banco DEVE ser lida da variável `DATABASE_URL` no arquivo `.env` na raiz do monorepo.

#### Scenario: Conexão bem-sucedida
- **WHEN** o backend inicia com `DATABASE_URL` válida
- **THEN** o Prisma Client conecta ao PostgreSQL sem erros

#### Scenario: Conexão ausente
- **WHEN** `DATABASE_URL` não está definida
- **THEN** o backend falha ao iniciar com mensagem de erro clara
