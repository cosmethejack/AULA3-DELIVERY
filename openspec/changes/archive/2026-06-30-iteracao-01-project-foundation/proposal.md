# Fundação do Projeto — Monorepo & Tooling (#01)

## Resumo

Estabelecer o monorepo `npm workspaces` com `apps/frontend` e `apps/backend`, configuração
TypeScript compartilhada, ESLint, Jest, Playwright, `.env` único na raiz e `docker-compose`
para PostgreSQL local. É o alicerce sobre o qual todas as demais mudanças rodam.

## Dimensionamento

- **Tamanho:** Médio — vários arquivos de configuração, porém sem lógica de negócio.
- **Complexidade:** Baixa — configuração declarativa e convencional.
- **Risco:** Baixo — não toca dados nem segurança.

## Escopo Funcional

- `package.json` raiz com workspaces (`apps/*`), scripts `lint`, `test`, `test:e2e`, `build`.
- `tsconfig.base.json` compartilhado; configs por app.
- ESLint (flat config) + Prettier com regras NestJS/Next.
- Jest configurado em ambos os apps (cobertura habilitada); Playwright no frontend.
- `.env` único na raiz (proibido `.env.local`/`.env` por módulo) e `.env.example`.
- `docker-compose.yml` com PostgreSQL 15+.
- README de bootstrap (instalar, subir banco, rodar testes).

## Dependências

- Nenhuma (mudança inicial).

## Riscos

- Divergência de versões entre workspaces. Mitigação: versões fixadas na raiz.

## Qualidade & Testes

### Linter
- `npm run lint` deve passar em ambos os workspaces (ESLint configurado).

### Testes Unitários
- Teste smoke garantindo que cada workspace carrega e que o runner Jest executa (1 teste trivial por app).

### Testes de Integração
- Não se aplica nesta mudança (sem endpoints/persistência ainda).

### Testes E2E
- Smoke do Playwright validando que a toolchain de E2E instala e executa (teste placeholder verde).

## Definição de Pronto

- `npm install` funciona na raiz; `docker-compose up` sobe o PostgreSQL.
- `npm run lint` e `npm test` verdes nos dois apps.
- Estrutura de pastas conforme `docs/architecture.md`.

## Fora de Escopo

- Qualquer entidade, endpoint ou tela de negócio.
