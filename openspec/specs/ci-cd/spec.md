## Purpose

Pipeline CI/CD e infraestrutura: lint + testes + build no CI, deploy frontend no Vercel, build Docker do backend, provisionamento via Terraform.

## Requirements

### Requirement: CI com Lint + Test + Build
O pipeline de CI DEVE (MUST) executar ESLint, testes unitários e de integração, e build em todo pull request e push para a branch padrão `master`. O job de lint DEVE usar ESLint (não apenas `tsc --noEmit`) e DEVE validar os próprios arquivos de workflow com `actionlint`.

#### Scenario: CI falha por lint
- **WHEN** PR contém código com erro de lint
- **THEN** CI falha e reporta o erro no check do GitHub

#### Scenario: CI dispara na branch correta
- **WHEN** um push ou pull request alveja a branch `master`
- **THEN** o workflow de CI é acionado e executa seus jobs

#### Scenario: Workflow YAML inválido é barrado
- **WHEN** um arquivo `.github/workflows/*.yml` contém erro de sintaxe ou uso inválido de action
- **THEN** o passo `actionlint` falha o job de lint

### Requirement: Gate de cobertura no backend
O pipeline DEVE (MUST) coletar cobertura do backend com `jest --coverage` e DEVE falhar o build quando a cobertura de linhas OU de branches ficar abaixo de 80%. O limite DEVE ser aplicado via `coverageThreshold` nativo do Jest.

#### Scenario: Build falha abaixo da meta do backend
- **WHEN** a cobertura de linhas ou branches do backend é inferior a 80%
- **THEN** o processo de teste retorna código de saída diferente de zero e o job falha

#### Scenario: Build passa na meta do backend
- **WHEN** a cobertura de linhas e branches do backend é maior ou igual a 80%
- **THEN** o job de cobertura conclui com sucesso

### Requirement: Gate de cobertura no frontend
O pipeline DEVE (MUST) coletar cobertura do frontend com `vitest run --coverage` e DEVE falhar o build quando a cobertura de linhas OU de branches ficar abaixo de 70%. O limite DEVE ser aplicado via `coverage.thresholds` nativo do Vitest.

#### Scenario: Build falha abaixo da meta do frontend
- **WHEN** a cobertura de linhas ou branches do frontend é inferior a 70%
- **THEN** o processo de teste retorna código de saída diferente de zero e o job falha

### Requirement: Cobertura medida sobre o código inteiro
A medição de cobertura do backend DEVE (MUST) incluir todos os módulos de negócio. As exclusões de `catalog`, `customers` e `observability` no `collectCoverageFrom` DEVEM ser removidas, de modo que o gate avalie o código completo.

#### Scenario: Módulos de negócio entram na medição
- **WHEN** a cobertura do backend é calculada
- **THEN** os módulos `catalog`, `customers` e `observability` são contabilizados no denominador

### Requirement: Relatório de cobertura publicado como artefato
O pipeline DEVE (MUST) publicar o relatório de cobertura (backend e frontend) como artefato do workflow, acessível a partir do pull request.

#### Scenario: Artefato disponível no PR
- **WHEN** o job de cobertura conclui (com sucesso ou falha)
- **THEN** o relatório de cobertura é carregado como artefato e fica disponível para download no run do GitHub Actions

### Requirement: CD Frontend (Vercel)
O pipeline de CD DEVE (MUST) fazer deploy do frontend no Vercel automaticamente ao push em main.

#### Scenario: Deploy automático
- **WHEN** código é mergeado em main
- **THEN** Vercel deploya nova versão e retorna URL de preview

### Requirement: Infraestrutura com Terraform
O diretório `infra/` DEVE (MUST) conter configuração Terraform para provisionar PostgreSQL gerenciado (Supabase).

#### Scenario: Terraform plan válido
- **WHEN** `terraform plan` é executado
- **THEN** mostra os recursos a serem criados sem erros
