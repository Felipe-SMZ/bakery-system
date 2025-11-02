# 🎨 DIAGRAMAS E FLUXOS - MÓDULO DE VENDAS

## 📊 ARQUITETURA GERAL

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │ NovaVenda   │  │   Vendas    │  │  Components │   │
│  │             │  │             │  │  - Button   │   │
│  │ - Formulário│  │ - Tabela    │  │  - Card     │   │
│  │ - Carrinho  │  │ - Filtros   │  │  - Modal    │   │
│  │ - Validações│  │ - Detalhes  │  │  - Loading  │   │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘   │
│         │                 │                            │
│         └────────┬────────┘                            │
│                  │                                     │
│         ┌────────▼────────┐                           │
│         │ vendaService.js │                           │
│         │                 │                           │
│         │ - listarVendas  │                           │
│         │ - criarVenda    │                           │
│         │ - buscarPorId   │                           │
│         │ - quitarFiado   │                           │
│         └────────┬────────┘                           │
│                  │                                     │
│         ┌────────▼────────┐                           │
│         │    api.js       │                           │
│         │   (Axios)       │                           │
│         └────────┬────────┘                           │
└──────────────────┼─────────────────────────────────────┘
                   │ HTTP
                   │
┌──────────────────▼─────────────────────────────────────┐
│                  BACKEND (Node.js)                     │
│                                                         │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Routes    │→ │ Controllers  │→ │   Services   │  │
│  │            │  │              │  │              │  │
│  │ GET /vendas│  │ listarTodas()│  │ listarVendas │  │
│  │ POST /venda│  │ criar()      │  │ criar()      │  │
│  │ GET /:id   │  │ buscarPorId()│  │ buscarPorId()│  │
│  │ PATCH /:id │  │ quitarFiado()│  │ quitarFiado()│  │
│  └────────────┘  └──────────────┘  └───────┬──────┘  │
│                                             │          │
│                                    ┌────────▼──────┐  │
│                                    │    Models     │  │
│                                    │               │  │
│                                    │ VendaModel    │  │
│                                    │ - criar()     │  │
│                                    │ - buscar()    │  │
│                                    │ - atualizar() │  │
│                                    └───────┬───────┘  │
│                                            │          │
└────────────────────────────────────────────┼──────────┘
                                             │
                                    ┌────────▼──────┐
                                    │   MySQL       │
                                    │               │
                                    │ - Venda       │
                                    │ - Item_Venda  │
                                    │ - Cliente     │
                                    │ - Produto     │
                                    └───────────────┘
