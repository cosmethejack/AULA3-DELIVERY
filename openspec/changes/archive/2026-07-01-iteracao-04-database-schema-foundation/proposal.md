# Fundação de Dados — Prisma, Schema & Migration Inicial (#04)

## Resumo

Configurar o Prisma 7+ contra PostgreSQL e modelar as entidades do domínio
(`Categoria`, `Produto`, `Cliente`, `Pedido`, `ItemPedido`, `Pagamento`) com seus
relacionamentos e enums de status, gerando a **migration inicial versionada** e um `seed`
de dados de desenvolvimento. Acesso a dados exclusivamente via Prisma (sem raw queries).

## Dimensionamento

- **Tamanho:** Médio — schema com 6 entidades, sem lógica de negócio.
- **Complexidade:** Média — relacionamentos e enums de status do pedido.
- **Risco:** Médio — schema é base de tudo; mudanças posteriores exigem migration.

## Escopo Funcional

### Backend
- `schema.prisma`: entidades conforme `docs/spec.md` (atributos e relações).
  - `Pedido.status` (enum: Novo, Pago, Preparacao, Faturado, Despachado, Entregue, Cancelado).
  - `Pagamento.status` (enum) e demais campos (valor, método, data, observação).
  - `Cliente.clerkUserId String? @unique` (vínculo de identidade — usado por #13).
  - **Sem** `tenant_id` ou qualquer artefato de tenancy (proibido no MVP).
- `DatabaseModule`/`PrismaService` com ciclo de vida gerenciado.
- Migration inicial versionada + `seed.ts` (categorias/produtos/admin de exemplo).
- Portabilidade: sem extensões específicas de fornecedor.

## Dependências

- #02 backend-core-platform.

## Riscos

- Erros de modelagem propagam para todos os módulos. Mitigação: revisão do schema + teste de migration.
- Dados sensíveis no seed. Mitigação: seed apenas para ambiente de desenvolvimento.

## Qualidade & Testes

### Linter
- `npm run lint` (backend) verde; `prisma format`/`validate` no schema.

### Testes Unitários
- `PrismaService` conecta/desconecta corretamente (mock/lifecycle).

### Testes de Integração
- Contra Postgres de teste (Docker): aplicar migration do zero e validar tabelas/constraints.
- Operações CRUD básicas por entidade respeitam unicidade (`Cliente.clerkUserId`, `Categoria.slug`).
- `seed` executa sem erro e popula dados esperados.

### Testes E2E
- Não se aplica.

## Definição de Pronto

- `prisma migrate` aplica do zero; seed funciona; CRUD básico validado por integração.
- Lint + unit + integração verdes; cobertura backend ≥ 80% no código tocado.

## Fora de Escopo

- Endpoints e regras de negócio (entram nas mudanças de cada módulo).
