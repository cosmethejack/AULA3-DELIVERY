## 1. Backend

- [ ] 1.1 Escopar `findAll`: CUSTOMER → pedidos do Customer do token; ADMIN → todos
- [ ] 1.2 Paginação (`?page=1&limit=20`) na listagem
- [ ] 1.3 Índice em `Order.clienteId` (migration), se necessário

## 2. Frontend

- [ ] 2.1 Página "Meus Pedidos" (número, status, total, link para acompanhamento)
- [ ] 2.2 Navegação no cabeçalho (visível quando autenticado)

## 3. Testes

- [ ] 3.1 Integração: cliente vê apenas os próprios pedidos
- [ ] 3.2 Paginação e estado vazio (edge)
- [ ] 3.3 Verificar cobertura ≥ 80% backend / 70% frontend
