# 📚 Documentação da API - Sistema de Gestão de Padaria

**Versão:** 1.0  
**Base URL:** `http://localhost:3000/api`  
**Autor:** Felipe  
**Data:** 27/10/2025

---

## 📋 Índice

1. [Tipos de Produto](#tipos-de-produto)
2. [Produtos](#produtos)
3. [Cargos](#cargos)
4. [Funcionários](#funcionários)
5. [Clientes](#clientes)
6. [Vendas](#vendas)
7. [Relatórios](#relatórios)
8. [Códigos de Status](#códigos-de-status)

---

## 🏷️ Tipos de Produto

### Listar Todos os Tipos
```http
GET /api/tipos-produto
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "ID_Tipo_Produto": 1,
      "Nome_Tipo": "Pães"
    }
  ]
}
```

---

### Buscar Tipo por ID
```http
GET /api/tipos-produto/:id
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "ID_Tipo_Produto": 1,
    "Nome_Tipo": "Pães"
  }
}
```

---

### Criar Novo Tipo
```http
POST /api/tipos-produto
```

**Request Body:**
```json
{
  "Nome_Tipo": "Bebidas"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Tipo de produto criado com sucesso",
  "data": {
    "ID_Tipo_Produto": 5,
    "Nome_Tipo": "Bebidas"
  }
}
```

**Validações:**
- ❌ Nome_Tipo obrigatório
- ❌ Nome_Tipo já existe

---

### Atualizar Tipo
```http
PUT /api/tipos-produto/:id
```

**Request Body:**
```json
{
  "Nome_Tipo": "Bebidas Geladas"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Tipo de produto atualizado com sucesso"
}
```

---

### Deletar Tipo
```http
DELETE /api/tipos-produto/:id
```

**Response 200:**
```json
{
  "success": true,
  "message": "Tipo de produto excluído com sucesso"
}
```

**Restrição:**
- ❌ Não pode deletar se houver produtos vinculados

---

## 🍞 Produtos

### Listar Todos os Produtos
```http
GET /api/produtos
```

**Query Parameters (opcionais):**
- `tipo` - Filtrar por ID do tipo
- `busca` - Buscar por nome (parcial)

**Exemplos:**
```
GET /api/produtos?tipo=1
GET /api/produtos?busca=pao
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "ID_Produto": 1,
      "Nome": "Pão Francês",
      "ID_Tipo_Produto": 1,
      "Nome_Tipo": "Pães",
      "Unidade_Medida": "unidade",
      "Preco_Base": 0.50,
      "Estoque_Atual": 100
    }
  ]
}
```

---

### Buscar Produto por ID
```http
GET /api/produtos/:id
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "ID_Produto": 1,
    "Nome": "Pão Francês",
    "ID_Tipo_Produto": 1,
    "Nome_Tipo": "Pães",
    "Unidade_Medida": "unidade",
    "Preco_Base": 0.50,
    "Estoque_Atual": 100
  }
}
```

---

### Criar Novo Produto
```http
POST /api/produtos
```

**Request Body:**
```json
{
  "Nome": "Pão Integral",
  "ID_Tipo_Produto": 1,
  "Unidade_Medida": "unidade",
  "Preco_Base": 0.80,
  "Estoque_Atual": 50
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Produto criado com sucesso",
  "data": {
    "ID_Produto": 11,
    "Nome": "Pão Integral",
    "ID_Tipo_Produto": 1,
    "Unidade_Medida": "unidade",
    "Preco_Base": 0.80,
    "Estoque_Atual": 50
  }
}
```

**Validações:**
- ✅ Nome obrigatório
- ✅ ID_Tipo_Produto obrigatório
- ✅ Unidade_Medida: "unidade", "kg" ou "fatia"
- ✅ Preco_Base > 0
- ✅ Estoque_Atual >= 0

---

### Atualizar Produto
```http
PUT /api/produtos/:id
```

**Request Body:**
```json
{
  "Nome": "Pão Integral Grande",
  "Preco_Base": 0.90,
  "Estoque_Atual": 60
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Produto atualizado com sucesso"
}
```

---

### Deletar Produto
```http
DELETE /api/produtos/:id
```

**Response 200:**
```json
{
  "success": true,
  "message": "Produto excluído com sucesso"
}
```

**Restrição:**
- ❌ Não pode deletar se houver vendas históricas

---

### Ajustar Estoque
```http
PATCH /api/produtos/:id/estoque
```

**Request Body:**
```json
{
  "quantidade": 50,
  "motivo": "Entrada de mercadoria"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Estoque ajustado com sucesso",
  "data": {
    "estoque_anterior": 100,
    "estoque_atual": 150
  }
}
```

---

## 👔 Cargos

### Listar Todos os Cargos
```http
GET /api/cargos
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "ID_Cargo": 1,
      "Nome_Cargo": "Atendente"
    }
  ]
}
```

---

### Criar Novo Cargo
```http
POST /api/cargos
```

**Request Body:**
```json
{
  "Nome_Cargo": "Supervisor"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Cargo criado com sucesso",
  "data": {
    "ID_Cargo": 5,
    "Nome_Cargo": "Supervisor"
  }
}
```

---

### Atualizar Cargo
```http
PUT /api/cargos/:id
```

---

### Deletar Cargo
```http
DELETE /api/cargos/:id
```

**Restrição:**
- ❌ Não pode deletar se houver funcionários vinculados

---

## 👥 Funcionários

### Listar Todos os Funcionários
```http
GET /api/funcionarios
```

**Query Parameters (opcionais):**
- `cargo` - Filtrar por ID do cargo

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "ID_Funcionario": 1,
      "Nome": "Maria Silva",
      "ID_Cargo": 2,
      "Nome_Cargo": "Caixa"
    }
  ]
}
```

---

### Buscar Funcionário por ID
```http
GET /api/funcionarios/:id
```

---

### Criar Novo Funcionário
```http
POST /api/funcionarios
```

**Request Body:**
```json
{
  "Nome": "João Santos",
  "ID_Cargo": 1
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Funcionário criado com sucesso",
  "data": {
    "ID_Funcionario": 5,
    "Nome": "João Santos",
    "ID_Cargo": 1
  }
}
```

**Validações:**
- ✅ Nome obrigatório
- ✅ ID_Cargo obrigatório
- ✅ Cargo deve existir

---

### Atualizar Funcionário
```http
PUT /api/funcionarios/:id
```

---

### Deletar Funcionário
```http
DELETE /api/funcionarios/:id
```

**Restrição:**
- ❌ Não pode deletar se houver vendas registradas

---

### Vendas por Funcionário
```http
GET /api/funcionarios/:id/vendas
```

**Query Parameters (opcionais):**
- `dataInicio` - Data início (YYYY-MM-DD)
- `dataFim` - Data fim (YYYY-MM-DD)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "funcionario": {
      "ID_Funcionario": 1,
      "Nome": "Maria Silva",
      "Nome_Cargo": "Caixa"
    },
    "estatisticas": {
      "total_vendas": 45,
      "valor_total": 1250.50,
      "ticket_medio": 27.79
    },
    "vendas": [
      {
        "ID_Venda": 1,
        "Data_Hora": "2025-10-27T10:30:00",
        "Cliente": "José Almeida",
        "Valor_Total": 35.00,
        "Tipo_Pagamento": "dinheiro"
      }
    ]
  }
}
```

---

## 👤 Clientes

### Listar Todos os Clientes
```http
GET /api/clientes
```

**Query Parameters (opcionais):**
- `status` - Filtrar por status ("bom", "medio", "ruim")
- `busca` - Buscar por nome ou telefone

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "ID_Cliente": 1,
      "Nome": "José Almeida",
      "Telefone": "(11) 98765-4321",
      "Status": "bom",
      "Limite_Fiado": 200.00,
      "Credito_Disponivel": 150.00,
      "Total_Em_Aberto": 50.00
    }
  ]
}
```

---

### Buscar Cliente por ID
```http
GET /api/clientes/:id
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "ID_Cliente": 1,
    "Nome": "José Almeida",
    "Telefone": "(11) 98765-4321",
    "Rua": "Rua das Flores",
    "Numero": "123",
    "Bairro": "Centro",
    "Cidade": "São Paulo",
    "CEP": "01234-567",
    "Status": "bom",
    "Limite_Fiado": 200.00,
    "Credito_Disponivel": 150.00,
    "Total_Em_Aberto": 50.00
  }
}
```

---

### Criar Novo Cliente
```http
POST /api/clientes
```

**Request Body:**
```json
{
  "Nome": "Ana Costa",
  "Telefone": "(11) 91234-5678",
  "Rua": "Av. Paulista",
  "Numero": "1000",
  "Bairro": "Bela Vista",
  "Cidade": "São Paulo",
  "CEP": "01310-100",
  "Status": "bom",
  "Limite_Fiado": 150.00
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Cliente criado com sucesso",
  "data": {
    "ID_Cliente": 6,
    "Nome": "Ana Costa",
    "Telefone": "(11) 91234-5678",
    "Status": "bom",
    "Limite_Fiado": 150.00
  }
}
```

**Validações:**
- ✅ Nome obrigatório
- ✅ Telefone obrigatório
- ✅ Status: "bom", "medio" ou "ruim"
- ✅ Limite_Fiado >= 0

---

### Atualizar Cliente
```http
PUT /api/clientes/:id
```

---

### Deletar Cliente
```http
DELETE /api/clientes/:id
```

**Restrição:**
- ❌ Não pode deletar se houver vendas registradas

---

### Histórico de Compras
```http
GET /api/clientes/:id/compras
```

**Query Parameters (opcionais):**
- `dataInicio` - Data início
- `dataFim` - Data fim

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "ID_Venda": 1,
      "Data_Hora": "2025-10-27T10:30:00",
      "Valor_Total": 35.00,
      "Tipo_Pagamento": "dinheiro",
      "Status": "finalizada"
    }
  ]
}
```

