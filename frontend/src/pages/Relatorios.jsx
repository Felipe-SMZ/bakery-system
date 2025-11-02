// src/pages/Relatorios.jsx

/**
 * 📊 PÁGINA: RELATÓRIOS COMPLETA
 * 
 * =============================================================================
 * 🎓 AULA: INTEGRANDO TUDO - A PÁGINA FINAL
 * =============================================================================
 * 
 * 🎯 O QUE ESTA PÁGINA FAZ:
 * - Dashboard com resumo (cards + gráfico de evolução)
 * - Relatórios por período (filtros + gráficos + tabelas)
 * - Sistema de abas (Tabs) pra organizar
 * - Integra TODOS os componentes criados
 * 
 * 🧩 COMPONENTES USADOS:
 * ✅ Card, Button (common)
 * ✅ GraficoLinha (evolução de vendas)
 * ✅ GraficoPizza (formas de pagamento)
 * ✅ GraficoBarra (rankings)
 * ✅ FiltrosPeriodo (seleção de datas)
 * ✅ TabelaRanking (top produtos/funcionários)
 * ✅ TabelaLista (devedores/estoque baixo)
 * 
 * 💡 CONCEITOS APLICADOS:
 * - Componentização (reutilização)
 * - Estado com useState (múltiplos estados)
 * - Efeitos com useEffect (carregar dados)
 * - Service Layer (separação de responsabilidades)
 * - Async/Await (requisições assíncronas)
 * - Formatação (moeda, data...)
 * 
 * =============================================================================
 */

import { useState, useEffect } from 'react';
import { 
    ShoppingCart, 
    TrendingUp, 
    Users, 
    Package,
    DollarSign,
    AlertCircle,
    Calendar,
    BarChart3
} from 'lucide-react';

// Componentes comuns
import Card from '../components/common/Card';
import Button from '../components/common/Button';

// Componentes de relatórios
import GraficoLinha from '../components/relatorios/GraficoLinha';
import GraficoPizza from '../components/relatorios/GraficoPizza';
import GraficoBarra from '../components/relatorios/GraficoBarra';
import FiltrosPeriodo from '../components/relatorios/FiltrosPeriodo';
import TabelaRanking from '../components/relatorios/TabelaRanking';
import TabelaLista from '../components/relatorios/TabelaLista';

// Services e utilitários
import * as relatorioService from '../services/relatorioService';
import { formatarMoeda, formatarData } from '../utils/formatters';

/**
 * =============================================================================
 * 🎯 COMPONENTE PRINCIPAL
 * =============================================================================
 */
