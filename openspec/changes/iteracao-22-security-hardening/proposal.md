# Endurecimento de Segurança — Rate Limit, CORS, Headers, IDOR (#22) — RNF-01

## Resumo

Aplicar as defesas transversais da arquitetura: **rate limiting**, **CORS por whitelist**,
**headers de segurança** (CSP, HSTS, X-Content-Type-Options) e uma **revisão de IDOR** sobre
os recursos sensíveis (pedidos, pagamentos, clientes). Consolida RNF-01 antes do encerramento.

## Dimensionamento

- **Tamanho:** Médio — múltiplas defesas de configuração + revisão focada.
- **Complexidade:** Média — limites por IP/usuário e CSP sem quebrar a UI.
- **Risco:** Médio — endurecer pode bloquear tráfego legítimo se mal calibrado.

## Escopo Funcional

### Backend
- Rate limiting: **100 req/min por IP** e **1000 req/min por usuário autenticado**.
- CORS com **whitelist explícita** de origens.
- Headers obrigatórios: **CSP**, **HSTS**, **X-Content-Type-Options: nosniff**.
- Revisão de **IDOR**: confirmar ownership em pedidos/pagamentos/clientes via identidade autenticada.
- Garantir HTTPS/TLS na borda (configuração de ambiente/infra).

## Dependências

- #05 identity-rbac-foundation, #15 cart-and-checkout (recursos sensíveis já existentes).

## Riscos

- CSP quebrar a UI. Mitigação: política testada em E2E + modo report antes de enforce.
- Rate limit barrar uso legítimo. Mitigação: limites conforme arquitetura + testes de limite.

## Qualidade & Testes

### Linter
- `npm run lint` (backend) verde.

### Testes Unitários
- Configuração de limites/headers monta valores esperados; resolução de chave (IP vs usuário) correta.

### Testes de Integração
- Supertest: estouro de rate limit → 429; headers de segurança presentes nas respostas; origem fora da whitelist bloqueada por CORS; acesso cross-cliente a recurso → 403/404 (IDOR).

### Testes E2E (Playwright)
- Fluxo principal (vitrine → checkout) continua funcionando com CSP/headers ativos (sem regressão).

## Definição de Pronto

- Defesas ativas sem regressão funcional; IDOR coberto por testes.
- Lint + unit + integração + E2E verdes; cobertura backend ≥ 80%.

## Fora de Escopo

- WAF, DDoS protection e gestão de segredos (infra/futuro).
