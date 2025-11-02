// src/pages/Relatorios.jsx

/**
 * 📊 PÁGINA DE RELATÓRIOS
 * 
 * =============================================================================
 * 🎓 AULA: ESTRUTURA DE UMA PÁGINA DE RELATÓRIOS
 * =============================================================================
 * 
 * 📖 CONCEITOS QUE VOCÊ VAI APRENDER:
 * 
 * 1. **Estados (useState)**
 *    - O que é: variáveis que, quando mudam, re-renderizam a página
 *    - Quando usar: dados que mudam (filtros, dados carregados, loading)
 * 
 * 2. **Efeitos (useEffect)**
 *    - O que é: código que roda em momentos específicos (ao carregar página, etc)
 *    - Quando usar: buscar dados da API, reagir a mudanças
 * 
 * 3. **Service Layer**
 *    - O que é: funções que conversam com o backend
 *    - Por que: separa lógica de API da interface
 * 
 * 4. **Componentes Reutilizáveis**
 *    - Card, Button, Tabs: já criados e prontos para usar
 *    - Por que: código limpo, consistência visual
 * 
 * 5. **Formatação de Dados**
 *    - Datas, moedas, números: formatar para exibir bonito
 *    - Onde: utils/formatters.js
 * 
 * =============================================================================
 */

import { useState, useEffect } from 'react';
import { 
    TrendingUp, 
    ShoppingCart, 
    Users, 
    Package, 
    DollarSign,
    AlertTriangle,
    Calendar,
    BarChart3
} from 'lucide-react';

// Componentes reutilizáveis (já criados)
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Tabs from '../components/common/Tabs';

// Service: funções que buscam dados do backend
import {
    buscarDashboard,
    buscarProdutosMaisVendidos,
    buscarVendasPorFormaPagamento,
    buscarDesempenhoFuncionarios,
    buscarClientesDevedores,
    buscarProdutosEstoqueBaixo
} from '../services/relatorioService';

// Utilitários de formatação
import { formatarMoeda, formatarData } from '../utils/formatters';

/**
 * =============================================================================
 * 🎯 PASSO 1: DEFINIR A FUNÇÃO DO COMPONENTE
 * =============================================================================
 * 
 * Em React, uma página é uma FUNÇÃO que retorna JSX (HTML+JavaScript)
 */