---

### Verificar Crédito Disponível
```http
GET /api/clientes/:id/credito
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "ID_Cliente": 1,
    "Nome": "José Almeida",
    "Limite_Fiado": 200.00,
    "Total_Em_Aberto": 50.00,
    "Credito_Disponivel": 150.00,
    "Status": "bom"
  }
}
```

---

## 🛒 Vendas

### Criar Nova Venda
```http
POST /api/vendas
```

**Request Body:**
```json
{
  "ID_Cliente": 1,
  "ID_Funcionario": 2,
  "Tipo_Pagamento": "fiado"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Venda criada com sucesso",
  "data": {
    "ID_Venda": 25,
    "ID_Cliente": 1,
    "ID_Funcionario": 2,
    "Tipo_Pagamento": "fiado",
    "Data_Hora": "2025-10-27T14:30:00",
    "Status": "pendente",
    "Valor_Total": 0.00
  }
}
```

**Validações:**
- ✅ ID_Cliente obrigatório
- ✅ ID_Funcionario obrigatório
- ✅ Tipo_Pagamento: "dinheiro", "cartao", "pix" ou "fiado"
- ✅ Se fiado: validar crédito disponível

---

### Adicionar Item à Venda
```http
POST /api/vendas/:id/itens
```

**Request Body:**
```json
{
  "ID_Produto": 1,
  "Quantidade": 10
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Item adicionado com sucesso",
  "data": {
    "ID_Item": 45,
    "ID_Produto": 1,
    "Nome_Produto": "Pão Francês",
    "Quantidade": 10,
    "Preco_Unitario": 0.50,
    "Subtotal": 5.00
  }
}
```

