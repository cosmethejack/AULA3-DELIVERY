## Purpose

Dashboard administrativo do frontend: sidebar com navegação, CRUDs de categorias/produtos, gestão de pedidos e métricas.

## Requirements

### Requirement: Sidebar com Navegação Administrativa
O dashboard DEVE exibir sidebar escura com links para Pedidos, Produtos, Categorias, Clientes e Resumo. A sidebar colapsa em tablet.

#### Scenario: Proteção de rota
- **WHEN** usuário não autenticado tenta acessar /dashboard/*
- **THEN** sistema redireciona para /sign-in

### Requirement: CRUD de Categorias e Produtos
O dashboard DEVE permitir criar, listar, editar e remover categorias e produtos via `DataTable` com paginação.

#### Scenario: Editar produto
- **WHEN** admin clica "Editar" em um produto
- **THEN** formulário pré-preenchido é exibido e ao salvar a tabela é atualizada

### Requirement: Gestão de Pedidos com Avanço de Status
O dashboard DEVE listar pedidos com filtro por status e permitir avançar o status de cada pedido.

#### Scenario: Avançar status
- **WHEN** admin clica "Avançar" em um pedido
- **THEN** modal de confirmação é exibido e ao confirmar o status é atualizado

### Requirement: Métricas no Dashboard
A página /dashboard/resumo DEVE exibir StatsCards com vendas totais, recebido, pendente e gráfico de barras.

#### Scenario: Aplicar filtro de período
- **WHEN** admin seleciona período no filtro
- **THEN** métricas e gráfico são atualizados para o período selecionado