```

---

## 🔄 FLUXO: CRIAR NOVA VENDA

```
USUÁRIO                 REACT                    SERVICE                  API                    BACKEND
   │                      │                         │                       │                        │
   │─── Acessa /nova ────>│                         │                       │                        │
   │                      │                         │                       │                        │
   │                      │─── useEffect ──────────>│                       │                        │
   │                      │                         │                       │                        │
   │                      │                         │─── GET /clientes ────>│                        │
   │                      │                         │                       │─── Buscar BD ─────────>│
   │                      │                         │<──── Array ───────────│<────── Rows ──────────│
   │                      │<──── setClientes ───────│                       │                        │
   │                      │                         │                       │                        │
   │<─── Mostra form ─────│                         │                       │                        │
   │                      │                         │                       │                        │
   │                      │                         │                       │                        │
   │─ Seleciona cliente ─>│                         │                       │                        │
   │─ Seleciona func ────>│                         │                       │                        │
   │─ Seleciona forma ───>│                         │                       │                        │
   │                      │                         │                       │                        │
   │─ Adiciona produto ──>│                         │                       │                        │
   │                      │                         │                       │                        │
   │                      │─ Valida estoque         │                       │                        │
   │                      │─ Calcula subtotal       │                       │                        │
   │                      │─ Adiciona carrinho      │                       │                        │
   │                      │                         │                       │                        │
   │<─ Atualiza UI ───────│                         │                       │                        │
   │                      │                         │                       │                        │
   │─ Finalizar venda ───>│                         │                       │                        │
   │                      │                         │                       │                        │
   │                      │─ Valida form            │                       │                        │
   │                      │                         │                       │                        │
   │                      │─── criarVenda(dados) ──>│                       │                        │
   │                      │                         │                       │                        │
   │                      │                         │─── POST /vendas ─────>│                        │
   │                      │                         │                       │                        │
   │                      │                         │                       │─ Valida cliente ──────>│
   │                      │                         │                       │─ Valida funcionario ──>│
   │                      │                         │                       │─ Valida estoque ──────>│
   │                      │                         │                       │─ Busca preços ────────>│
   │                      │                         │                       │─ Valida crédito ──────>│
   │                      │                         │                       │                        │
   │                      │                         │                       │─ BEGIN TRANSACTION ───>│
   │                      │                         │                       │─ INSERT Venda ────────>│
   │                      │                         │                       │─ INSERT Item_Venda ───>│
   │                      │                         │                       │─ UPDATE Estoque ──────>│
   │                      │                         │                       │─ COMMIT ──────────────>│
   │                      │                         │                       │                        │
   │                      │                         │<──── Venda criada ────│<────── ID + dados ────│
   │                      │<──── return venda ──────│                       │                        │
   │                      │                         │                       │                        │
   │<─ Mensagem sucesso ──│                         │                       │                        │
   │                      │                         │                       │                        │
   │<─ Redireciona ───────│                         │                       │                        │
   │     /vendas          │                         │                       │                        │
```

---

## 🛒 FLUXO: ADICIONAR ITEM AO CARRINHO

```
┌─────────────────────────────────────────────────────────┐
│ 1. USUÁRIO SELECIONA PRODUTO                            │
│    produtoSelecionado = "5"                             │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│ 2. USUÁRIO INFORMA QUANTIDADE                           │
│    quantidade = "10"                                    │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│ 3. USUÁRIO CLICA "ADICIONAR"                            │
│    onClick={adicionarItem}                              │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│ 4. VALIDAÇÃO: Produto selecionado?                      │
│    if (!produtoSelecionado) → ERRO                      │
└─────────────────┬───────────────────────────────────────┘
                  ↓ SIM
┌─────────────────────────────────────────────────────────┐
│ 5. VALIDAÇÃO: Quantidade válida?                        │
│    if (qtd <= 0) → ERRO                                 │
└─────────────────┬───────────────────────────────────────┘
                  ↓ SIM
┌─────────────────────────────────────────────────────────┐
│ 6. BUSCAR DADOS DO PRODUTO                              │
│    produto = produtos.find(p => p.ID === produtoId)    │
│                                                          │
│    Resultado:                                           │
│    {                                                     │
│      ID_Produto: 5,                                     │
│      Nome: "Pão Francês",                               │
│      Preco_Base: 0.50,                                  │
│      Estoque_Atual: 100                                 │
│    }                                                     │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│ 7. VALIDAÇÃO: Estoque suficiente?                       │
│    if (10 > 100) → NÃO                                  │
│    OK! Tem estoque                                      │
└─────────────────┬───────────────────────────────────────┘
                  ↓ SIM
┌─────────────────────────────────────────────────────────┐
│ 8. VALIDAÇÃO: Produto já no carrinho?                   │
│    jaExiste = carrinho.find(item => item.id === 5)     │
│    → Não encontrado                                     │
└─────────────────┬───────────────────────────────────────┘
                  ↓ NÃO
