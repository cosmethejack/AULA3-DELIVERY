## Context

Dashboard administrativo com sidebar escura, CRUDs de pedidos/produtos/categorias/clientes, métricas e gráfico de vendas. Autenticação via Clerk (BFF — frontend nunca usa SDK Clerk).

## Goals / Non-Goals

**Goals:**
- Página de login com formulário próprio (`/sign-in`)
- `AuthContext` com gerenciamento de token JWT em memória
- Layout dashboard com sidebar + proteção de rota
- `DataTable` reutilizável com paginação
- CRUD de categorias, produtos, clientes
- Gestão de pedidos com avanço de status
- Dashboard com `StatsCard` + `SalesChart` (zero dependências externas)
- `apiClient.ts` com injeção de token JWT

**Non-Goals:**
- SDKs/componentes oficiais do Clerk
- Multi-tenancy
- Gestão de usuários/roles (feito no Clerk)

## Decisions

| Decisão | Alternativa | Rationale |
|---------|-------------|-----------|
| Formulário de login próprio vs Clerk hosted UI | Clerk hosted | Proibido SDK Clerk; frontend → backend → Clerk |
| Token JWT em memória vs cookie | Cookie | Memória é suficiente para SPA; cookie traz complexidade CSRF |
| `DataTable` próprio vs shadcn/ui | shadcn/ui | Mínimo de dependências; componente próprio evita vendor lock |
| Gráfico com CSS puro vs chart.js/recharts | chart.js | Zero dependências externas para métricas simples |

## Risks / Trade-offs

- [Token] Perdido ao recarregar página → redirect para login; refresh token via backend
- [CSRF] Formulários sem proteção → implementar token CSRF ou SameSite
- [Sidebar] Largura mínima de 240px em desktop → colapsar em tablet
