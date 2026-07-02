# API de Clientes (#12) — RF-05

## Resumo

Expor o CRUD de **clientes** no backend para o ADMIN (nome, endereço, e-mail, telefone,
ativo), com a regra de **desativação em vez de exclusão** quando houver pedidos associados.

## Dimensionamento

- **Tamanho:** Médio — CRUD com regra de integridade referencial.
- **Complexidade:** Média — bloqueio de exclusão e soft-delete.
- **Risco:** Baixo — protegido por RBAC e auditoria.

## Escopo Funcional

### Backend
- `POST/GET/GET:id/PATCH/DELETE /v1/customers` (ADMIN) com DTOs `class-validator`.
- Regras: cliente com pedidos associados **não pode ser removido** (apenas desativado);
  e-mail único; paginação e pesquisa textual.
- Auditoria de CUD (#06); erros RFC 9457.

## Dependências

- #04 database-schema-foundation, #05 identity-rbac-foundation, #06 audit-foundation.

## Riscos

- Exclusão indevida de cliente com histórico. Mitigação: bloqueio + teste sad path.

## Qualidade & Testes

### Linter
- `npm run lint` (backend) verde.

### Testes Unitários
- `CustomersService`: e-mail duplicado rejeitado; exclusão bloqueada quando há pedidos; desativação permitida.

### Testes de Integração
- Supertest: CRUD com RBAC (401/403/200); DELETE em cliente com pedido → 409; pesquisa/paginação.

### Testes E2E
- Não se aplica (UI em #14).

## Definição de Pronto

- CRUD com regra de integridade aplicada; RBAC e auditoria ativos.
- Lint + unit + integração verdes; cobertura backend ≥ 80%.

## Fora de Escopo

- Autocadastro/login do cliente (#13); CRM avançado (futuro).
