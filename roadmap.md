# Roadmap de Implementação — DELIVERY

## Visão Geral

8 mudanças incrementais organizadas por camada e dependência, cada uma com risco ≤ médio. Os protótipos de interface estão no projeto Stitch **DELIVERY** (ID: `projects/7259599975311263388`) e devem ser gerados a partir da especificação em `docs/spec.md`.

## Dependências

```
iteracao 1 ────────────────────────────────────────────────────────────┐
                                                                        │
iteracao 2 ──── iteracao 3 ────────────────────────────────────────────┤
                                                                        │
iteracao 4 ────────────────────────────────────────────────────────────┤
                                                                        │
iteracao 5 ──── iteracao 6 ────────────────────────────────────────────┤
                                                                        │
iteracao 7 ────────────────────────────────────────────────────────────┤
                                                                        │
iteracao 8 ────────────────────────────────────────────────────────────┘
```

## Sequência Recomendada

| # | Mudança | Risco | Depende de | Stitch Screens |
|   |---------|-------|------------|----------------|
| 1 | **iteracao 1** (infra-banco) | Pequeno | — | N/A |
| 2 | **iteracao 2** (backend-modulos) | Médio | iteracao 1 | A gerar no Stitch |
| 3 | **iteracao 3** (backend-pedidos-auth) | Médio | iteracao 2 | A gerar no Stitch |
| 4 | **iteracao 4** (frontend-vitrine) | Médio | iteracao 3 | A gerar no Stitch |
| 5 | **iteracao 5** (frontend-admin) | Médio | iteracao 3, iteracao 4 | A gerar no Stitch |
| 6 | **iteracao 6** (frontend-tracking) | Pequeno | iteracao 3, iteracao 5 | A gerar no Stitch |
| 7 | **iteracao 7** (infra-observabilidade) | Pequeno | iteracao 1 | N/A |
| 8 | **iteracao 8** (infra-ci-cd) | Médio | iteracao 1–7 | N/A |

## Alinhamento com Requisitos

| RF | Nome | Mudanças | Stitch |
|----|------|----------|--------|
| RF-01 | Vitrine de Produtos | iteracao 2, iteracao 4 | A gerar |
| RF-02 | Criação e Acompanhamento de Pedidos | iteracao 3, iteracao 4, iteracao 6 | A gerar |
| RF-03 | Gestão de Categorias | iteracao 2, iteracao 5 | A gerar |
| RF-04 | Gestão de Produtos | iteracao 2, iteracao 5 | A gerar |
| RF-05 | Gestão de Clientes | iteracao 3, iteracao 5 | A gerar |
| RF-06 | Gestão de Pedidos | iteracao 3, iteracao 5 | A gerar |
| RF-07 | Dashboard | iteracao 3, iteracao 5 | A gerar |

## Critérios de Qualidade (aplicam-se a todas as mudanças)

- Cobertura: backend ≥ 80%, frontend ≥ 70%
- Happy Path + Sad Path + Edge Cases
- Lint zero, build zero, testes verdes
- Auditoria em operações CUD críticas
- Erros seguem RFC 9457
- Proibido console.log() — logging estruturado
- Proibido SDKs/componentes oficiais do Clerk no frontend