┌─────────────────────────────────────────────────────────┐
│ 9. CRIAR OBJETO DO ITEM                                 │
│    novoItem = {                                         │
│      id_produto: 5,                                     │
│      nome: "Pão Francês",                               │
│      quantidade: 10,                                    │
│      preco_unitario: 0.50,                              │
│      subtotal: 10 × 0.50 = 5.00                         │
│    }                                                     │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│ 10. ADICIONAR AO CARRINHO (SPREAD OPERATOR)             │
│     setItensCarrinho([...itensCarrinho, novoItem])     │
│                                                          │
│     Antes: []                                           │
│     Depois: [novoItem]                                  │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│ 11. LIMPAR CAMPOS                                       │
│     setProdutoSelecionado('')                           │
│     setQuantidade('')                                   │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│ 12. REACT RE-RENDERIZA                                  │
│     - Carrinho atualizado na tela                       │
│     - Total recalculado                                 │
│     - Campos limpos                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 💾 FLUXO: FINALIZAR VENDA

```
┌──────────────────────────────────────────┐
│ ESTADO ANTES DE FINALIZAR                │
│                                          │
│ clienteSelecionado: "3"                  │
│ funcionarioSelecionado: "2"              │
│ tipoPagamento: "dinheiro"                │
│ itensCarrinho: [                         │
│   { id_produto: 5, quantidade: 10 },    │
│   { id_produto: 8, quantidade: 2 }      │
│ ]                                        │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│ VALIDAÇÕES (Frontend)                    │
│                                          │
│ ✅ Cliente selecionado?                  │
│ ✅ Funcionário selecionado?              │
│ ✅ Tem itens no carrinho?                │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│ MONTAR OBJETO PARA ENVIAR                │
│                                          │
│ dadosVenda = {                           │
│   id_cliente: 3,                         │
│   id_funcionario: 2,                     │
│   tipo_pagamento: "dinheiro",            │
│   itens: [                               │
│     { id_produto: 5, quantidade: 10 },  │
│     { id_produto: 8, quantidade: 2 }    │
│   ]                                      │
│ }                                        │
│                                          │
│ ⚠️ NÃO envia preço!                      │
│    Backend busca do banco                │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│ ENVIAR PARA API                          │
│                                          │
│ POST /vendas                             │
│ Body: dadosVenda                         │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│ BACKEND: VALIDAÇÕES                      │
│                                          │
│ 1. Cliente existe? → Sim (ID 3)         │
│ 2. Funcionário existe? → Sim (ID 2)     │
│ 3. Produto 5 existe? → Sim              │
│ 4. Estoque produto 5? → 100 (OK!)       │
│ 5. Produto 8 existe? → Sim              │
│ 6. Estoque produto 8? → 50 (OK!)        │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│ BACKEND: BUSCAR PREÇOS ATUAIS            │
│                                          │
│ SELECT Preco_Base FROM Produto           │
│ WHERE ID_Produto IN (5, 8)              │
│                                          │
│ Resultado:                               │
│ - Produto 5: R$ 0,50                    │
│ - Produto 8: R$ 15,00                   │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│ BACKEND: CALCULAR TOTAL                  │
│                                          │
│ Item 1: 10 × R$ 0,50 = R$ 5,00         │
│ Item 2: 2 × R$ 15,00 = R$ 30,00        │
│ ────────────────────────────────────     │
│ TOTAL: R$ 35,00                         │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│ BACKEND: TRANSAÇÃO                       │
│                                          │
│ BEGIN TRANSACTION;                       │
│                                          │
│ 1️⃣ INSERT INTO Venda                     │
│    VALUES (3, 2, 'dinheiro', 35.00)     │
│    → ID gerado: 15                      │
│                                          │
│ 2️⃣ INSERT INTO Item_Venda                │
│    VALUES (15, 5, 10, 0.50)             │
│                                          │
│ 3️⃣ INSERT INTO Item_Venda                │
│    VALUES (15, 8, 2, 15.00)             │
│                                          │
│ 4️⃣ UPDATE Produto                        │
│    SET Estoque_Atual = 90               │
│    WHERE ID_Produto = 5                 │
│                                          │
│ 5️⃣ UPDATE Produto                        │
│    SET Estoque_Atual = 48               │
│    WHERE ID_Produto = 8                 │
│                                          │
│ COMMIT; ✅                               │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│ BACKEND: RETORNAR VENDA CRIADA           │
│                                          │
│ {                                        │
│   success: true,                         │
│   message: "Venda realizada",            │
│   data: {                                │
│     ID_Venda: 15,                        │
│     Cliente: "João Silva",               │
│     Funcionario: "Maria Santos",         │
│     Valor_Total: 35.00,                  │
│     itens: [...]                         │
│   }                                      │
│ }                                        │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│ FRONTEND: PROCESSAR RESPOSTA             │
│                                          │
│ setSucesso("Venda registrada!")          │
│                                          │
│ setTimeout(() => {                       │
│   navigate('/vendas')                    │
│ }, 2000)                                 │
└──────────────┬───────────────────────────┘
               ↓
┌──────────────────────────────────────────┐
│ USUÁRIO VÊ:                              │
│                                          │
│ ✅ "Venda registrada com sucesso!"       │
│ ⏳ Aguardando 2 segundos...               │
│ 🔄 Redirecionando para /vendas           │
└──────────────────────────────────────────┘
```

