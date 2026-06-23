# Frontend — Dashboard Administrativo

## Resumo

Implementar o dashboard administrativo com autenticação (login via Clerk com formulários próprios), sidebar de navegação e páginas de gestão de pedidos, produtos, categorias, clientes e métricas.

## Risco

**Médio** — integração com Clerk, rotas protegidas, CRUDs administrativos, gráficos.

## Artefatos

### Autenticação

- `app/sign-in/page.tsx` — formulário de login próprio
- `AuthContext` / `useAuth` — token JWT em memória
- Clerk como BFF (backend consome Clerk — frontend nunca usa SDK Clerk)

### Páginas

- `app/(dashboard)/layout.tsx` — sidebar + proteção de rota
- `/dashboard/pedidos` — listagem + avançar status
- `/dashboard/produtos` — CRUD tabela
- `/dashboard/produtos/novo` — formulário criação
- `/dashboard/produtos/[id]/editar` — formulário edição
- `/dashboard/categorias` — CRUD categorias
- `/dashboard/clientes` — listagem CRUD
- `/dashboard/clientes/[id]` — detalhe + histórico
- `/dashboard/resumo` — métricas (StatsCard + SalesChart)

### Componentes

- `DataTable` — tabela reutilizável com paginação
- `OrderStatusBadge` — badge colorido por status
- `OrderCard` — card + ação de avançar status
- `StatsCard` — card de métrica
- `SalesChart` — gráfico de barras (zero dependências externas)

### Serviços

- `apiClient.ts` — `authedGet()` / `authedSend()` com token JWT
- `useAuthedData` — hook para dados protegidos
- Services admin: dashboard, catalog, orders, customers

## Dependências

- `iteracao 3` (endpoints protegidos + ClerkGuard + Dashboard)
- `iteracao 4` (base do frontend)

## Protótipos (Stitch)

Projeto: **DELIVERY** (ID: `projects/7259599975311263388`)

As telas devem ser geradas no Stitch a partir da especificação em `docs/spec.md`. Interfaces necessárias:

| Screen a Gerar | Relação |
|----------------|---------|
| Login | Formulário e-mail/senha |
| Dashboard Admin | Sidebar + métricas + gráfico |
| Gestão de Pedidos | Listagem + filtros + avançar status |
| Gestão de Produtos | Tabela CRUD |
| Gestão de Categorias | Tabela CRUD |
| Gestão de Clientes | Listagem + detalhe |

## Fora de Escopo

- Componentes oficiais do Clerk (proibido)
- Multi-tenancy
- Gestão de usuários (roles no Clerk)

## Tarefas Principais

1. Implementar página de login com formulário próprio
2. Criar `AuthContext` com gerenciamento de token
3. Criar `apiClient.ts` com injeção de token JWT
4. Criar layout do dashboard com sidebar + proteção
5. Implementar CRUD de categorias
6. Implementar CRUD de produtos
7. Implementar listagem de clientes + detalhe
8. Implementar listagem de pedidos + avançar status
9. Implementar dashboard com métricas e gráfico
10. Testes com Vitest + Testing Library