**Validações:**
- ✅ Produto existe
- ✅ Estoque disponível
- ✅ Quantidade > 0
- ✅ Venda não finalizada

---

### Atualizar Quantidade do Item
```http
PUT /api/vendas/:vendaId/itens/:itemId
```

**Request Body:**
```json
{
  "Quantidade": 15
}
```

---

### Remover Item da Venda
```http
DELETE /api/vendas/:vendaId/itens/:itemId
```

**Response 200:**
```json
{
  "success": true,
  "message": "Item removido com sucesso"
}
```

---

### Finalizar Venda
```http
PUT /api/vendas/:id/finalizar
```

**Response 200:**
```json
{
  "success": true,
  "message": "Venda finalizada com sucesso",
  "data": {
    "ID_Venda": 25,
    "Valor_Total": 45.50,
    "Status": "finalizada",
    "itens": [
      {
        "produto": "Pão Francês",
        "quantidade": 10,
        "subtotal": 5.00
      }
    ]
  }
}
```

**Validações Críticas:**
- ✅ Venda tem pelo menos 1 item
- ✅ Estoque disponível para todos os itens
- ✅ Se fiado: crédito suficiente
- ✅ Venda não está finalizada

**Ações Automáticas:**
- ⚙️ Atualiza estoque de todos os produtos
- ⚙️ Calcula valor total
- ⚙️ Muda status para "finalizada"