---

## 📊 ESTADO DO COMPONENTE (NovaVenda)

```
┌─────────────────────────────────────────────────────────┐
│                    ESTADO (State)                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  DADOS DA VENDA:                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │ clienteSelecionado: ""                          │   │
│  │ funcionarioSelecionado: ""                      │   │
│  │ tipoPagamento: "dinheiro"                       │   │
│  │ itensCarrinho: []                               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ADICIONAR PRODUTO:                                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │ produtoSelecionado: ""                          │   │
│  │ quantidade: ""                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  LISTAS DA API:                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ clientes: []                                    │   │
│  │ funcionarios: []                                │   │
│  │ produtos: []                                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  CONTROLES:                                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │ loading: true                                   │   │
│  │ salvando: false                                 │   │
│  │ erro: ""                                        │   │
│  │ sucesso: ""                                     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘

EXEMPLO APÓS USUÁRIO PREENCHER:

┌─────────────────────────────────────────────────────────┐
│ clienteSelecionado: "3"                                 │
│ funcionarioSelecionado: "2"                             │
│ tipoPagamento: "dinheiro"                               │
│ itensCarrinho: [                                        │
│   {                                                     │
│     id_produto: 5,                                      │
│     nome: "Pão Francês",                                │
│     quantidade: 10,                                     │
│     preco_unitario: 0.50,                               │
│     subtotal: 5.00,                                     │
│     unidade: "unidade"                                  │
│   },                                                    │
│   {                                                     │
│     id_produto: 8,                                      │
│     nome: "Bolo de Chocolate",                          │
│     quantidade: 1,                                      │
│     preco_unitario: 25.00,                              │
│     subtotal: 25.00,                                    │
│     unidade: "unidade"                                  │
│   }                                                     │
│ ]                                                       │
│                                                         │
│ TOTAL CALCULADO: R$ 30,00                               │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 FLUXOGRAMA: DECISÕES NO CÓDIGO

```
                      ADICIONAR ITEM
                           │
                           ▼
                 ┌─────────────────┐
                 │ Produto          │ NÃO
                 │ selecionado?     ├────→ ERRO
                 └────────┬─────────┘
                       SIM│
                          ▼
                 ┌─────────────────┐
                 │ Quantidade       │ NÃO
                 │ válida (> 0)?    ├────→ ERRO
                 └────────┬─────────┘
                       SIM│
                          ▼
                 ┌─────────────────┐
                 │ Produto          │ NÃO
                 │ encontrado?      ├────→ ERRO
                 └────────┬─────────┘
                       SIM│
                          ▼
                 ┌─────────────────┐
                 │ Estoque          │ NÃO
                 │ suficiente?      ├────→ ERRO
                 └────────┬─────────┘
                       SIM│
                          ▼
                 ┌─────────────────┐
                 │ Já no            │ SIM
                 │ carrinho?        ├────→ ERRO
                 └────────┬─────────┘
                       NÃO│
                          ▼
                 ┌─────────────────┐
                 │ ADICIONAR        │
                 │ AO CARRINHO      │
                 └────────┬─────────┘
                          ▼
                 ┌─────────────────┐
                 │ LIMPAR           │
                 │ CAMPOS           │
                 └────────┬─────────┘
                          ▼
                      SUCESSO!
