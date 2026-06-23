## ADDED Requirements

### Requirement: CI com Lint + Test + Build
O pipeline de CI DEVE executar ESLint, testes unitários e de integração, e build em todo pull request e push para main.

#### Scenario: CI falha por lint
- **WHEN** PR contém código com erro de lint
- **THEN** CI falha e reporta o erro no check do GitHub

### Requirement: CD Frontend (Vercel)
O pipeline de CD DEVE fazer deploy do frontend no Vercel automaticamente ao push em main.

#### Scenario: Deploy automático
- **WHEN** código é mergeado em main
- **THEN** Vercel deploya nova versão e retorna URL de preview

### Requirement: Infraestrutura com Terraform
O diretório `infra/` DEVE conter configuração Terraform para provisionar PostgreSQL gerenciado (Supabase).

#### Scenario: Terraform plan válido
- **WHEN** `terraform plan` é executado
- **THEN** mostra os recursos a serem criados sem erros
