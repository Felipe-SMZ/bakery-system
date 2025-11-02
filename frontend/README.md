# 🍞 Bakery System - Frontend

> Sistema completo de gestão para padarias desenvolvido com React + Vite

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.3-purple?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Componentes Principais](#-componentes-principais)
- [Integração com Backend](#-integração-com-backend)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

## 🎯 Sobre o Projeto

O **Bakery System** é uma aplicação web moderna e intuitiva desenvolvida para gerenciar todos os aspectos operacionais de uma padaria. O sistema oferece uma interface amigável e responsiva, seguindo os princípios de **Interação Humano-Computador (IHC)** para garantir a melhor experiência do usuário.

### 🎓 Contexto Acadêmico

Este projeto foi desenvolvido como trabalho universitário, demonstrando a aplicação prática de conceitos de:
- Engenharia de Software
- Interação Humano-Computador (IHC)
- Banco de Dados
- Desenvolvimento Web Full Stack

## ✨ Funcionalidades

### 📊 Dashboard
- Visão geral do negócio com métricas em tempo real
- Vendas do dia, mês e total
- Produtos mais vendidos
- Gráficos interativos de desempenho

### 👥 Gestão de Clientes
- Cadastro completo de clientes
- Sistema de crédito (fiado)
- Controle de limite de crédito e saldo devedor
- Histórico de compras
- Status de pagamento (bom, médio, ruim)

### 🏪 Gestão de Produtos
- Cadastro de produtos com categorias
- Controle de estoque em tempo real
- Diferentes unidades de medida (kg, unidade, fatia)
- Formatação inteligente de quantidades
- Preços e margens de lucro

### 👨‍💼 Gestão de Funcionários
- Cadastro de funcionários
- Controle de cargos e salários
- Histórico de vendas por funcionário

### 🛒 Sistema de Vendas
- **Interface de caixa otimizada** para vendas rápidas
- **Busca inteligente de produtos** com autocomplete
- **Carrinho de compras** interativo
- **Múltiplas formas de pagamento**: Dinheiro, Cartão, PIX, Fiado
- **Validação automática de crédito** para vendas fiadas
- **Visualização em tempo real** do crédito disponível
- **Histórico completo** de vendas
- **Filtro de fiados em aberto** com resumo financeiro

### 📈 Relatórios
- Relatórios de vendas por período
- Análise de produtos mais vendidos
- Ranking de clientes
- Gráficos de desempenho (pizza, barras, linha)
- Exportação de dados

## 🚀 Tecnologias

### Core
- **[React 18.3.1](https://reactjs.org/)** - Biblioteca JavaScript para interfaces
- **[Vite 6.0.3](https://vitejs.dev/)** - Build tool ultra-rápida
- **[React Router DOM 7.0.2](https://reactrouter.com/)** - Roteamento SPA

### UI/UX
- **[TailwindCSS 3.4.17](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Lucide React 0.468.0](https://lucide.dev/)** - Ícones modernos
- **[Recharts 2.15.0](https://recharts.org/)** - Biblioteca de gráficos

### HTTP & Data
- **[Axios 1.7.8](https://axios-http.com/)** - Cliente HTTP
- **[Date-fns 4.1.0](https://date-fns.org/)** - Manipulação de datas

### Qualidade de Código
- **[ESLint 9.17.0](https://eslint.org/)** - Linter JavaScript/React
- **PostCSS & Autoprefixer** - Processamento CSS

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Backend** do Bakery System rodando

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/Felipe-SMZ/bakery-system.git
cd bakery-system/frontend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## 🎮 Uso

### Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Cria build de produção
npm run preview      # Preview do build de produção

# Qualidade
npm run lint         # Executa ESLint
```

### Acesso ao Sistema

1. **Acesse**: `http://localhost:5173`
2. **Login**: (Configure conforme seu backend)
3. **Navegue** pelas seções através da sidebar

## 📁 Estrutura do Projeto

```
frontend/
├── public/                 # Arquivos públicos estáticos
├── src/
│   ├── assets/            # Imagens, ícones, etc.
│   ├── components/        # Componentes React reutilizáveis
│   │   ├── clientes/     # Componentes específicos de clientes
│   │   ├── common/       # Componentes comuns (Button, Card, etc.)
│   │   ├── funcionarios/ # Componentes de funcionários
│   │   ├── layout/       # Layout (Navbar, Sidebar)
│   │   ├── produtos/     # Componentes de produtos
│   │   ├── relatorios/   # Componentes de relatórios
│   │   └── vendas/       # Componentes de vendas
│   ├── contexts/         # Context API do React
│   ├── hooks/            # Custom React Hooks
│   ├── pages/            # Páginas da aplicação
│   │   ├── Clientes.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Funcionarios.jsx
│   │   ├── NovaVenda.jsx
│   │   ├── Produtos.jsx
│   │   ├── Relatorios.jsx
│   │   └── Vendas.jsx
│   ├── services/         # Serviços de API
│   │   ├── api.js
│   │   ├── cargoService.js
│   │   ├── clienteService.js
│   │   ├── funcionarioService.js
│   │   ├── produtoService.js
│   │   ├── relatorioService.js
│   │   ├── tipoProdutoService.js
│   │   └── vendaService.js
│   ├── utils/            # Funções utilitárias
│   │   ├── constants.js
│   │   └── formatters.js
│   ├── App.jsx           # Componente principal
│   ├── main.jsx          # Ponto de entrada
│   └── index.css         # Estilos globais
├── .env                  # Variáveis de ambiente
├── .gitignore
├── eslint.config.js      # Configuração ESLint
├── index.html
├── package.json
├── postcss.config.js     # Configuração PostCSS
├── tailwind.config.js    # Configuração Tailwind
└── vite.config.js        # Configuração Vite
```

## 🧩 Componentes Principais

### Layout Components

#### `<Sidebar />`
Navegação lateral com links para todas as seções do sistema.

#### `<Navbar />`
Barra superior com informações do usuário e notificações.

### Common Components

#### `<Button />`
```jsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Salvar
</Button>
```

**Variants**: `primary`, `secondary`, `success`, `danger`, `warning`  
**Sizes**: `sm`, `md`, `lg`

#### `<Card />`
```jsx
<Card titulo="Título do Card">
  <p>Conteúdo aqui</p>
</Card>
```

#### `<Modal />`
```jsx
<Modal isOpen={open} onClose={handleClose} title="Detalhes" size="lg">
  <p>Conteúdo do modal</p>
</Modal>
```

#### `<Loading />`
```jsx
<Loading mensagem="Carregando dados..." />
```

#### `<Input />`
```jsx
<Input
  label="Nome"
  value={nome}
  onChange={(e) => setNome(e.target.value)}
  required
/>
```

### Utilities

#### Formatadores (`utils/formatters.js`)

```javascript
import { 
  formatarMoeda, 
  formatarData, 
  formatarDataHora,
  formatarQuantidade 
} from '@/utils/formatters';

formatarMoeda(1500.50);           // "R$ 1.500,50"
formatarData('2025-11-02');       // "02/11/2025"
formatarDataHora('2025-11-02T10:30:00'); // "02/11/2025 10:30"
formatarQuantidade(1, 'unidade'); // "1 un"
formatarQuantidade(2.5, 'kg');    // "2,5 kg"
```

## 🔌 Integração com Backend

### Configuração da API

O sistema utiliza Axios para comunicação com o backend. A configuração base está em `services/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
```

### Estrutura de Serviços

Cada módulo possui seu próprio service:

```javascript
// Exemplo: clienteService.js
import api from './api';

export const listarClientes = async (filtros = {}) => {
  const response = await api.get('/clientes', { params: filtros });
  return response.data.data;
};

export const buscarClientePorId = async (id) => {
  const response = await api.get(`/clientes/${id}`);
  return response.data.data;
};

export const criarCliente = async (dados) => {
  const response = await api.post('/clientes', dados);
  return response.data;
};
```

### Endpoints Utilizados

| Módulo | Endpoint | Métodos |
|--------|----------|---------|
| Clientes | `/api/clientes` | GET, POST, PUT, DELETE |
| Produtos | `/api/produtos` | GET, POST, PUT, DELETE |
| Funcionários | `/api/funcionarios` | GET, POST, PUT, DELETE |
| Vendas | `/api/vendas` | GET, POST |
| Relatórios | `/api/relatorios` | GET |

## 🎨 Princípios de UX/UI Aplicados

### Heurísticas de Nielsen
- ✅ **Visibilidade do status do sistema**: Feedbacks visuais constantes
- ✅ **Correspondência sistema-mundo real**: Linguagem familiar ao usuário
- ✅ **Controle e liberdade**: Botões de cancelar e voltar
- ✅ **Consistência e padrões**: Componentes reutilizáveis
- ✅ **Prevenção de erros**: Validações em tempo real
- ✅ **Reconhecimento ao invés de memorização**: Ícones e labels claros
- ✅ **Flexibilidade e eficiência**: Atalhos e busca rápida
- ✅ **Design estético e minimalista**: Interface limpa e organizada

### Princípios da Gestalt
- **Proximidade**: Elementos relacionados agrupados
- **Similaridade**: Elementos similares com mesmo estilo
- **Continuidade**: Fluxo visual lógico
- **Fechamento**: Cards e containers bem definidos

### Acessibilidade
- Contraste de cores adequado
- Tamanhos de fonte legíveis
- Navegação por teclado
- Labels descritivos

## 🌟 Destaques do Sistema

### 1. Sistema de Crédito Inteligente
- Validação automática de limite de crédito
- Alertas visuais quando crédito insuficiente
- Cálculo em tempo real do crédito após venda
- Card informativo com resumo financeiro

### 2. Busca Inteligente de Produtos
- Autocomplete com busca por código, nome ou tipo
- Lista suspensa com informações completas
- Formatação adequada de estoque
- Feedback visual instantâneo

### 3. Filtro de Fiados em Aberto
- Toggle button para visualização rápida
- Cards de resumo (Total, Quantidade, Clientes)
- Lista filtrada automaticamente
- Facilitação de cobrança e controle

### 4. Interface de Caixa Otimizada
- Fluxo de venda em 3 passos simples
- Carrinho de compras visual
- Limpeza automática após venda
- Preparado para próxima venda imediatamente

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm test

# Cobertura de testes
npm run test:coverage
```

## 📦 Build de Produção

### Gerar Build

```bash
npm run build
```

Arquivos otimizados serão gerados na pasta `dist/`

### Preview do Build

```bash
npm run preview
```

### Deploy

O sistema pode ser deployado em:
- **Vercel**
- **Netlify**
- **AWS S3 + CloudFront**
- **Nginx** (servidor próprio)

### Padrões de Código

- Use **ESLint** para manter código consistente
- Siga as convenções de nomenclatura do projeto
- Comente código complexo
- Escreva commits descritivos

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Felipe SMZ**
- GitHub: [@Felipe-SMZ](https://github.com/Felipe-SMZ)

## 🙏 Agradecimentos

- Professores e orientadores do curso
- Comunidade React e Vite
- Contribuidores open-source

---

<div align="center">

**[⬆ Voltar ao topo](#-bakery-system---frontend)**

Desenvolvido com ❤️ para projeto universitário

</div>