```

---

## 📱 INTERFACE: COMPONENTES

```
┌───────────────────────────────────────────────────────┐
│                    NovaVenda.jsx                      │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │ CABEÇALHO                                       │ │
│  │ "Nova Venda"                    [Voltar]        │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │ MENSAGENS                                       │ │
│  │ ⚠️ [Erro se houver]                             │ │
│  │ ✅ [Sucesso se houver]                          │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ┌────────────────────┬────────────────────────────┐ │
│  │ CARD: Dados Venda  │ CARD: Carrinho             │ │
│  │                    │                            │ │
│  │ [Cliente ▼]        │ 📋 Itens:                  │ │
│  │ [Funcionário ▼]    │                            │ │
│  │ [Pagamento ▼]      │ • Pão Francês              │ │
│  │                    │   10 × R$ 0,50    [🗑️]     │ │
│  │ ───────────────    │   R$ 5,00                  │ │
│  │                    │                            │ │
│  │ Adicionar Produto: │ • Bolo                     │ │
│  │ [Produto ▼]        │   1 × R$ 25,00    [🗑️]     │ │
│  │ [Quantidade]       │   R$ 25,00                 │ │
│  │ [➕ Adicionar]     │                            │ │
│  │                    │ ──────────────────────      │ │
│  │                    │ TOTAL: R$ 30,00            │ │
│  │                    │ [✅ Finalizar Venda]       │ │
│  └────────────────────┴────────────────────────────┘ │
└───────────────────────────────────────────────────────┘
```

```
┌───────────────────────────────────────────────────────┐
│                     Vendas.jsx                        │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │ CABEÇALHO                                       │ │
│  │ "Vendas"                     [➕ Nova Venda]    │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │ CARD: Filtros                                   │ │
│  │ [Data Início] [Data Fim] [Pagamento ▼]         │ │
│  │ [🔍 Filtrar]  [🔄 Limpar]                       │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │ CARD: Vendas (15)                               │ │
│  │                                                 │ │
│  │ ┌─────────────────────────────────────────────┐ │ │
│  │ │ ID │ Data     │ Cliente │ Pgto │ Valor │ ⚙️  │ │ │
│  │ ├────┼──────────┼─────────┼──────┼───────┼────┤ │ │
│  │ │ 15 │ 02/11 14h│ João    │💵 Din│ 30,00 │👁️💰│ │ │
│  │ │ 14 │ 02/11 10h│ Maria   │📋 Fia│ 50,00 │👁️💰│ │ │
│  │ │ 13 │ 01/11 18h│ Carlos  │💳 Car│ 80,00 │👁️  │ │ │
│  │ └─────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────┘
```

---

## 🎨 CORES E BADGES

```
FORMAS DE PAGAMENTO:

┌──────────────────────┐
│ 💵 DINHEIRO          │  bg-green-100 text-green-800
└──────────────────────┘

┌──────────────────────┐
│ 💳 CARTÃO            │  bg-blue-100 text-blue-800
└──────────────────────┘

┌──────────────────────┐
│ 📱 PIX               │  bg-purple-100 text-purple-800
└──────────────────────┘

┌──────────────────────┐
│ 📋 FIADO             │  bg-yellow-100 text-yellow-800
└──────────────────────┘


STATUS DE PAGAMENTO:

┌──────────────────────┐
│ PAGO                 │  bg-green-100 text-green-800
└──────────────────────┘

┌──────────────────────┐
│ EM ABERTO            │  bg-red-100 text-red-800
└──────────────────────┘

┌──────────────────────┐
│ QUITADO              │  bg-blue-100 text-blue-800
└──────────────────────┘
```

---

**Use estes diagramas na sua apresentação! 📊✨**