function Relatorios() {
    
    // =========================================================================
    // 📦 ESTADOS
    // =========================================================================
    
    /**
     * 💡 MÚLTIPLOS ESTADOS:
     * - Cada dado tem seu próprio estado
     * - Permite carregar independentemente
     * - Facilita loading e tratamento de erro
     */
    
    // Dashboard (resumo geral)
    const [dashboard, setDashboard] = useState(null);
    
    // Vendas por período
    const [vendasPeriodo, setVendasPeriodo] = useState([]);
    
    // Produtos mais vendidos
    const [produtosTop, setProdutosTop] = useState([]);
    
    // Formas de pagamento
    const [formasPagamento, setFormasPagamento] = useState([]);
    
    // Desempenho de funcionários
    const [funcionarios, setFuncionarios] = useState([]);
    
    // Clientes devedores
    const [devedores, setDevedores] = useState([]);
    
    // Produtos com estoque baixo
    const [estoqueBaixo, setEstoqueBaixo] = useState([]);
    
    // Filtros de período
    const [filtros, setFiltros] = useState({
        dataInicio: '',
        dataFim: ''
    });
    
    // Controle de loading e abas
    const [carregando, setCarregando] = useState(false);
    const [abaAtiva, setAbaAtiva] = useState('dashboard');
    
    // =========================================================================
    // 🔄 EFEITOS (useEffect)
    // =========================================================================
    
    /**
     * 💡 CARREGAR DADOS INICIAIS:
     * - Executa quando componente monta
     * - [] = dependências vazias = roda 1 vez
     */
    useEffect(() => {
        carregarDashboard();
        carregarDevedores();
        carregarEstoqueBaixo();
    }, []);
    
    /**
     * 💡 REAGIR A MUDANÇAS DE FILTRO:
     * - Executa quando filtros mudam
     * - Recarrega dados com novas datas
     */
    useEffect(() => {
        if (filtros.dataInicio && filtros.dataFim) {
            carregarDadosFiltrados();
        }
    }, [filtros]);
    
    // =========================================================================
    // 📡 FUNÇÕES DE CARREGAMENTO
    // =========================================================================
    
    /**
     * 🎯 CARREGAR DASHBOARD:
     * - Resumo geral (vendas hoje, mês, totais...)
     * - Não depende de filtros
     */
    const carregarDashboard = async () => {
        try {
            setCarregando(true);
            const dados = await relatorioService.buscarDashboard();
            setDashboard(dados);
            
            // Carregar também evolução últimos 7 dias
            const ultimos7Dias = obterUltimos7Dias();
            const evolucao = await relatorioService.buscarVendasPorPeriodo(
                ultimos7Dias.inicio,
                ultimos7Dias.fim,
                'dia'
            );
            setVendasPeriodo(evolucao);
            
        } catch (erro) {
            console.error('Erro ao carregar dashboard:', erro);
            alert('Erro ao carregar dashboard');
        } finally {
            setCarregando(false);
        }
    };
    
    /**
     * 🎯 CARREGAR DADOS FILTRADOS:
     * - Usa datas dos filtros
     * - Produtos, pagamentos, funcionários
     */
    const carregarDadosFiltrados = async () => {
        try {
            setCarregando(true);
            
            // Carregar em paralelo (Promise.all = mais rápido)
            const [produtos, pagamentos, funcs] = await Promise.all([
                relatorioService.buscarProdutosMaisVendidos({
                    data_inicio: filtros.dataInicio,
                    data_fim: filtros.dataFim,
                    limite: 10
                }),
                relatorioService.buscarVendasPorFormaPagamento({
                    data_inicio: filtros.dataInicio,
                    data_fim: filtros.dataFim
                }),
                relatorioService.buscarDesempenhoFuncionarios({
                    data_inicio: filtros.dataInicio,
                    data_fim: filtros.dataFim
                })
            ]);
            
            setProdutosTop(produtos);
            setFormasPagamento(pagamentos);
            setFuncionarios(funcs);
            
        } catch (erro) {
            console.error('Erro ao carregar dados filtrados:', erro);
            alert('Erro ao carregar relatórios');
        } finally {
            setCarregando(false);
        }
    };
    
    /**
     * 🎯 CARREGAR DEVEDORES:
     * - Lista clientes com crédito pendente
     */
    const carregarDevedores = async () => {
        try {
            const dados = await relatorioService.buscarClientesDevedores();
            setDevedores(dados);
        } catch (erro) {
            console.error('Erro ao carregar devedores:', erro);
        }
    };
    
    /**
     * 🎯 CARREGAR ESTOQUE BAIXO:
     * - Produtos abaixo do estoque mínimo
     */
    const carregarEstoqueBaixo = async () => {
        try {
            const dados = await relatorioService.buscarProdutosEstoqueBaixo(20);
            setEstoqueBaixo(dados);
        } catch (erro) {
            console.error('Erro ao carregar estoque:', erro);
        }
    };
    
    // =========================================================================
    // 🛠️ FUNÇÕES AUXILIARES
    // =========================================================================
    
    /**
     * 💡 OBTER ÚLTIMOS 7 DIAS:
     * - Para gráfico de evolução do dashboard
     */
    const obterUltimos7Dias = () => {
        const hoje = new Date();
        const seteDiasAtras = new Date();
        seteDiasAtras.setDate(hoje.getDate() - 7);
        
        return {
            inicio: seteDiasAtras.toISOString().split('T')[0],
            fim: hoje.toISOString().split('T')[0]
        };
    };
    
    /**
     * 💡 HANDLER DE MUDANÇA DE FILTROS:
     * - Recebe novos filtros do componente FiltrosPeriodo
     * - Atualiza estado (dispara useEffect)
     */
    const handleFiltrosChange = (novosFiltros) => {
        setFiltros(novosFiltros);
    };
    
    // =========================================================================
    // 🎯 RENDERIZAÇÃO - DASHBOARD
    // =========================================================================
    
    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Cards de Resumo - Melhorados com UX */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Vendas Hoje */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <ShoppingCart className="text-emerald-600" size={20} />
                                </div>
                                <p className="text-sm font-medium text-gray-600">Vendas Hoje</p>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">
                                {dashboard ? formatarMoeda(dashboard.vendas_hoje?.valor_total || 0) : '...'}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                {dashboard?.vendas_hoje?.quantidade || 0} transações
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Vendas do Mês */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <TrendingUp className="text-blue-600" size={20} />
                                </div>
                                <p className="text-sm font-medium text-gray-600">Vendas do Mês</p>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">
                                {dashboard ? formatarMoeda(dashboard.vendas_mes?.valor_total || 0) : '...'}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                {dashboard?.vendas_mes?.quantidade || 0} transações
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Total Clientes */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <Users className="text-purple-600" size={20} />
                                </div>
                                <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">
                                {dashboard?.clientes?.total || 0}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                cadastrados
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Total Produtos */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-amber-50 rounded-lg">
                                    <Package className="text-amber-600" size={20} />
                                </div>
                                <p className="text-sm font-medium text-gray-600">Total Produtos</p>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">
                                {dashboard?.produtos?.total || 0}
                            </p>
                            <p className="text-xs text-amber-600 flex items-center gap-1 font-medium">
                                <AlertCircle size={12} />
                                {dashboard?.produtos?.estoque_baixo || 0} com estoque baixo
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Gráfico de Evolução (Últimos 7 Dias) */}
            {Array.isArray(vendasPeriodo) && vendasPeriodo.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <GraficoLinha
                        dados={vendasPeriodo}
                        chaveX="periodo"
                        chaveY="valor_total"
                        titulo="📈 Evolução de Vendas - Últimos 7 Dias"
                        cor="#10b981"
                        altura={350}
                    />
                </div>
            )}
            
            {/* Alertas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Devedores */}
                {Array.isArray(devedores) && devedores.length > 0 && (
                    <div className="bg-gradient-to-br from-red-50 to-white rounded-xl shadow-sm border border-red-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-red-100 rounded-lg">
                                <AlertCircle className="text-red-600" size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Clientes Devedores
                                </h3>
                            </div>
                            <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-red-500 text-white shadow-sm">
                                {devedores.length}
                            </span>
                        </div>
                        <div className="pt-3 border-t border-red-100">
                            <p className="text-sm text-gray-600">
                                Total em crédito:{' '}
                                <span className="block mt-1 text-2xl font-bold text-red-600">
                                    {formatarMoeda(devedores.reduce((sum, d) => sum + (parseFloat(d.total_em_aberto) || 0), 0))}
                                </span>
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Estoque Baixo */}
                {Array.isArray(estoqueBaixo) && estoqueBaixo.length > 0 && (
                    <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl shadow-sm border border-amber-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-amber-100 rounded-lg">
                                <Package className="text-amber-600" size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Estoque Baixo
                                </h3>
                            </div>
                            <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-amber-500 text-white shadow-sm">
                                {estoqueBaixo.length}
                            </span>
                        </div>
                        <div className="pt-3 border-t border-amber-100">
                            <p className="text-sm text-gray-600">
                                Produtos abaixo do estoque mínimo que precisam de atenção
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
    
    // =========================================================================
    // 🎯 RENDERIZAÇÃO - ABA PRODUTOS
    // =========================================================================
    
    const renderProdutos = () => (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <FiltrosPeriodo
                    filtros={filtros}
                    onChange={handleFiltrosChange}
                    mostrarAtalhos={true}
                    compacto={false}
                />
            </div>
            
            {/* Gráfico de Barras - Top 10 */}
            {Array.isArray(produtosTop) && produtosTop.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <GraficoBarra
                        dados={produtosTop}
                        chaveX="produto"
                        chaveY="faturamento_total"
                        titulo="🏆 Top 10 Produtos Mais Vendidos"
                        orientacao="horizontal"
                        mostrarRanking={true}
                        altura={400}
                    />
                </div>
            )}
            
            {/* Tabela Detalhada */}
            {Array.isArray(produtosTop) && produtosTop.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <TabelaRanking
                        dados={produtosTop}
                        colunas={[
                            { 
                                chave: 'produto', 
                                titulo: 'Produto',
                                alinhamento: 'left'
                            },
                            { 
                                chave: 'total_vendido', 
                                titulo: 'Qtd Vendida',
                                alinhamento: 'center'
                            },
                            { 
                                chave: 'faturamento_total', 
                                titulo: 'Total Vendido (R$)',
                                formatador: formatarMoeda,
                                alinhamento: 'right'
                            }
                        ]}
                        titulo="📊 Ranking Completo"
                        mostrarPosicao={true}
                        destacarTop3={true}
                    />
                </div>
            )}
        </div>
    );
    
    // =========================================================================
    // 🎯 RENDERIZAÇÃO - ABA PAGAMENTOS
    // =========================================================================
    
    const renderPagamentos = () => (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <FiltrosPeriodo
                    filtros={filtros}
                    onChange={handleFiltrosChange}
                    mostrarAtalhos={true}
                    compacto={false}
                />
            </div>
            
            {/* Gráfico de Pizza */}
            {Array.isArray(formasPagamento) && formasPagamento.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <GraficoPizza
                        dados={formasPagamento}
                        chaveNome="forma_pagamento"
                        chaveValor="valor_total"
                        titulo="💳 Distribuição por Forma de Pagamento"
                        altura={400}
                    />
                </div>
            )}
            
            {/* Tabela */}
            {Array.isArray(formasPagamento) && formasPagamento.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <TabelaRanking
                        dados={formasPagamento}
                        colunas={[
                            { 
                                chave: 'forma_pagamento', 
                                titulo: 'Forma de Pagamento',
                                alinhamento: 'left'
                            },
                            { 
                                chave: 'quantidade_vendas', 
                                titulo: 'Nº Vendas',
                                alinhamento: 'center'
                            },
                            { 
                                chave: 'valor_total', 
                                titulo: 'Total (R$)',
                                formatador: formatarMoeda,
                                alinhamento: 'right'
                            }
                        ]}
                        titulo="💰 Detalhamento"
                        mostrarPosicao={false}
                        destacarTop3={false}
                    />
                </div>
            )}
        </div>
    );
    
    // =========================================================================
    // 🎯 RENDERIZAÇÃO - ABA FUNCIONÁRIOS
    // =========================================================================
    
    const renderFuncionarios = () => (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <FiltrosPeriodo
                    filtros={filtros}
                    onChange={handleFiltrosChange}
                    mostrarAtalhos={true}
                    compacto={false}
                />
            </div>
            
            {/* Gráfico de Barras */}
            {Array.isArray(funcionarios) && funcionarios.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <GraficoBarra
                        dados={funcionarios}
                        chaveX="funcionario"
                        chaveY="valor_total_vendido"
                        titulo="👥 Desempenho de Funcionários"
                        orientacao="horizontal"
                        mostrarRanking={true}
                        altura={400}
                    />
                </div>
            )}
            
            {/* Tabela */}
            {Array.isArray(funcionarios) && funcionarios.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <TabelaRanking
                        dados={funcionarios}
                        colunas={[
                            { 
                                chave: 'funcionario', 
                                titulo: 'Funcionário',
                                alinhamento: 'left'
                            },
                            { 
                                chave: 'total_vendas', 
                                titulo: 'Nº Vendas',
                                alinhamento: 'center'
                            },
                            { 
                                chave: 'valor_total_vendido', 
                                titulo: 'Total Vendido (R$)',
                                formatador: formatarMoeda,
                                alinhamento: 'right'
                            }
                        ]}
                        titulo="🏅 Ranking de Vendedores"
                        mostrarPosicao={true}
                        destacarTop3={true}
                    />
                </div>
            )}
        </div>
    );
    
    // =========================================================================
    // 🎯 RENDERIZAÇÃO - ABA DEVEDORES
    // =========================================================================
    
    const renderDevedores = () => {
        // Função para renderizar badge de criticidade
        const renderBadgeDivida = (cliente) => {
            const valor = parseFloat(cliente.total_em_aberto) || 0;
            
            if (valor > 200) {
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        Crítico
                    </span>
                );
            }
            if (valor > 100) {
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        Atenção
                    </span>
                );
            }
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Normal
                </span>
            );
        };
        
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <TabelaLista
                        dados={devedores}
                        colunas={[
                            { 
                                chave: 'cliente', 
                                titulo: 'Cliente',
                                alinhamento: 'left'
                            },
                            { 
                                chave: 'telefone', 
                                titulo: 'Telefone',
                                alinhamento: 'center'
                            },
                            { 
                                chave: 'total_em_aberto', 
                                titulo: 'Crédito Pendente (R$)',
                                formatador: formatarMoeda,
                                alinhamento: 'right'
                            }
                        ]}
                        titulo="💰 Clientes com Crédito Pendente"
                        icone="usuario"
                        corDestaque="vermelho"
                        renderBadge={renderBadgeDivida}
                        mensagemVazio="🎉 Nenhum cliente devedor no momento!"
                    />
                </div>
            </div>
        );
    };
    
    // =========================================================================
    // 🎯 RENDERIZAÇÃO - ABA ESTOQUE
    // =========================================================================
    
    const renderEstoque = () => {
        // Função para renderizar badge de urgência
        const renderBadgeEstoque = (produto) => {
            const alerta = produto.alerta?.toUpperCase() || '';
            
            if (alerta === 'CRÍTICO' || alerta === 'CRITICO') {
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        Crítico
                    </span>
                );
            }
            if (alerta === 'BAIXO') {
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        Baixo
                    </span>
                );
            }
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    OK
                </span>
            );
        };
        
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <TabelaLista
                        dados={estoqueBaixo}
                        colunas={[
                            { 
                                chave: 'produto', 
                                titulo: 'Produto',
                                alinhamento: 'left'
                            },
                            { 
                                chave: 'tipo', 
                                titulo: 'Tipo',
                                alinhamento: 'left'
                            },
                            { 
                                chave: 'estoque_atual', 
                                titulo: 'Estoque Atual',
                                alinhamento: 'center'
                            },
                            { 
                                chave: 'alerta', 
                                titulo: 'Nível de Alerta',
                                alinhamento: 'center'
                            }
                        ]}
                        titulo="📦 Produtos com Estoque Baixo"
                        icone="estoque"
                        corDestaque="amarelo"
                        renderBadge={renderBadgeEstoque}
                        mensagemVazio="✅ Todos os produtos com estoque adequado!"
                    />
                </div>
            </div>
        );
    };
    
    // =========================================================================
    // 🎯 RENDERIZAÇÃO PRINCIPAL
    // =========================================================================
    
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Cabeçalho Melhorado */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                                <BarChart3 className="text-white" size={24} />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Relatórios
                            </h1>
                        </div>
                        <p className="text-gray-600 ml-14">
                            Análises e indicadores do seu negócio em tempo real
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            carregarDashboard();
                            carregarDevedores();
                            carregarEstoqueBaixo();
                            if (filtros.dataInicio && filtros.dataFim) {
                                carregarDadosFiltrados();
                            }
                        }}
                        disabled={carregando}
                        variant="outline"
                        className="shadow-sm"
                    >
                        {carregando ? 'Atualizando...' : '🔄 Atualizar'}
                    </Button>
                </div>
                
                {/* Abas (Tabs) - Design Moderno */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                    <nav className="flex gap-1 overflow-x-auto">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icone: BarChart3, emoji: '📊' },
                            { id: 'produtos', label: 'Produtos', icone: Package, emoji: '🛒' },
                            { id: 'pagamentos', label: 'Pagamentos', icone: DollarSign, emoji: '💳' },
                            { id: 'funcionarios', label: 'Funcionários', icone: Users, emoji: '👥' },
                            { id: 'devedores', label: 'Devedores', icone: AlertCircle, emoji: '💰' },
                            { id: 'estoque', label: 'Estoque', icone: Package, emoji: '📦' }
                        ].map(aba => {
                            const Icone = aba.icone;
                            const isActive = abaAtiva === aba.id;
                            return (
                                <button
                                    key={aba.id}
                                    onClick={() => setAbaAtiva(aba.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200
                                        whitespace-nowrap
                                        ${isActive 
                                            ? 'bg-blue-50 text-blue-700 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    <span className="text-lg">{aba.emoji}</span>
                                    <span className="text-sm font-semibold">{aba.label}</span>
                                    {isActive && (
                                        <span className="ml-1 w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            
                {/* Conteúdo da Aba Ativa */}
                <div className="mt-6">
                    {carregando ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="text-center">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                                <p className="text-gray-600 font-medium">Carregando dados...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {abaAtiva === 'dashboard' && renderDashboard()}
                            {abaAtiva === 'produtos' && renderProdutos()}
                            {abaAtiva === 'pagamentos' && renderPagamentos()}
                            {abaAtiva === 'funcionarios' && renderFuncionarios()}
                            {abaAtiva === 'devedores' && renderDevedores()}
                            {abaAtiva === 'estoque' && renderEstoque()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * =============================================================================
 * 🎓 RESUMO DO QUE APRENDEMOS:
 * =============================================================================
 * 
 * 1️⃣ COMPONENTIZAÇÃO:
 *    - Criamos componentes reutilizáveis (gráficos, tabelas, filtros)
 *    - Cada componente tem responsabilidade única
 *    - Facilita manutenção e teste
 * 
 * 2️⃣ ESTADO E EFEITOS:
 *    - useState para dados dinâmicos
 *    - useEffect para carregar ao montar e reagir a mudanças
 *    - Múltiplos estados independentes
 * 
 * 3️⃣ SERVICE LAYER:
 *    - Separamos lógica de API (relatorioService)
 *    - Componente não sabe COMO buscar, só USA os dados
 *    - Facilita trocar backend sem mexer na UI
 * 
 * 4️⃣ ASYNC/AWAIT:
 *    - Requisições assíncronas de forma limpa
 *    - Promise.all para paralelizar
 *    - Try/catch para tratamento de erro
 * 
 * 5️⃣ RENDERIZAÇÃO CONDICIONAL:
 *    - Só mostra gráfico se tem dados (vendasPeriodo.length > 0)
 *    - Mensagens de vazio (mensagemVazio)
 *    - Loading states
 * 
 * 6️⃣ ABAS (TABS):
 *    - Organiza conteúdo complexo
 *    - useState para controlar aba ativa
 *    - Renderiza só o necessário
 * 
 * 7️⃣ FORMATAÇÃO:
 *    - formatarMoeda, formatarData
 *    - Centralizado em utils/formatters
 *    - Consistência visual
 * 
 * 8️⃣ ATOMIC DESIGN:
 *    - Atoms: Button, Card
 *    - Molecules: GraficoLinha, TabelaRanking
 *    - Pages: Relatorios (esta)
 *    - Composição de baixo pra cima
 * 
 * =============================================================================
 */

export default Relatorios;