## 1. Monorepo e workspaces

- [x] 1.1 Criar `package.json` raiz orquestrando os apps via `npm --prefix` e metadados do projeto
- [x] 1.2 Adicionar scripts raiz `lint`, `test`, `test:e2e` e `build` que orquestram os apps
- [x] 1.3 Definir cada app como pacote npm próprio (`package.json` + `package-lock.json` por app)
- [x] 1.4 Criar `.gitignore` cobrindo `node_modules`, `.env`, `dist`, `coverage` e artefatos de teste

## 2. Configuração de TypeScript

- [x] 2.1 Criar `apps/backend/tsconfig.json` (perfil NestJS)
- [x] 2.2 Criar `apps/frontend/tsconfig.json` (perfil Next.js)
- [x] 2.3 Validar que `tsc --noEmit` passa em ambos os apps

## 3. Lint

- [x] 3.1 Criar `apps/backend/eslint.config.mjs` (flat config, perfil NestJS)
- [x] 3.2 Criar `apps/frontend/eslint.config.mjs` (flat config, perfil Next.js+React)
- [x] 3.3 Verificar que `npm run lint` passa nos dois apps e falha em violação proposital

## 4. Testes (Jest, Vitest e Playwright)

- [x] 4.1 Configurar Jest no backend com cobertura habilitada e um teste smoke
- [x] 4.2 Configurar Vitest no frontend com cobertura habilitada e um teste smoke
- [x] 4.3 Configurar Playwright na raiz com um teste E2E placeholder (verde)
- [x] 4.4 Validar `npm test` e `npm run test:e2e` verdes e geração dos relatórios de cobertura

## 5. Ambiente e banco local

- [x] 5.1 Criar `.env.example` na raiz documentando as variáveis (banco, portas)
- [x] 5.2 Garantir carregamento do `.env` único da raiz pelos apps (sem `.env` por módulo)
- [x] 5.3 Criar `docker-compose.yml` com serviço PostgreSQL 15+ (portável) e volume persistente
- [x] 5.4 Validar que `docker-compose up` sobe o PostgreSQL usando variáveis do `.env`

## 6. Documentação e fechamento

- [x] 6.1 Escrever README de bootstrap (instalar, subir banco, rodar testes)
- [x] 6.2 Conferir estrutura de pastas conforme `docs/architecture.md`
- [x] 6.3 Rodar `npm run lint` e `npm test` na raiz e confirmar Definição de Pronto
