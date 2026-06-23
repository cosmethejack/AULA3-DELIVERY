## Context

Pipelines de CI/CD (GitHub Actions) e infraestrutura declarativa (Terraform). CI roda lint + testes em PR/push; CD faz deploy do frontend (Vercel) e backend (container OCI). Terraform provisiona PostgreSQL gerenciado (Supabase).

## Goals / Non-Goals

**Goals:**
- `.github/workflows/ci.yml` — lint + test + build em PR e push
- `.github/workflows/deploy-frontend.yml` — deploy Vercel ao push em `main`
- `.github/workflows/deploy-backend.yml` — build Docker image + deploy
- `infra/main.tf` — provedor Supabase para PostgreSQL gerenciado
- `infra/variables.tf` e `infra/outputs.tf`
- GitHub Secrets configurados

**Non-Goals:**
- Kubernetes
- Múltiplos ambientes além do necessário
- Monitoramento Grafana configurado

## Decisions

| Decisão | Alternativa | Rationale |
|---------|-------------|-----------|
| GitHub Actions vs GitLab CI | GitLab CI | Repositório no GitHub; integração nativa |
| Vercel para frontend vs Cloudflare Pages | Cloudflare | Stack definida; Vercel é padrão Next.js |
| Container OCI para backend vs serverless | Serverless | Stack definida; Docker facilita portabilidade |
| Terraform vs Pulumi | Pulumi | Stack definida; HCL familiar para infra |

## Risks / Trade-offs

- [Secrets] Vazamento de segredos → GitHub Secrets + scanner + rotação periódica
- [Vercel] Conexão com repositório requer permissão → configurar via GitHub App
- [Container] Build lento sem cache → cache de camadas Docker no CI
