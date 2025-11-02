// ════════════════════════════════════════════════════════════
// src/pages/Vendas.jsx
// ════════════════════════════════════════════════════════════

/**
 * 📋 TELA DE LISTAGEM DE VENDAS
 * 
 * Exibe todas as vendas registradas com filtros e detalhes.
 * 
 * 📚 CONCEITOS APRENDIDOS AQUI:
 * 
 * 1. TABELAS DINÂMICAS
 *    - Renderizar dados em formato tabular
 *    - Aplicar estilos condicionais (status, forma pagamento)
 * 
 * 2. FILTROS
 *    - Filtrar por período (data início e fim)
 *    - Filtrar por forma de pagamento
 *    - Filtrar por cliente/funcionário
 * 
 * 3. MODAL DE DETALHES
 *    - Abrir popup com informações completas da venda
 *    - Exibir itens da venda
 * 
 * 4. AÇÕES EM VENDAS
 *    - Visualizar detalhes
 *    - Quitar venda a fiado
 * 
 * 5. FORMATAÇÃO DE DADOS
 *    - Datas legíveis
 *    - Valores monetários
 *    - Status visual (badges)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import { 
    listarVendas, 
    buscarVendaPorId, 
    quitarVendaFiado 
} from '../services/vendaService';
import { formatarMoeda, formatarDataHora, formatarQuantidade } from '../utils/formatters';

const Vendas = () => {
    const navigate = useNavigate();

    // ============================================================
    // 📊 ESTADOS
    // ============================================================

    // Dados
    const [vendas, setVendas] = useState([]);
    const [vendaSelecionada, setVendaSelecionada] = useState(null);

    // Filtros
    const [filtros, setFiltros] = useState({
        periodo_inicio: '',
        periodo_fim: '',
        tipo_pagamento: '',
        cliente: '',
        funcionario: ''
    });

    // Controles
    const [loading, setLoading] = useState(true);
    const [modalDetalhes, setModalDetalhes] = useState(false);
    const [quitando, setQuitando] = useState(false);
    const [mostrarApenasAbertos, setMostrarApenasAbertos] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    // ============================================================
    // 🔄 CARREGAR VENDAS
    // ============================================================

    useEffect(() => {
        carregarVendas();
    }, []);

    /**
     * Busca vendas da API (com ou sem filtros)
     */
    const carregarVendas = async () => {
        try {
            setLoading(true);
            setErro('');

            // Montar filtros limpos (remover vazios)
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
            console.error('Erro ao carregar vendas:', error);
            setErro('Erro ao carregar vendas. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Aplica filtros e recarrega a lista
     */
    const aplicarFiltros = () => {
        carregarVendas();
    };

    /**
     * Limpa todos os filtros
     */
    const limparFiltros = () => {
        setFiltros({
            periodo_inicio: '',
            periodo_fim: '',
            tipo_pagamento: '',
            cliente: '',
            funcionario: ''
        });
        setMostrarApenasAbertos(false);
        // Recarregar sem filtros
        setTimeout(() => carregarVendas(), 100);
    };

    /**
     * Ativa/desativa filtro de fiados em aberto
     */
    const toggleFiadosAbertos = () => {
        setMostrarApenasAbertos(!mostrarApenasAbertos);
    };

    /**
     * Filtra vendas para mostrar apenas fiados em aberto
     */
    const vendasFiltradas = mostrarApenasAbertos
        ? vendas.filter(venda => venda.Tipo_Pagamento === 'fiado' && venda.Status_Pagamento === 'Em Aberto')
        : vendas;

    // ============================================================
    // 👁️ VISUALIZAR DETALHES
    // ============================================================

    /**
     * Abre modal com detalhes completos da venda
     */
    const visualizarDetalhes = async (vendaId) => {
        try {
            setErro('');
            
            // Buscar venda completa (com itens)
            const vendaCompleta = await buscarVendaPorId(vendaId);
            setVendaSelecionada(vendaCompleta);
            setModalDetalhes(true);

        } catch (error) {
            console.error('Erro ao buscar detalhes:', error);
            setErro('Erro ao carregar detalhes da venda.');
        }
    };

    /**
     * Fecha modal de detalhes
     */
    const fecharModal = () => {
        setModalDetalhes(false);
        setVendaSelecionada(null);
    };

    // ============================================================
    // 💰 QUITAR VENDA A FIADO
    // ============================================================

    /**
     * Registra quitação de venda a fiado
     */
    const quitar = async (vendaId) => {
        // Confirmar ação
        const confirmar = window.confirm('Deseja realmente quitar esta venda?');
        if (!confirmar) return;

        try {
            setQuitando(true);
            setErro('');

            // Quitar venda
            await quitarVendaFiado(vendaId);

            // Feedback e recarregar
            setSucesso('Venda quitada com sucesso!');
            carregarVendas();

            // Limpar mensagem após 3 segundos
            setTimeout(() => setSucesso(''), 3000);

        } catch (error) {
            console.error('Erro ao quitar venda:', error);
            setErro(error.response?.data?.error || 'Erro ao quitar venda.');
        } finally {
            setQuitando(false);
        }
    };

    // ============================================================
    // 🎨 FUNÇÕES DE ESTILO
    // ============================================================

    /**
     * Retorna cor do badge de acordo com forma de pagamento
     */
    const getCorFormaPagamento = (tipo) => {
        const cores = {
            'dinheiro': 'bg-green-100 text-green-800',
            'cartao': 'bg-blue-100 text-blue-800',
            'pix': 'bg-purple-100 text-purple-800',
            'fiado': 'bg-yellow-100 text-yellow-800'
        };
        return cores[tipo] || 'bg-gray-100 text-gray-800';
    };

    /**
     * Retorna ícone de acordo com forma de pagamento
     */
    const getIconeFormaPagamento = (tipo) => {
        const icones = {
            'dinheiro': '💵',
            'cartao': '💳',
            'pix': '📱',
            'fiado': '📋'
        };
        return icones[tipo] || '❓';
    };

    /**
     * Retorna cor do badge de status de pagamento
     */
    const getCorStatusPagamento = (status) => {
        const cores = {
            'Pago': 'bg-green-100 text-green-800',
            'Em Aberto': 'bg-red-100 text-red-800',
            'Quitado': 'bg-blue-100 text-blue-800'
        };
        return cores[status] || 'bg-gray-100 text-gray-800';
    };

    // ============================================================
    // 🎨 RENDERIZAÇÃO
    // ============================================================

    if (loading) {
        return <Loading mensagem="Carregando vendas..." />;
    }

    return (
        <div className="space-y-6">
            {/* ===== CABEÇALHO ===== */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Vendas</h1>
                    <p className="text-gray-600 mt-1">
                        {mostrarApenasAbertos 
                            ? `📋 Exibindo ${vendasFiltradas.length} fiado(s) em aberto`
                            : `Gerencie todas as vendas realizadas`
                        }
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button 
                        variant={mostrarApenasAbertos ? "warning" : "secondary"}
                        size="lg"
                        onClick={toggleFiadosAbertos}
                        className="font-bold"
                    >
                        {mostrarApenasAbertos ? '📋 Ver Todas' : '📋 Fiados em Aberto'}
                    </Button>
                    <Button 
                        variant="success" 
                        size="lg"
                        onClick={() => navigate('/vendas/nova')}
                    >
                        ➕ Nova Venda
                    </Button>
                </div>
            </div>

            {/* ===== MENSAGENS ===== */}
            {erro && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {erro}
                </div>
            )}

            {sucesso && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {sucesso}
                </div>
            )}

            {/* ===== RESUMO FIADOS EM ABERTO ===== */}
            {mostrarApenasAbertos && vendasFiltradas.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card titulo="💰 Total em Aberto">
                        <div className="text-center py-4">
                            <p className="text-4xl font-bold text-red-600">
                                {formatarMoeda(vendasFiltradas.reduce((sum, v) => sum + parseFloat(v.Valor_Total), 0))}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">Valor total a receber</p>
                        </div>
                    </Card>
                    
                    <Card titulo="📋 Quantidade">
                        <div className="text-center py-4">
                            <p className="text-4xl font-bold text-yellow-600">
                                {vendasFiltradas.length}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">Vendas pendentes</p>
                        </div>
                    </Card>
                    
                    <Card titulo="👥 Clientes Devedores">
                        <div className="text-center py-4">
                            <p className="text-4xl font-bold text-orange-600">
                                {new Set(vendasFiltradas.map(v => v.Cliente)).size}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">Clientes únicos</p>
                        </div>
                    </Card>
                </div>
            )}

            {/* ===== FILTROS ===== */}
            <Card titulo="🔍 Filtros">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {/* Data Início */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Data Início</label>
                        <input
                            type="date"
                            value={filtros.periodo_inicio}
                            onChange={(e) => setFiltros({...filtros, periodo_inicio: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                    </div>

                    {/* Data Fim */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Data Fim</label>
                        <input
                            type="date"
                            value={filtros.periodo_fim}
                            onChange={(e) => setFiltros({...filtros, periodo_fim: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                    </div>

                    {/* Forma de Pagamento */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Forma de Pagamento</label>
                        <select
                            value={filtros.tipo_pagamento}
                            onChange={(e) => setFiltros({...filtros, tipo_pagamento: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                            <option value="">Todas</option>
                            <option value="dinheiro">💵 Dinheiro</option>
                            <option value="cartao">💳 Cartão</option>
                            <option value="pix">📱 PIX</option>
                            <option value="fiado">📋 Fiado</option>
                        </select>
                    </div>

                    {/* Botões */}
                    <div className="flex items-end gap-2 md:col-span-3 lg:col-span-2">
                        <Button 
                            variant="primary" 
                            onClick={aplicarFiltros}
                            className="flex-1"
                        >
                            🔍 Filtrar
                        </Button>
                        <Button 
                            variant="secondary" 
                            onClick={limparFiltros}
                            className="flex-1"
                        >
                            🔄 Limpar
                        </Button>
                    </div>
                </div>
            </Card>

            {/* ===== LISTA DE VENDAS ===== */}
            <Card titulo={`📋 ${mostrarApenasAbertos ? 'Fiados em Aberto' : 'Vendas Registradas'} (${vendasFiltradas.length})`}>
                {vendasFiltradas.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        <p className="text-5xl mb-3">{mostrarApenasAbertos ? '�' : '�🛒'}</p>
                        <p className="text-xl">
                            {mostrarApenasAbertos 
                                ? 'Nenhum fiado em aberto' 
                                : 'Nenhuma venda encontrada'
                            }
                        </p>
                        <p className="text-sm mt-2">
                            {mostrarApenasAbertos 
                                ? '🎉 Ótimo! Todos os fiados foram quitados.' 
                                : 'Tente ajustar os filtros ou registre uma nova venda'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Funcionário</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pagamento</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {vendasFiltradas.map((venda) => (
                                    <tr key={venda.ID_Venda} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{venda.ID_Venda}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatarDataHora(venda.Data_Hora)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {venda.Cliente}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {venda.Funcionario}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCorFormaPagamento(venda.Tipo_Pagamento)}`}>
                                                {getIconeFormaPagamento(venda.Tipo_Pagamento)} {venda.Tipo_Pagamento.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            {formatarMoeda(venda.Valor_Total)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCorStatusPagamento(venda.Status_Pagamento)}`}>
                                                {venda.Status_Pagamento}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => visualizarDetalhes(venda.ID_Venda)}
                                                >
                                                    👁️
                                                </Button>
                                                {venda.Status_Pagamento === 'Em Aberto' && (
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => quitar(venda.ID_Venda)}
                                                        disabled={quitando}
                                                    >
                                                        💰
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* ===== MODAL DE DETALHES ===== */}
            <Modal 
                isOpen={modalDetalhes}
                title={`Detalhes da Venda #${vendaSelecionada?.ID_Venda || ''}`}
                onClose={fecharModal}
                size="lg"
            >
                {vendaSelecionada && (
                    <div className="space-y-6">
                        {/* Informações Gerais */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs text-blue-600 uppercase font-semibold mb-1">Data/Hora</p>
                                <p className="text-lg font-bold text-gray-800">{formatarDataHora(vendaSelecionada.Data_Hora)}</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <p className="text-xs text-purple-600 uppercase font-semibold mb-1">Cliente</p>
                                <p className="text-lg font-bold text-gray-800">{vendaSelecionada.Cliente}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-xs text-green-600 uppercase font-semibold mb-1">Funcionário</p>
                                <p className="text-lg font-bold text-gray-800">{vendaSelecionada.Funcionario}</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                <p className="text-xs text-orange-600 uppercase font-semibold mb-1">Forma de Pagamento</p>
                                <p className="text-lg font-bold text-gray-800">
                                    {getIconeFormaPagamento(vendaSelecionada.Tipo_Pagamento)} {vendaSelecionada.Tipo_Pagamento.toUpperCase()}
                                </p>
                            </div>
                            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                <p className="text-xs text-indigo-600 uppercase font-semibold mb-1">Status</p>
                                <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full ${getCorStatusPagamento(vendaSelecionada.Status_Pagamento)}`}>
                                    {vendaSelecionada.Status_Pagamento}
                                </span>
                            </div>
                            {vendaSelecionada.Data_Pagamento_Fiado && (
                                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                                    <p className="text-xs text-teal-600 uppercase font-semibold mb-1">Data de Quitação</p>
                                    <p className="text-lg font-bold text-gray-800">{formatarDataHora(vendaSelecionada.Data_Pagamento_Fiado)}</p>
                                </div>
                            )}
                        </div>

                        {/* Itens da Venda */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="text-2xl">📦</span>
                                Itens da Venda
                            </h3>
                            <div className="space-y-3">
                                {vendaSelecionada.itens && vendaSelecionada.itens.length > 0 ? (
                                    vendaSelecionada.itens.map((item, index) => (
                                        <div key={index} className="flex justify-between items-start p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-800 text-lg">{item.Produto}</p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    <span className="font-semibold">{formatarQuantidade(item.Quantidade, item.Unidade_Medida)}</span> × <span className="font-semibold">{formatarMoeda(item.Preco_Unitario)}</span>
                                                </p>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="text-xs text-gray-500 uppercase">Subtotal</p>
                                                <p className="text-xl font-bold text-blue-600">{formatarMoeda(item.Subtotal)}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-4">Nenhum item encontrado</p>
                                )}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-gray-800">VALOR TOTAL:</span>
                                <span className="text-4xl font-bold text-blue-600">
                                    {formatarMoeda(vendaSelecionada.Valor_Total)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Vendas;
