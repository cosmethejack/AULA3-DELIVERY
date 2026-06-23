## 1. CI Pipeline

- [x] 1.1 Criar `.github/workflows/ci.yml` com lint + test + build
- [x] 1.2 Configurar jobs separados para frontend e backend
- [x] 1.3 Adicionar cache de dependências npm

## 2. CD Frontend

- [x] 2.1 Criar `.github/workflows/deploy-frontend.yml` para Vercel
- [ ] 2.2 Configurar GitHub Secrets (postergado — manual via GitHub UI)

## 3. CD Backend

- [x] 3.1 Criar `.github/workflows/deploy-backend.yml` com build Docker
- [x] 3.2 Configurar push de imagem para DockerHub

## 4. Terraform

- [x] 4.1 Criar `infra/main.tf` com provedor Supabase
- [x] 4.2 Criar `infra/variables.tf` com variáveis de entrada
- [x] 4.3 Criar `infra/outputs.tf` com project_id, api_url, database_url

## 5. Segredos e Conexão

- [ ] 5.1 Configurar GitHub Secrets no repositório (postergado — manual)
- [ ] 5.2 Configurar variáveis de ambiente nos provedores de deploy (postergado)
- [ ] 5.3 Conectar repositório ao Vercel (postergado)
