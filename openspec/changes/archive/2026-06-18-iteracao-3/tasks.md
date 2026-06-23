## 1. Auditoria

- [x] 1.1 Adicionar modelo AuditLog no schema Prisma (id, usuario, objeto, acao, payloadAnterior, payloadNovo, timestamp)
- [x] 1.2 Gerar migration Prisma
- [x] 1.3 Criar AuditService com método `log(usuario, objeto, acao, payloadAnterior?, payloadNovo?)`
- [x] 1.4 Criar AuditModule e registrar no AppModule

## 2. Auth — ClerkGuard e RBAC

- [x] 2.1 Instalar dependência `jose` para validação JWKS
- [x] 2.2 Implementar ClerkGuard com validação de JWT contra JWKS do Clerk
- [x] 2.3 Implementar decorator `@Roles(ADMIN, CUSTOMER)` para RBAC
- [x] 2.4 Extrair role e userId do token validado e propagar via request
- [x] 2.5 Criar AuthModule com ClerkGuard providers

## 3. OrdersModule

- [x] 3.1 Criar OrdersModule com estrutura de controller, service, DTOs
- [x] 3.2 Implementar máquina de estados (Novo → Pago → Preparação → Faturado → Despachado → Entregue + Cancelado)
- [x] 3.3 Implementar validação de estoque na criação do pedido
- [x] 3.4 Implementar endpoints: POST /v1/orders, GET /v1/orders, GET /v1/orders/:id
- [x] 3.5 Implementar PATCH /v1/orders/:id/status com validação de transição

## 4. PaymentsModule

- [x] 4.1 Criar PaymentsModule com registro manual de pagamento
- [x] 4.2 Implementar POST /v1/orders/:id/payments (admin) com validação de estado

## 5. DashboardModule

- [x] 5.1 Criar DashboardModule com endpoint GET /v1/dashboard/summary
- [x] 5.2 Implementar métricas: vendas do dia/semana/mês, pedidos por status, top 5 produtos

## 6. Integração e Configuração

- [x] 6.1 Registrar todos os módulos no AppModule
- [x] 6.2 Configurar interceptador de auditoria para operações CUD
- [x] 6.3 Adicionar ClerkGuard global ou por rota
- [x] 6.4 Configurar erros RFC 9457 nos controllers

## 7. Testes

- [x] 7.1 Testes unitários do AuditService (happy/sad/edge)
- [x] 7.2 Testes unitários do ClerkGuard (token válido, inválido, expirado)
- [x] 7.3 Testes unitários do OrdersService (máquina de estados, validação estoque, cancelamento)
- [x] 7.4 Testes unitários do DashboardService (agregações, período vazio)
- [x] 7.5 Testes de integração dos endpoints de orders e payments
- [x] 7.6 Verificar cobertura ≥ 80% (95.89%)