---

### Cancelar Venda
```http
DELETE /api/vendas/:id
```

**Response 200:**
```json
{
  "success": true,
  "message": "Venda cancelada com sucesso"
}
```

**Restrição:**
- ❌ Não pode cancelar venda finalizada

---

### Listar Todas as Vendas
```http
GET /api/vendas
```

**Query Parameters (opcionais):**
- `dataInicio` - Data início (YYYY-MM-DD)
- `dataFim` - Data fim (YYYY-MM-DD)
- `cliente` - ID do cliente
- `funcionario` - ID do funcionário
- `tipo_pagamento` - Forma de pagamento
- `status` - Status da venda

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "ID_Venda": 25,
      "Data_Hora": "2025-10-27T14:30:00",
      "Cliente": "José Almeida",
      "Funcionario": "Maria Silva",
      "Valor_Total": 45.50,
      "Tipo_Pagamento": "fiado",
      "Status": "finalizada"
    }
  ]
}
```

---

### Buscar Venda por ID
```http
GET /api/vendas/:id
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "ID_Venda": 25,
    "Data_Hora": "2025-10-27T14:30:00",
    "ID_Cliente": 1,
    "Cliente": "José Almeida",
    "ID_Funcionario": 2,
    "Funcionario": "Maria Silva",
    "Tipo_Pagamento": "fiado",
    "Valor_Total": 45.50,
    "Status": "finalizada",
    "itens": [
      {
        "ID_Item": 45,
        "ID_Produto": 1,
        "Produto": "Pão Francês",
        "Quantidade": 10,
        "Preco_Unitario": 0.50,
        "Subtotal": 5.00
      }
    ]
  }
}
```

---

## 📊 Relatórios

### Dashboard Geral
```http
GET /api/relatorios/dashboard
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "vendas_hoje": {
      "quantidade": 15,
      "valor_total": 450.50
    },
    "vendas_mes": {
      "quantidade": 120,
      "valor_total": 3500.00
    },
    "clientes": {
      "total": 25
    },
    "produtos": {
      "total": 30,
      "estoque_baixo": 5
    },
    "alertas": {
      "clientes_credito_excedido": 2,
      "fiado_em_aberto": {
        "quantidade": 8,
        "valor_total": 350.00
      }
    },
    "vendas_ultimos_7_dias": [
      {
        "data": "2025-10-27",
        "quantidade": 15,
        "total": "450.50"
      }
    ]
  }
}
```

---

### Vendas por Período
```http
GET /api/relatorios/vendas-periodo
```

**Query Parameters:**
- `dataInicio` - Data início (YYYY-MM-DD) **obrigatório**
- `dataFim` - Data fim (YYYY-MM-DD) **obrigatório**
- `agrupamento` - "dia", "semana" ou "mes" (padrão: "dia")

**Exemplo:**
```
GET /api/relatorios/vendas-periodo?dataInicio=2025-10-01&dataFim=2025-10-27&agrupamento=dia
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "Periodo": "2025-10-27",
      "Total_Vendas": 15,
      "Valor_Total": 450.50,
      "Ticket_Medio": 30.03,
      "Menor_Venda": 5.00,
      "Maior_Venda": 85.00
    }
  ]
}
```

---

### Produtos Mais Vendidos
```http
GET /api/relatorios/produtos-mais-vendidos
```

**Query Parameters (opcionais):**
- `dataInicio` - Data início
- `dataFim` - Data fim
- `limite` - Quantidade de produtos (padrão: 10)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "ID_Produto": 1,
      "Produto": "Pão Francês",
      "Tipo": "Pães",
      "Unidade_Medida": "unidade",
      "Total_Vendido": 500,
      "Quantidade_Vendas": 45,
      "Faturamento_Total": 250.00,
      "Preco_Medio": 0.50
    }
  ]
}
```

---

### Vendas por Forma de Pagamento
```http
GET /api/relatorios/vendas-por-forma-pagamento
```

