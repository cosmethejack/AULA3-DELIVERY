## ADDED Requirements

### Requirement: Monorepo com orquestração pela raiz
O repositório DEVE (MUST) organizar os apps em `apps/backend` e `apps/frontend`, cada
um como um pacote npm próprio. O `package.json` raiz DEVE (MUST) expor os scripts
`lint`, `test`, `test:e2e` e `build` que orquestram os apps (via `npm --prefix apps/<app>`).

#### Scenario: Scripts raiz orquestram os apps
- **WHEN** o desenvolvedor executa `npm run lint` (ou `test`, `build`) na raiz
- **THEN** o script correspondente é executado em `apps/backend` e `apps/frontend`

#### Scenario: E2E disparado pela raiz
- **WHEN** o desenvolvedor executa `npm run test:e2e` na raiz
- **THEN** o Playwright executa os testes E2E configurados em `playwright.config.ts`

### Requirement: Configuração de TypeScript por app
Cada app DEVE (MUST) fornecer seu próprio `tsconfig.json` adequado à sua stack
(NestJS no backend, Next.js no frontend). A verificação de tipos DEVE (MUST) concluir
sem erros em ambos os apps.

#### Scenario: Verificação de tipos passa
- **WHEN** a verificação de tipos (`tsc --noEmit`) é executada em cada app
- **THEN** nenhum erro de tipo é reportado

### Requirement: Lint com ESLint por app
Cada app DEVE (MUST) configurar ESLint via flat config (`eslint.config.mjs`) com regras
adequadas à sua stack (NestJS no backend, Next.js/React no frontend). O comando
`npm run lint` DEVE (MUST) passar em ambos os apps.

#### Scenario: Lint verde em código conforme
- **WHEN** `npm run lint` é executado sobre código que respeita as regras
- **THEN** o lint conclui com sucesso e código de saída zero

#### Scenario: Lint falha em violação
- **WHEN** um arquivo viola uma regra de ESLint
- **THEN** `npm run lint` falha com código de saída diferente de zero e reporta a violação

### Requirement: Runners de teste com cobertura
O backend DEVE (MUST) usar Jest com coleta de cobertura habilitada; o frontend DEVE
(MUST) usar Vitest com coleta de cobertura habilitada; e o Playwright DEVE (MUST)
estar configurado na raiz para testes E2E.

#### Scenario: Testes unitários executam com cobertura
- **WHEN** `npm test` é executado na raiz
- **THEN** o Jest (backend) e o Vitest (frontend) executam seus testes e coletam os relatórios de cobertura

#### Scenario: Playwright executa o smoke E2E
- **WHEN** `npm run test:e2e` é executado na raiz
- **THEN** o Playwright executa a toolchain de E2E e o teste passa (verde)

### Requirement: Ambiente único de configuração e banco local
O projeto DEVE (MUST) usar um único arquivo `.env` na raiz, com um `.env.example`
versionado, sendo PROIBIDO (MUST NOT) usar `.env.local` ou `.env` por módulo. O
projeto DEVE (MUST) fornecer um `docker-compose.yml` que suba PostgreSQL 15+ padrão
e portável (sem extensões de fornecedor).

#### Scenario: Banco local sobe via docker-compose
- **WHEN** o desenvolvedor executa `docker-compose up`
- **THEN** um serviço PostgreSQL 15+ é iniciado usando as variáveis do `.env` da raiz

#### Scenario: Exemplo de ambiente versionado
- **WHEN** o repositório é clonado
- **THEN** existe um `.env.example` na raiz documentando as variáveis necessárias e o `.env` real está no `.gitignore`

### Requirement: Documentação de bootstrap
O repositório DEVE (MUST) conter um README de bootstrap descrevendo como instalar
dependências, subir o banco local e rodar os testes. A estrutura de pastas DEVE
(MUST) seguir `docs/architecture.md`.

#### Scenario: Novo desenvolvedor faz bootstrap
- **WHEN** um novo desenvolvedor segue o README passo a passo
- **THEN** ele instala dependências, sobe o PostgreSQL e executa `npm test` com sucesso
