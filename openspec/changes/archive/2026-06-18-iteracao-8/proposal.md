# CI/CD e Infraestrutura como Código

## Resumo

Configurar pipelines de integração contínua (GitHub Actions), deploy automatizado (Vercel + Railway) e infraestrutura declarativa (Terraform para Supabase).

## Risco

**Médio** — envolve segredos externos, provedores de nuvem e coordenação entre ambientes.

## Artefatos

### CI (GitHub Actions)

- `.github/workflows/ci.yml` — lint + test (back + front) + build em PR/push

### CD

- `.github/workflows/deploy-frontend.yml` — deploy Vercel ao push em `main`
- `.github/workflows/deploy-backend.yml` — deploy container OCI (Docker image + serviço gerenciado)

### Infraestrutura (Terraform)

- `infra/main.tf` — provisiona Supabase (provedor `supabase/supabase`)
- `infra/variables.tf` — variáveis de entrada
- `infra/outputs.tf` — outputs: `project_id`, `api_url`, `database_url`

### Segredos Externos

- GitHub Secrets: `VERCEL_API_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- Variáveis de ambiente no Vercel e no provedor de deploy do backend
- Conexão Supabase (DATABASE_URL, DIRECT_URL)

## Dependências

- `iteracao 1`, `iteracao 2`, `iteracao 3`, `iteracao 4`, `iteracao 5`, `iteracao 6`, `iteracao 7` — CI só é útil com código para testar

## Protótipos (Stitch)

Projeto: **DELIVERY** (ID: `projects/7259599975311263388`)

N/A — mudança de infraestrutura, sem interface gráfica.

## Fora de Escopo

- Kubernetes (futuro)
- Múltiplos ambientes além do necessário
- Monitoramento Grafana configurado (apenas infra)

## Tarefas Principais

1. Criar `.github/workflows/ci.yml`
2. Criar `.github/workflows/deploy-frontend.yml`
3. Criar `.github/workflows/deploy-backend.yml`
4. Escrever `infra/main.tf` com provedor Supabase
5. Escrever `infra/variables.tf` e `infra/outputs.tf`
6. Configurar GitHub Secrets e variáveis de ambiente
7. Conectar repositório ao Vercel