**Query Parameters (opcionais):**
- `dataInicio` - Data início
- `dataFim` - Data fim

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "Tipo_Pagamento": "dinheiro",
      "Quantidade_Vendas": 45,
      "Valor_Total": 1250.00,
      "Ticket_Medio": 27.78,
      "Percentual_Quantidade": 37.50,
      "Percentual_Valor": 35.71
    }
  ]
}
```

---

### Desempenho de Funcionários
```http
GET /api/relatorios/desempenho-funcionarios
```

**Query Parameters (opcionais):**
- `dataInicio` - Data início
- `dataFim` - Data fim

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "ID_Funcionario": 2,
      "Funcionario": "Maria Silva",
      "Cargo": "Caixa",
      "Total_Vendas": 65,
      "Valor_Total_Vendido": 1850.50,
      "Ticket_Medio": 28.47,
      "Menor_Venda": 5.00,
      "Maior_Venda": 95.00
    }
  ]
}
```

---

### Clientes Devedores
```http
GET /api/relatorios/clientes-devedores
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "ID_Cliente": 3,
      "Cliente": "Carlos Souza",
      "Telefone": "(11) 99999-8888",
      "Status": "medio",
      "Limite_Fiado": 150.00,
      "Quantidade_Vendas_Abertas": 3,
      "Total_Em_Aberto": 120.00,
      "Credito_Disponivel": 30.00,
      "Venda_Mais_Antiga": "2025-10-15T10:30:00",
      "Dias_Mais_Antigo": 12
    }
  ]
}
```

---

### Produtos com Estoque Baixo
```http
GET /api/relatorios/produtos-estoque-baixo
```

**Query Parameters (opcionais):**
- `limite` - Estoque mínimo (padrão: 50)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "ID_Produto": 5,
      "Produto": "Croissant",
      "Tipo": "Confeitaria",
      "Unidade_Medida": "unidade",
      "Estoque_Atual": 15,
      "Preco_Base": 3.50,
      "Valor_Estoque": 52.50
    }
  ]
}
```

---

## 🔢 Códigos de Status

### Sucesso
- **200 OK** - Requisição bem-sucedida
- **201 Created** - Recurso criado com sucesso

### Erros do Cliente
- **400 Bad Request** - Dados inválidos
- **404 Not Found** - Recurso não encontrado
- **409 Conflict** - Conflito (ex: nome duplicado)

### Erros do Servidor
- **500 Internal Server Error** - Erro interno do servidor

---

## 📝 Padrão de Respostas

### Sucesso
```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { }
}
```

### Erro
```json
{
  "success": false,
  "error": "Descrição do erro",
  "details": { }
}
```

---

## 🔐 Validações Gerais

### Campos Monetários
- Sempre com 2 casas decimais
- Valores >= 0

### Datas
- Formato: YYYY-MM-DD para queries
- Formato ISO 8601 nas respostas

### Status de Venda
- `pendente` - Venda em andamento
- `finalizada` - Venda concluída

### Formas de Pagamento
- `dinheiro`
- `cartao`
- `pix`
- `fiado`

### Status de Cliente
- `bom`
- `medio`
- `ruim`

### Unidades de Medida
- `unidade`
- `kg`
- `fatia`

---

## ⚠️ Regras de Negócio Importantes

1. **Venda a Fiado:**
   - Só permitida se não exceder crédito disponível
   - Crédito = Limite - Total em aberto

2. **Estoque:**
   - Atualizado automaticamente ao finalizar venda
   - Não permitir venda sem estoque suficiente

3. **Deleções:**
   - Não permitir deletar registros com dependências
   - Sugestão: marcar como inativo

4. **Vendas:**
   - Vendas finalizadas não podem ser editadas
   - Vendas não finalizadas não afetam estoque/crédito

---

## 🧪 Testando a API

### Postman/Insomnia
1. Importe a collection
2. Configure a base URL
3. Teste os endpoints na ordem

### Ordem Sugerida de Testes:
1. Tipos de Produto
2. Produtos
3. Cargos
4. Funcionários
5. Clientes
6. Vendas (criar → adicionar itens → finalizar)
7. Relatórios

---

## 📞 Suporte

**Desenvolvedor:** Felipe Shimizu

**Portifólio:** https://www.devfelipeshimizu.me/

**GitHub:** https://github.com/Felipe-SMZ/bakery-system


---

**Última Atualização:** 27/10/2025