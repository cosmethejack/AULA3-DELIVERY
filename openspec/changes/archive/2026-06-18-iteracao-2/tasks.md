## 1. CatalogModule

- [ ] 1.1 Criar `CatalogModule` com `CategoriesController` + `CategoriesService`
- [ ] 1.2 Implementar DTOs com `class-validator` para criação e edição de categorias
- [ ] 1.3 Implementar validação de slug único (retornar 409 Conflict)
- [ ] 1.4 Criar `ProductsController` + `ProductsService`
- [ ] 1.5 Implementar DTOs para produtos com validação de preço e estoque
- [ ] 1.6 Adicionar paginação (`?page=1&limit=20`) nas listagens

## 2. CustomersModule

- [ ] 2.1 Criar `CustomersModule` com CRUD
- [ ] 2.2 Implementar soft delete (clientes com pedidos não são excluídos)

## 3. Tratamento de Erros

- [ ] 3.1 Implementar exception filters RFC 9457 para erros comuns
- [ ] 3.2 Implementar pagination DTO genérico

## 4. Testes

- [ ] 4.1 Testes unitários para CategoriesService e ProductsService
- [ ] 4.2 Testes de integração para endpoints de catálogo
- [ ] 4.3 Testes de integração para endpoints de clientes
- [ ] 4.4 Verificar cobertura ≥ 80%
