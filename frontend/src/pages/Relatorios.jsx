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
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Vendas Hoje */}
                <Card>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Vendas Hoje</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {dashboard ? formatarMoeda(dashboard.vendas_hoje?.valor_total || 0) : '...'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {dashboard?.vendas_hoje?.quantidade || 0} vendas
                            </p>
                        </div>
                        <div className="p-3 bg-primary-100 rounded-lg">
                            <ShoppingCart className="text-primary-600" size={24} />
                        </div>
                    </div>
                </Card>
                
                {/* Vendas do Mês */}
                <Card>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Vendas do Mês</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {dashboard ? formatarMoeda(dashboard.vendas_mes?.valor_total || 0) : '...'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {dashboard?.vendas_mes?.quantidade || 0} vendas
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <TrendingUp className="text-green-600" size={24} />
                        </div>
                    </div>
                </Card>
                
                {/* Total Clientes */}
                <Card>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Clientes</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {dashboard?.clientes?.total || 0}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                cadastrados
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Users className="text-blue-600" size={24} />
                        </div>
                    </div>
                </Card>
                
                {/* Total Produtos */}
                <Card>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Produtos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {dashboard?.produtos?.total || 0}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {dashboard?.produtos?.estoque_baixo || 0} estoque baixo
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Package className="text-purple-600" size={24} />
                        </div>
                    </div>
                </Card>
            </div>
            
            {/* Gráfico de Evolução (Últimos 7 Dias) */}
            {Array.isArray(vendasPeriodo) && vendasPeriodo.length > 0 && (
                <GraficoLinha
                    dados={vendasPeriodo}
                    chaveX="periodo"
                    chaveY="valor_total"
                    titulo="📈 Evolução de Vendas - Últimos 7 Dias"
                    cor="#10b981"
                    altura={350}
                />
            )}
            
            {/* Alertas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Devedores */}
                {Array.isArray(devedores) && devedores.length > 0 && (
                    <Card>
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="text-red-600" size={20} />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Clientes Devedores
                            </h3>
                            <span className="ml-auto px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                                {devedores.length}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">
                            Total em crédito: <strong className="text-red-600">
                                {formatarMoeda(devedores.reduce((sum, d) => sum + (parseFloat(d.total_em_aberto) || 0), 0))}
                            </strong>
                        </p>
                    </Card>
                )}
                
                {/* Estoque Baixo */}
                {Array.isArray(estoqueBaixo) && estoqueBaixo.length > 0 && (
                    <Card>
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="text-yellow-600" size={20} />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Produtos com Estoque Baixo
                            </h3>
                            <span className="ml-auto px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                                {estoqueBaixo.length}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">
                            Produtos abaixo do estoque mínimo
                        </p>
                    </Card>
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
            <FiltrosPeriodo
                filtros={filtros}
                onChange={handleFiltrosChange}
                mostrarAtalhos={true}
                compacto={false}
            />
            
            {/* Gráfico de Barras - Top 10 */}
            {Array.isArray(produtosTop) && produtosTop.length > 0 && (
                <GraficoBarra
                    dados={produtosTop}
                    chaveX="produto"
                    chaveY="faturamento_total"
                    titulo="🏆 Top 10 Produtos Mais Vendidos"
                    orientacao="horizontal"
                    mostrarRanking={true}
                    altura={400}
                />
            )}
            
            {/* Tabela Detalhada */}
            {Array.isArray(produtosTop) && produtosTop.length > 0 && (
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
            )}
        </div>
    );
    
    // =========================================================================
    // 🎯 RENDERIZAÇÃO - ABA PAGAMENTOS
    // =========================================================================
    
    const renderPagamentos = () => (
        <div className="space-y-6">
            {/* Filtros */}
            <FiltrosPeriodo
                filtros={filtros}
                onChange={handleFiltrosChange}
                mostrarAtalhos={true}
                compacto={false}
            />
            
            {/* Gráfico de Pizza */}
            {Array.isArray(formasPagamento) && formasPagamento.length > 0 && (
                <GraficoPizza
                    dados={formasPagamento}
                    chaveNome="forma_pagamento"
                    chaveValor="valor_total"
                    titulo="💳 Distribuição por Forma de Pagamento"
                    altura={400}
                />
            )}
            
            {/* Tabela */}
            {Array.isArray(formasPagamento) && formasPagamento.length > 0 && (
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
            )}
        </div>
    );
    
    // =========================================================================
    // 🎯 RENDERIZAÇÃO - ABA FUNCIONÁRIOS
    // =========================================================================
    
    const renderFuncionarios = () => (
        <div className="space-y-6">
            {/* Filtros */}
            <FiltrosPeriodo
                filtros={filtros}
                onChange={handleFiltrosChange}
                mostrarAtalhos={true}
                compacto={false}
            />
            
            {/* Gráfico de Barras */}
            {Array.isArray(funcionarios) && funcionarios.length > 0 && (
                <GraficoBarra
                    dados={funcionarios}
                    chaveX="funcionario"
                    chaveY="valor_total_vendido"
                    titulo="👥 Desempenho de Funcionários"
                    orientacao="horizontal"
                    mostrarRanking={true}
                    altura={400}
                />
            )}
            
            {/* Tabela */}
            {Array.isArray(funcionarios) && funcionarios.length > 0 && (
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
        );
    };
    
    // =========================================================================
    // 🎯 RENDERIZAÇÃO PRINCIPAL
    // =========================================================================
    
    return (
        <div className="p-6 space-y-6">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        📊 Relatórios
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Análises e indicadores do seu negócio
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
                >
                    {carregando ? 'Atualizando...' : '🔄 Atualizar'}
                </Button>
            </div>
            
            {/* Abas (Tabs) */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-4">
                    {[
                        { id: 'dashboard', label: '📊 Dashboard', icone: BarChart3 },
                        { id: 'produtos', label: '🛒 Produtos', icone: Package },
                        { id: 'pagamentos', label: '💳 Pagamentos', icone: DollarSign },
                        { id: 'funcionarios', label: '👥 Funcionários', icone: Users },
                        { id: 'devedores', label: '💰 Devedores', icone: AlertCircle },
                        { id: 'estoque', label: '📦 Estoque', icone: Package }
                    ].map(aba => {
                        const Icone = aba.icone;
                        return (
                            <button
                                key={aba.id}
                                onClick={() => setAbaAtiva(aba.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors
                                    ${abaAtiva === aba.id 
                                        ? 'border-primary-600 text-primary-600' 
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }
                                `}
                            >
                                <Icone size={18} />
                                {aba.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
            
            {/* Conteúdo da Aba Ativa */}
            <div>
                {abaAtiva === 'dashboard' && renderDashboard()}
                {abaAtiva === 'produtos' && renderProdutos()}
                {abaAtiva === 'pagamentos' && renderPagamentos()}
                {abaAtiva === 'funcionarios' && renderFuncionarios()}
                {abaAtiva === 'devedores' && renderDevedores()}
                {abaAtiva === 'estoque' && renderEstoque()}
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