function Relatorios() {
    
    // =========================================================================
    // 🎯 PASSO 2: DEFINIR OS ESTADOS
    // =========================================================================
    
    /**
     * 💡 O QUE É useState:
     * - Cria uma variável "reativa"
     * - Quando muda, a página re-renderiza automaticamente
     * - Sintaxe: const [valor, setValor] = useState(valorInicial)
     * 
     * 📝 REGRA: Use useState para QUALQUER dado que pode mudar na tela
     */
    
    // Estado de carregamento
    const [carregando, setCarregando] = useState(true);
    
    // Estado da aba ativa (dashboard, vendas, produtos, etc)
    const [abaAtiva, setAbaAtiva] = useState('dashboard');
    
    // Estados dos dados (cada relatório tem seu estado)
    const [dashboard, setDashboard] = useState(null);
    const [produtosMaisVendidos, setProdutosMaisVendidos] = useState([]);
    const [vendasPorPagamento, setVendasPorPagamento] = useState([]);
    const [desempenhoFuncionarios, setDesempenhoFuncionarios] = useState([]);
    const [clientesDevedores, setClientesDevedores] = useState([]);
    const [produtosEstoqueBaixo, setProdutosEstoqueBaixo] = useState([]);
    
    // Estado de filtros (usuário pode filtrar por data, etc)
    const [filtros, setFiltros] = useState({
        dataInicio: '',
        dataFim: '',
        limite: 10
    });
    
    // =========================================================================
    // 🎯 PASSO 3: CRIAR FUNÇÕES PARA BUSCAR DADOS
    // =========================================================================
    
    /**
     * 💡 POR QUE CRIAR FUNÇÕES SEPARADAS:
     * - Organização: cada função faz UMA coisa
     * - Reutilização: pode chamar de vários lugares
     * - Manutenção: fácil de encontrar e alterar
     * 
     * 📝 PADRÃO async/await:
     * - async: marca função como assíncrona
     * - await: espera a Promise resolver (dados chegarem do backend)
     * - try/catch: captura erros (se API falhar)
     */
    
    /**
     * Busca dados do dashboard (resumo geral)
     */
    const carregarDashboard = async () => {
        try {
            setCarregando(true);  // Mostra loading
            const dados = await buscarDashboard();  // Busca na API
            setDashboard(dados);  // Salva no estado
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
            alert('Erro ao carregar dashboard. Tente novamente.');
        } finally {
            setCarregando(false);  // Esconde loading (sempre executa)
        }
    };
    
    /**
     * Busca produtos mais vendidos
     */
    const carregarProdutosMaisVendidos = async () => {
        try {
            const dados = await buscarProdutosMaisVendidos({
                dataInicio: filtros.dataInicio || null,
                dataFim: filtros.dataFim || null,
                limite: filtros.limite
            });
            setProdutosMaisVendidos(dados);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    };
    
    /**
     * Busca vendas por forma de pagamento
     */
    const carregarVendasPorPagamento = async () => {
        try {
            const dados = await buscarVendasPorFormaPagamento({
                dataInicio: filtros.dataInicio || null,
                dataFim: filtros.dataFim || null
            });
            setVendasPorPagamento(dados);
        } catch (error) {
            console.error('Erro ao carregar vendas por pagamento:', error);
        }
    };
    
    /**
     * Busca desempenho dos funcionários
     */
    const carregarDesempenhoFuncionarios = async () => {
        try {
            const dados = await buscarDesempenhoFuncionarios({
                dataInicio: filtros.dataInicio || null,
                dataFim: filtros.dataFim || null
            });
            setDesempenhoFuncionarios(dados);
        } catch (error) {
            console.error('Erro ao carregar desempenho:', error);
        }
    };
    
    /**
     * Busca clientes com dívidas
     */
    const carregarClientesDevedores = async () => {
        try {
            const dados = await buscarClientesDevedores();
            setClientesDevedores(dados);
        } catch (error) {
            console.error('Erro ao carregar devedores:', error);
        }
    };
    
    /**
     * Busca produtos com estoque baixo
     */
    const carregarProdutosEstoqueBaixo = async () => {
        try {
            const dados = await buscarProdutosEstoqueBaixo(50);
            setProdutosEstoqueBaixo(dados);
        } catch (error) {
            console.error('Erro ao carregar estoque baixo:', error);
        }
    };
    
    // =========================================================================
    // 🎯 PASSO 4: USAR useEffect PARA CARREGAR DADOS
    // =========================================================================
    
    /**
     * 💡 O QUE É useEffect:
     * - Executa código em momentos específicos
     * - useEffect(() => { código }, [dependências])
     * - [] vazio: executa UMA VEZ ao carregar a página
     * - [variavel]: executa toda vez que variavel mudar
     * 
     * 📝 CASOS DE USO:
     * - Buscar dados ao carregar página
     * - Atualizar quando filtro mudar
     * - Limpar recursos ao sair da página
     */
    
    // Carrega dashboard ao abrir a página ([] = só uma vez)
    useEffect(() => {
        carregarDashboard();
    }, []);
    
    // Carrega outros dados quando a aba mudar
    useEffect(() => {
        if (abaAtiva === 'produtos') {
            carregarProdutosMaisVendidos();
        } else if (abaAtiva === 'pagamentos') {
            carregarVendasPorPagamento();
        } else if (abaAtiva === 'funcionarios') {
            carregarDesempenhoFuncionarios();
        } else if (abaAtiva === 'devedores') {
            carregarClientesDevedores();
        } else if (abaAtiva === 'estoque') {
            carregarProdutosEstoqueBaixo();
        }
    }, [abaAtiva, filtros]);  // Re-executa quando aba ou filtros mudarem
    
    // =========================================================================
    // 🎯 PASSO 5: RENDERIZAÇÃO CONDICIONAL
    // =========================================================================
    
    /**
     * 💡 LOADING:
     * - Enquanto carrega dados, mostra componente Loading
     * - Melhora UX (usuário sabe que está carregando)
     */
    if (carregando) {
        return <Loading />;
    }
    
    /**
     * 💡 GUARDA DE DADOS:
     * - Se dashboard não carregou, mostra erro
     * - Evita tentar acessar dashboard.vendas_hoje quando dashboard é null
     */
    if (!dashboard) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <p className="text-red-600">Erro ao carregar dados.</p>
                    <Button onClick={carregarDashboard} className="mt-4">
                        Tentar Novamente
                    </Button>
                </div>
            </div>
        );
    }
    
    // =========================================================================
    // 🎯 PASSO 6: RETORNAR JSX (A INTERFACE)
    // =========================================================================
    
    /**
     * 💡 JSX:
     * - Parece HTML mas é JavaScript
     * - Pode usar {} para inserir JS (variáveis, expressões)
     * - className em vez de class (reservada no JS)
     * - Componentes com letra maiúscula: <Card>, <Button>
     * - Tags HTML com minúscula: <div>, <h1>
     */
    
    return (
        <div className="space-y-6">
            {/* 
                =============================================================
                🎨 CABEÇALHO
                ============================================================= 
            */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Relatórios & Análises
                </h1>
                <p className="text-gray-600 mt-1">
                    Acompanhe o desempenho do seu negócio
                </p>
            </div>
            
            {/* 
                =============================================================
                📊 CARDS DE RESUMO (SEMPRE VISÍVEIS)
                ============================================================= 
                
                💡 ESTRUTURA:
                - Grid responsivo (1 col mobile, 2 tablet, 4 desktop)
                - Cards com ícone, título, valor e variação
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card: Vendas Hoje */}
                <Card>
                    <Card.Body>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Vendas Hoje</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatarMoeda(dashboard.vendas_hoje.valor_total)}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {dashboard.vendas_hoje.quantidade} vendas
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <ShoppingCart className="text-green-600" size={24} />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                
                {/* Card: Vendas do Mês */}
                <Card>
                    <Card.Body>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Vendas do Mês</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatarMoeda(dashboard.vendas_mes.valor_total)}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {dashboard.vendas_mes.quantidade} vendas
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <TrendingUp className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                
                {/* Card: Total de Clientes */}
                <Card>
                    <Card.Body>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Clientes</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboard.clientes.total}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    cadastrados
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <Users className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                
                {/* Card: Produtos */}
                <Card>
                    <Card.Body>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Produtos</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboard.produtos.total}
                                </p>
                                <p className="text-sm text-red-500 mt-1">
                                    {dashboard.produtos.estoque_baixo} com estoque baixo
                                </p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-full">
                                <Package className="text-orange-600" size={24} />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
            
            {/* Continua no próximo arquivo... (página muito longa) */}
            <p className="text-center text-gray-500 italic">
                🚧 Página em construção - Continuação vem nos próximos passos...
            </p>
        </div>
    );
}

export default Relatorios;
