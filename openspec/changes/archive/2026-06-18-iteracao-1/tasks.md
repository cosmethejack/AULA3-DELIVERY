## 1. Docker Compose

- [x] 1.1 Criar `docker-compose.yml` com serviço PostgreSQL 15+, volume persistente e variáveis de ambiente
- [x] 1.2 Adicionar arquivo `.env` na raiz com `DATABASE_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`

## 2. Prisma Schema

- [x] 2.1 Instalar Prisma 7+ como dependência no workspace backend
- [x] 2.2 Inicializar Prisma com `npx prisma init` apontando para `DATABASE_URL`
- [x] 2.3 Mapear entidade `Category` (id, nome, slug, ativo, timestamps)
- [x] 2.4 Mapear entidade `Product` (id, nome, descricao, preco, estoque, imagem, ativo, categoria, timestamps)
- [x] 2.5 Mapear entidade `Customer` (id, nome, endereco, email, telefone, ativo, timestamps)
- [x] 2.6 Mapear entidade `Order` (id, numero, cliente, enderecoEntrega, status, timestamps)
- [x] 2.7 Mapear entidade `OrderItem` (id, pedido, produto, precoUnitario, quantidade)
- [x] 2.8 Mapear entidade `Payment` (id, pedido, valor, metodo, data, status, observacao)

## 3. Migrations e Seed

- [x] 3.1 Gerar migration inicial com `prisma migrate dev --name init`
- [x] 3.2 (Opcional) Criar script de seed com categorias e produtos de exemplo
- [x] 3.3 Verificar `prisma generate` e conexão com banco

## 4. Qualidade

- [x] 4.1 Executar lint em todo o workspace
- [x] 4.2 Verificar `npm run build` no backend
