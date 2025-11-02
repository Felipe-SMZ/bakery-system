# 📚 GUIA DIDÁTICO: SISTEMA DE VENDAS

Este documento explica de forma **detalhada e educativa** como funciona o módulo de vendas do sistema.

---

## 📑 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Service Layer (vendaService.js)](#service-layer)
4. [Componente NovaVenda.jsx](#componente-novavenda)
5. [Componente Vendas.jsx](#componente-vendas)
6. [Fluxo Completo de uma Venda](#fluxo-completo)
7. [Conceitos Importantes](#conceitos-importantes)
8. [Dicas para Aprendizado](#dicas-para-aprendizado)

---

## 🎯 VISÃO GERAL

### O que o módulo de vendas faz?

O módulo de vendas permite:
- ✅ Registrar novas vendas com múltiplos produtos
- ✅ Listar todas as vendas com filtros
- ✅ Visualizar detalhes completos de cada venda
- ✅ Quitar vendas a fiado
- ✅ Validar estoque automaticamente
- ✅ Validar crédito do cliente (para fiados)
- ✅ Usar transações no banco (tudo ou nada)

### Estrutura de Arquivos

```
frontend/src/
├── services/
│   └── vendaService.js        ← Comunicação com a API
├── pages/
│   ├── NovaVenda.jsx          ← Tela de registrar venda
│   └── Vendas.jsx             ← Tela de listar vendas
└── components/
    └── common/
        ├── Button.jsx         ← Botões reutilizáveis
        ├── Card.jsx           ← Cards reutilizáveis
        ├── Modal.jsx          ← Modais reutilizáveis
        └── Loading.jsx        ← Indicador de carregamento
```

---

## 🏗️ ARQUITETURA DO SISTEMA

### 1. Camadas da Aplicação

```
┌─────────────────────────────────────────┐
│  FRONTEND (React)                       │
├─────────────────────────────────────────┤
│  Páginas (NovaVenda.jsx, Vendas.jsx)   │  ← Interface do usuário
│           ↕                             │
│  Services (vendaService.js)             │  ← Comunicação com API
│           ↕                             │
│  API (Axios)                            │  ← HTTP Requests
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│  BACKEND (Node.js + Express)            │
├─────────────────────────────────────────┤
│  Routes (vendaRoutes.js)                │  ← Define endpoints
│           ↕                             │
│  Controllers (vendaController.js)       │  ← Lógica de controle
│           ↕                             │
│  Services (vendaService.js)             │  ← Regras de negócio
│           ↕                             │
│  Models (vendaModel.js)                 │  ← Acesso ao banco
│           ↕                             │
│  Database (MySQL)                       │  ← Armazenamento
└─────────────────────────────────────────┘
```

### 2. Por que essa arquitetura?

**Separação de Responsabilidades:**
- **Páginas**: Cuidam da interface e interação com usuário
- **Services**: Isolam a comunicação com a API
- **Backend**: Valida, processa e salva dados

**Benefícios:**
- ✅ Código organizado e fácil de manter
- ✅ Se a API mudar, só mexemos no Service
- ✅ Componentes reutilizáveis
- ✅ Testes mais fáceis

---

## 🔌 SERVICE LAYER

### O que é o vendaService.js?

É o arquivo que **conversa com a API**. Ele tem todas as funções para:
- Listar vendas
- Criar vendas
- Buscar detalhes
- Quitar fiados

### Anatomia de uma função do service

```javascript
export const listarVendas = async (filtros = {}) => {
    try {
        // 1️⃣ Faz requisição HTTP para a API
        const response = await api.get('/vendas', { 
            params: filtros 
        });
        
        // 2️⃣ Retorna apenas os dados úteis
        return response.data.data;
        
    } catch (error) {
        // 3️⃣ Loga erro e repassa para quem chamou
        console.error('❌ Erro ao listar vendas:', error);
        throw error;
    }
};
```

**Explicação linha por linha:**

1. **`export const`**: Exporta a função para ser usada em outros arquivos
2. **`async`**: Função assíncrona (espera resposta da API)
3. **`try/catch`**: Tenta executar o código, se der erro, captura
4. **`await api.get()`**: Espera a API responder
5. **`params: filtros`**: Envia filtros como query params (?cliente=1&...)
6. **`response.data.data`**: Acessa os dados dentro da resposta
7. **`throw error`**: Repassa o erro para quem chamou tratar

### Funções Disponíveis

| Função | Descrição | Exemplo |
|--------|-----------|---------|
| `listarVendas(filtros)` | Lista vendas com filtros opcionais | `await listarVendas({ tipo_pagamento: 'fiado' })` |
| `buscarVendaPorId(id)` | Busca venda específica com itens | `await buscarVendaPorId(5)` |
| `criarVenda(dados)` | Registra nova venda | `await criarVenda({ id_cliente: 1, ... })` |
| `quitarVendaFiado(id)` | Quita venda a fiado | `await quitarVendaFiado(10)` |
| `listarFiadoEmAberto()` | Lista vendas a fiado não quitadas | `await listarFiadoEmAberto()` |

---

## 🆕 COMPONENTE NOVAVENDA

### O que faz?

Permite registrar uma nova venda no sistema com múltiplos produtos.

### Estrutura do Estado (useState)

```javascript
// Dados principais
const [clienteSelecionado, setClienteSelecionado] = useState('');
const [funcionarioSelecionado, setFuncionarioSelecionado] = useState('');
const [tipoPagamento, setTipoPagamento] = useState('dinheiro');
const [itensCarrinho, setItensCarrinho] = useState([]);

// Adicionar produto
const [produtoSelecionado, setProdutoSelecionado] = useState('');
const [quantidade, setQuantidade] = useState('');

// Listas da API
const [clientes, setClientes] = useState([]);
const [funcionarios, setFuncionarios] = useState([]);
const [produtos, setProdutos] = useState([]);

// Controles
const [loading, setLoading] = useState(true);
const [salvando, setSalvando] = useState(false);
const [erro, setErro] = useState('');
```

**Por que tantos estados?**
- React só re-renderiza quando o estado muda
- Cada informação precisa de seu próprio estado
- Permite controle fino da interface

### Fluxo de Uso

```
1. Usuário acessa /vendas/nova
   ↓
2. useEffect carrega: clientes, funcionários, produtos
   ↓
3. Usuário seleciona: cliente, funcionário, forma de pagamento
   ↓
4. Usuário adiciona produtos ao carrinho:
   - Seleciona produto
   - Informa quantidade
   - Clica "Adicionar ao Carrinho"
   - Sistema valida estoque
   - Item é adicionado ao array itensCarrinho
   ↓
5. Usuário clica "Finalizar Venda"
   ↓
6. Sistema valida tudo e envia para API
   ↓
7. API cria venda com transação
   ↓
8. Usuário é redirecionado para lista de vendas
```

### Função Mais Importante: adicionarItem()

```javascript
const adicionarItem = () => {
    // 1️⃣ VALIDAÇÕES
    if (!produtoSelecionado) {
        setErro('Selecione um produto');
        return;
    }
    
    // 2️⃣ BUSCAR DADOS DO PRODUTO
    const produto = produtos.find(p => p.ID_Produto === parseInt(produtoSelecionado));
    
    // 3️⃣ VALIDAR ESTOQUE
    if (qtd > parseFloat(produto.Estoque_Atual)) {
        setErro('Estoque insuficiente!');
        return;
    }
    
    // 4️⃣ CRIAR OBJETO DO ITEM
    const novoItem = {
        id_produto: produto.ID_Produto,
        nome: produto.Nome,
        quantidade: qtd,
        preco_unitario: parseFloat(produto.Preco_Base),
        subtotal: qtd * parseFloat(produto.Preco_Base)
    };
    
    // 5️⃣ ADICIONAR AO CARRINHO (spread operator)
    setItensCarrinho([...itensCarrinho, novoItem]);
};
```

**Conceitos:**
- **`find()`**: Busca item no array
- **`parseInt()`**: Converte string para número inteiro
- **`parseFloat()`**: Converte string para número decimal
- **`[...array, item]`**: Spread operator (cria novo array com item adicional)

### Função finalizarVenda()

```javascript
const finalizarVenda = async () => {
    try {
        setSalvando(true);
        
        // 1️⃣ MONTAR OBJETO
        const dadosVenda = {
            id_cliente: parseInt(clienteSelecionado),
            id_funcionario: parseInt(funcionarioSelecionado),
            tipo_pagamento: tipoPagamento,
            itens: itensCarrinho.map(item => ({
                id_produto: item.id_produto,
                quantidade: item.quantidade
                // NÃO envia preço! Backend busca do banco
            }))
        };
        
        // 2️⃣ ENVIAR PARA API
        await criarVenda(dadosVenda);
        
        // 3️⃣ FEEDBACK
        setSucesso('Venda registrada com sucesso!');
        
        // 4️⃣ REDIRECIONAR
        setTimeout(() => navigate('/vendas'), 2000);
        
    } catch (error) {
        setErro(error.message);
    } finally {
        setSalvando(false);
    }
};
```

**Conceitos:**
- **`map()`**: Transforma cada item do array
- **`setTimeout()`**: Executa função após X milissegundos
- **`try/finally`**: finally sempre executa (com erro ou não)

---

## 📋 COMPONENTE VENDAS

### O que faz?

Lista todas as vendas com filtros e permite ações (visualizar, quitar).

### Estrutura do Estado

```javascript
// Dados
const [vendas, setVendas] = useState([]);
const [vendaSelecionada, setVendaSelecionada] = useState(null);

// Filtros
const [filtros, setFiltros] = useState({
    periodo_inicio: '',
    periodo_fim: '',
    tipo_pagamento: ''
});

// Controles
const [loading, setLoading] = useState(true);
const [modalDetalhes, setModalDetalhes] = useState(false);
```

### Função carregarVendas()

```javascript
const carregarVendas = async () => {
    try {
        setLoading(true);
        
        // Limpar filtros vazios
        const filtrosLimpos = {};
        Object.keys(filtros).forEach(key => {
            if (filtros[key]) {
                filtrosLimpos[key] = filtros[key];
            }
        });
        
        // Buscar vendas
        const data = await listarVendas(filtrosLimpos);
        setVendas(data);
        
    } catch (error) {
        setErro('Erro ao carregar vendas');
    } finally {
        setLoading(false);
    }
};
```

### Renderização da Tabela

```javascript
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Data/Hora</th>
            <th>Cliente</th>
            {/* ... */}
        </tr>
    </thead>
    <tbody>
        {vendas.map((venda) => (
            <tr key={venda.ID_Venda}>
                <td>#{venda.ID_Venda}</td>
                <td>{formatarDataHora(venda.Data_Hora)}</td>
                <td>{venda.Cliente}</td>
                {/* ... */}
            </tr>
        ))}
    </tbody>
</table>
```

**Conceitos:**
- **`map()`**: Cria um elemento JSX para cada venda
- **`key={}`**: Identifica unicamente cada linha (React exige)
- **Conditional Rendering**: Mostra botão "Quitar" apenas se status = "Em Aberto"

### Modal de Detalhes

```javascript
{modalDetalhes && vendaSelecionada && (
    <Modal titulo="Detalhes da Venda" onClose={fecharModal}>
        {/* Informações gerais */}
        <div>
            <p>Cliente: {vendaSelecionada.Cliente}</p>
            <p>Valor: {formatarMoeda(vendaSelecionada.Valor_Total)}</p>
        </div>
        
        {/* Lista de itens */}
        {vendaSelecionada.itens.map((item, index) => (
            <div key={index}>
                <p>{item.Produto}</p>
                <p>{item.Quantidade} × {formatarMoeda(item.Preco_Unitario)}</p>
            </div>
        ))}
    </Modal>
)}
```

**Conceitos:**
- **`&&`**: Short-circuit (só renderiza se ambos forem true)
- **Conditional Rendering**: Modal só aparece quando modalDetalhes = true

---

## 🔄 FLUXO COMPLETO

### Criar Venda (Passo a Passo)

```
┌──────────────────────────┐
│ 1. USUÁRIO               │
│ Acessa /vendas/nova      │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ 2. REACT                 │
│ useEffect dispara        │
│ carregarDadosIniciais()  │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ 3. SERVICE               │
│ listarClientes()         │
│ listarFuncionarios()     │
│ listarProdutos()         │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ 4. API (HTTP GET)        │
│ GET /clientes            │
│ GET /funcionarios        │
│ GET /produtos            │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ 5. BACKEND               │
│ Busca dados no MySQL     │
│ Retorna arrays           │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ 6. REACT                 │
│ Atualiza estados         │
│ Renderiza selects        │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ 7. USUÁRIO               │
│ Seleciona cliente        │
│ Adiciona produtos        │
│ Clica "Finalizar"        │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ 8. SERVICE               │
│ criarVenda(dados)        │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ 9. API (HTTP POST)       │
│ POST /vendas             │
│ Body: {cliente, itens}   │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ 10. BACKEND              │
│ ✅ Valida cliente        │
│ ✅ Valida funcionário    │
│ ✅ Valida estoque        │
│ ✅ Busca preços atuais   │
│ ✅ Valida crédito(fiado) │
│ ✅ Inicia TRANSAÇÃO      │
│ ✅ Insere venda          │
│ ✅ Insere itens          │
│ ✅ Atualiza estoques     │
│ ✅ COMMIT                │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ 11. REACT                │
│ Mostra sucesso           │
│ Redireciona /vendas      │
└──────────────────────────┘
```

---

## 💡 CONCEITOS IMPORTANTES

### 1. Estado (State)

```javascript
const [valor, setValor] = useState('');
```

- **O que é**: Variável que React observa
- **Quando muda**: Component re-renderiza
- **Como mudar**: Usar setValor(), NUNCA valor = ...

### 2. useEffect

```javascript
useEffect(() => {
    // Código aqui executa quando component monta
}, []);
```

- **[] vazio**: Executa 1 vez (quando monta)
- **[variavel]**: Executa quando variavel muda
- **Sem array**: Executa em todo render

### 3. Async/Await

```javascript
const buscar = async () => {
    const data = await api.get('/vendas');
    return data;
};
```

- **async**: Marca função como assíncrona
- **await**: Espera promise resolver
- **Sem await**: Retorna Promise pendente

### 4. Promises

```javascript
// Sequencial (devagar)
const c = await buscarClientes();
const f = await buscarFuncionarios();

// Paralelo (rápido!)
const [c, f] = await Promise.all([
    buscarClientes(),
    buscarFuncionarios()
]);
```

### 5. Spread Operator

```javascript
// Copiar array + adicionar
const novo = [...antigo, item];

// Copiar objeto + modificar
const novo = {...antigo, campo: 'valor'};
```

### 6. Destructuring

```javascript
// Extrair de objeto
const { id, nome } = produto;

// Extrair de array
const [primeiro, segundo] = array;
```

### 7. Array Methods

```javascript
// map: transformar array
const nomes = produtos.map(p => p.nome);

// filter: filtrar array
const ativos = produtos.filter(p => p.ativo);

// find: achar 1 item
const produto = produtos.find(p => p.id === 5);

// reduce: somar/acumular
const total = itens.reduce((soma, item) => soma + item.valor, 0);
```

---

## 📖 DICAS PARA APRENDIZADO

### 1. Estude na Ordem

1. ✅ **Primeiro**: vendaService.js (comunicação API)
2. ✅ **Depois**: NovaVenda.jsx (criar vendas)
3. ✅ **Por último**: Vendas.jsx (listar vendas)

### 2. Use Console.log

```javascript
console.log('Estado atual:', itensCarrinho);
console.log('Produto selecionado:', produto);
```

### 3. Teste no DevTools

- Abra F12 → Console
- Veja erros em vermelho
- Inspecione variáveis

### 4. Leia os Comentários

Todos os arquivos têm comentários explicativos:
- `//` = comentário de linha
- `/* */` = comentário de bloco
- `/** */` = documentação (JSDoc)

### 5. Experimente!

- Mude valores
- Adicione console.logs
- Quebre o código (e conserte)
- Aprende-se mais errando!

### 6. Recursos Úteis

- **React Docs**: https://react.dev
- **MDN (JavaScript)**: https://developer.mozilla.org
- **Axios Docs**: https://axios-http.com

---

## 🎓 PARA APRESENTAÇÃO

### Pontos para Destacar

1. **Arquitetura em Camadas**
   - Service separa lógica de API
   - Components reutilizáveis
   - Código organizado

2. **Validações Múltiplas**
   - Frontend: feedback rápido
   - Backend: segurança real
   - Estoque e crédito validados

3. **Transações no Banco**
   - Tudo ou nada
   - Integridade dos dados
   - Rollback automático em erros

4. **Experiência do Usuário**
   - Loading states
   - Mensagens de erro claras
   - Feedback visual (cores, ícones)

5. **Boas Práticas**
   - Código comentado
   - Nomenclatura clara
   - DRY (Don't Repeat Yourself)

### Demonstração Prática

1. Mostrar criação de venda
2. Mostrar validação de estoque
3. Mostrar filtros
4. Mostrar modal de detalhes
5. Mostrar quitação de fiado

---

## 🚀 PRÓXIMOS PASSOS

Após dominar este módulo, você pode:

1. ✅ Adicionar paginação na lista
2. ✅ Criar relatório de vendas
3. ✅ Adicionar impressão de cupom
4. ✅ Implementar cancelamento de venda
5. ✅ Adicionar gráficos de vendas
6. ✅ Criar dashboard analítico

---

## 📝 CONCLUSÃO

Este sistema de vendas demonstra:
- ✅ Integração Frontend ↔ Backend
- ✅ Gerenciamento de estado complexo
- ✅ Validações em múltiplas camadas
- ✅ Transações bancárias
- ✅ Código limpo e documentado
- ✅ Boas práticas de desenvolvimento

**Parabéns por construir este sistema! 🎉**

Você aprendeu conceitos fundamentais de desenvolvimento web moderno que serão úteis em qualquer projeto futuro.

---

**Autor**: Sistema de Padaria  
**Data**: Novembro 2025  
**Tecnologias**: React, Node.js, MySQL, Express, Axios
