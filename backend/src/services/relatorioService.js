// src/services/relatorioService.js
const RelatorioModel = require('../models/relatorioModel');

class RelatorioService {

    // ============================================================
    // VENDAS POR PERÍODO
    // ============================================================

    /**
     * Relatório de vendas por período com agrupamento
     */
    static async vendasPorPeriodo(dataInicio, dataFim, agrupamento = 'dia') {
        try {
            // Validar datas
            if (!dataInicio || !dataFim) {
                throw new Error('Data início e data fim são obrigatórias');
            }

            // Validar agrupamento
            if (!['dia', 'semana', 'mes'].includes(agrupamento)) {
                throw new Error('Agrupamento inválido. Use: dia, semana ou mes');
            }

            const dados = await RelatorioModel.vendasPorPeriodo(dataInicio, dataFim, agrupamento);

            // Calcular totais gerais
            const totais = dados.reduce((acc, item) => ({
                total_vendas: acc.total_vendas + parseInt(item.Total_Vendas),
                valor_total: acc.valor_total + parseFloat(item.Valor_Total)
            }), { total_vendas: 0, valor_total: 0 });

            return {
                periodo: {
                    inicio: dataInicio,
                    fim: dataFim,
                    agrupamento: agrupamento
                },
                resumo: {
                    total_vendas: totais.total_vendas,
                    valor_total: totais.valor_total.toFixed(2),
                    ticket_medio: totais.total_vendas > 0
                        ? (totais.valor_total / totais.total_vendas).toFixed(2)
                        : 0
                },
                dados: dados.map(item => ({
                    periodo: item.Periodo,
                    total_vendas: parseInt(item.Total_Vendas),
                    valor_total: parseFloat(item.Valor_Total).toFixed(2),
                    ticket_medio: parseFloat(item.Ticket_Medio).toFixed(2),
                    menor_venda: parseFloat(item.Menor_Venda).toFixed(2),
                    maior_venda: parseFloat(item.Maior_Venda).toFixed(2)
                }))
            };
        } catch (error) {
            throw error;
        }
    }

    // ============================================================
    // PRODUTOS MAIS VENDIDOS
    // ============================================================

    /**
     * Ranking dos produtos mais vendidos
     */
    static async produtosMaisVendidos(filtros = {}) {
        try {
            const { data_inicio, data_fim, limite = 10 } = filtros;

            const dados = await RelatorioModel.produtosMaisVendidos(
                data_inicio,
                data_fim,
                parseInt(limite)
            );

            // Calcular totais
            const totais = dados.reduce((acc, item) => ({
                total_vendido: acc.total_vendido + parseFloat(item.Total_Vendido),
                faturamento_total: acc.faturamento_total + parseFloat(item.Faturamento_Total)
            }), { total_vendido: 0, faturamento_total: 0 });

            return {
                periodo: data_inicio && data_fim ? { inicio: data_inicio, fim: data_fim } : null,
                limite: parseInt(limite),
                resumo: {
                    faturamento_total: totais.faturamento_total.toFixed(2)
                },
                dados: dados.map((item, index) => ({
                    posicao: index + 1,
                    id_produto: item.ID_Produto,
                    produto: item.Produto,
                    tipo: item.Tipo,
                    unidade_medida: item.Unidade_Medida,
                    total_vendido: parseFloat(item.Total_Vendido),
                    quantidade_vendas: parseInt(item.Quantidade_Vendas),
                    faturamento_total: parseFloat(item.Faturamento_Total).toFixed(2),
                    preco_medio: parseFloat(item.Preco_Medio).toFixed(2),
                    percentual_faturamento: totais.faturamento_total > 0
                        ? ((parseFloat(item.Faturamento_Total) / totais.faturamento_total) * 100).toFixed(2)
                        : 0
                }))
            };
        } catch (error) {
            throw new Error('Erro ao buscar produtos mais vendidos: ' + error.message);
        }
    }

    // ============================================================
    // VENDAS POR FORMA DE PAGAMENTO
    // ============================================================

    /**
     * Distribuição de vendas por forma de pagamento
     */
    static async vendasPorFormaPagamento(filtros = {}) {
        try {
            const { data_inicio, data_fim } = filtros;

            const dados = await RelatorioModel.vendasPorFormaPagamento(data_inicio, data_fim);

            // Calcular totais
            const totais = dados.reduce((acc, item) => ({
                quantidade_vendas: acc.quantidade_vendas + parseInt(item.Quantidade_Vendas),
                valor_total: acc.valor_total + parseFloat(item.Valor_Total)
            }), { quantidade_vendas: 0, valor_total: 0 });

            return {
                periodo: data_inicio && data_fim ? { inicio: data_inicio, fim: data_fim } : null,
                resumo: {
                    total_vendas: totais.quantidade_vendas,
                    valor_total: totais.valor_total.toFixed(2)
                },
                dados: dados.map(item => ({
                    forma_pagamento: item.Tipo_Pagamento,
                    quantidade_vendas: parseInt(item.Quantidade_Vendas),
                    valor_total: parseFloat(item.Valor_Total).toFixed(2),
                    ticket_medio: parseFloat(item.Ticket_Medio).toFixed(2),
                    percentual_quantidade: parseFloat(item.Percentual_Quantidade).toFixed(2),
                    percentual_valor: parseFloat(item.Percentual_Valor).toFixed(2)
                }))
            };
        } catch (error) {
            throw new Error('Erro ao buscar vendas por forma de pagamento: ' + error.message);
        }
    }

    // ============================================================
    // DESEMPENHO DE FUNCIONÁRIOS
    // ============================================================

    /**
     * Ranking de funcionários por vendas
     */
    static async desempenhoFuncionarios(filtros = {}) {
        try {
            const { data_inicio, data_fim } = filtros;

            const dados = await RelatorioModel.desempenhoFuncionarios(data_inicio, data_fim);

            // Calcular totais
            const totais = dados.reduce((acc, item) => ({
                total_vendas: acc.total_vendas + parseInt(item.Total_Vendas || 0),
                valor_total: acc.valor_total + parseFloat(item.Valor_Total_Vendido || 0)
            }), { total_vendas: 0, valor_total: 0 });

            return {
                periodo: data_inicio && data_fim ? { inicio: data_inicio, fim: data_fim } : null,
                resumo: {
                    total_vendas: totais.total_vendas,
                    valor_total: totais.valor_total.toFixed(2),
                    ticket_medio: totais.total_vendas > 0
                        ? (totais.valor_total / totais.total_vendas).toFixed(2)
                        : 0
                },
                dados: dados.map((item, index) => ({
                    posicao: index + 1,
                    id_funcionario: item.ID_Funcionario,
                    funcionario: item.Funcionario,
                    cargo: item.Cargo,
                    total_vendas: parseInt(item.Total_Vendas || 0),
                    valor_total_vendido: parseFloat(item.Valor_Total_Vendido || 0).toFixed(2),
                    ticket_medio: parseFloat(item.Ticket_Medio || 0).toFixed(2),
                    menor_venda: item.Menor_Venda ? parseFloat(item.Menor_Venda).toFixed(2) : null,
                    maior_venda: item.Maior_Venda ? parseFloat(item.Maior_Venda).toFixed(2) : null,
                    percentual_vendas: totais.total_vendas > 0
                        ? ((parseInt(item.Total_Vendas || 0) / totais.total_vendas) * 100).toFixed(2)
                        : 0
                }))
            };
        } catch (error) {
            throw new Error('Erro ao buscar desempenho de funcionários: ' + error.message);
        }
    }

    // ============================================================
    // CLIENTES DEVEDORES
    // ============================================================

    /**
     * Relatório de clientes com fiado em aberto
     */
    static async clientesDevedores() {
        try {
            const dados = await RelatorioModel.clientesDevedores();

            // Calcular totais
            const totais = dados.reduce((acc, item) => ({
                quantidade_clientes: acc.quantidade_clientes + 1,
                quantidade_vendas: acc.quantidade_vendas + parseInt(item.Quantidade_Vendas_Abertas),
                total_em_aberto: acc.total_em_aberto + parseFloat(item.Total_Em_Aberto)
            }), { quantidade_clientes: 0, quantidade_vendas: 0, total_em_aberto: 0 });

            return {
                resumo: {
                    quantidade_clientes: totais.quantidade_clientes,
                    quantidade_vendas: totais.quantidade_vendas,
                    total_em_aberto: totais.total_em_aberto.toFixed(2)
                },
                dados: dados.map(item => ({
                    id_cliente: item.ID_Cliente,
                    cliente: item.Cliente,
                    telefone: item.Telefone,
                    status: item.Status,
                    limite_fiado: parseFloat(item.Limite_Fiado).toFixed(2),
                    quantidade_vendas_abertas: parseInt(item.Quantidade_Vendas_Abertas),
                    total_em_aberto: parseFloat(item.Total_Em_Aberto).toFixed(2),
                    credito_disponivel: parseFloat(item.Credito_Disponivel).toFixed(2),
                    venda_mais_antiga: item.Venda_Mais_Antiga,
                    dias_mais_antigo: parseInt(item.Dias_Mais_Antigo),
                    situacao: parseFloat(item.Credito_Disponivel) < 0 ? 'EXCEDIDO' : 'EM_DIA'
                }))
            };
        } catch (error) {
            throw new Error('Erro ao buscar clientes devedores: ' + error.message);
        }
    }

    // ============================================================
    // PRODUTOS COM ESTOQUE BAIXO
    // ============================================================

    /**
     * Relatório de produtos com estoque abaixo do limite
     */
    static async produtosEstoqueBaixo(limite = 50) {
        try {
            const dados = await RelatorioModel.produtosEstoqueBaixo(parseInt(limite));

            // Calcular totais
            const totais = dados.reduce((acc, item) => ({
                quantidade_produtos: acc.quantidade_produtos + 1,
                valor_estoque: acc.valor_estoque + parseFloat(item.Valor_Estoque)
            }), { quantidade_produtos: 0, valor_estoque: 0 });

            return {
                limite: parseInt(limite),
                resumo: {
                    quantidade_produtos: totais.quantidade_produtos,
                    valor_total_estoque: totais.valor_estoque.toFixed(2)
                },
                dados: dados.map(item => ({
                    id_produto: item.ID_Produto,
                    produto: item.Produto,
                    tipo: item.Tipo,
                    unidade_medida: item.Unidade_Medida,
                    estoque_atual: parseFloat(item.Estoque_Atual),
                    preco_base: parseFloat(item.Preco_Base).toFixed(2),
                    valor_estoque: parseFloat(item.Valor_Estoque).toFixed(2),
                    alerta: item.Estoque_Atual < 10 ? 'CRÍTICO'
                        : item.Estoque_Atual < 30 ? 'ATENÇÃO'
                            : 'BAIXO'
                }))
            };
        } catch (error) {
            throw new Error('Erro ao buscar produtos com estoque baixo: ' + error.message);
        }
    }

    // ============================================================
    // DASHBOARD GERAL
    // ============================================================

    /**
     * Estatísticas gerais para dashboard
     */
    static async dashboardGeral() {
        try {
            const estatisticas = await RelatorioModel.dashboardGeral();
            const vendas7Dias = await RelatorioModel.vendasUltimos7Dias();

            return {
                ...estatisticas,
                vendas_ultimos_7_dias: vendas7Dias.map(item => ({
                    data: item.Data,
                    quantidade: parseInt(item.Quantidade),
                    total: parseFloat(item.Total).toFixed(2)
                }))
            };
        } catch (error) {
            throw new Error('Erro ao buscar dashboard geral: ' + error.message);
        }
    }
}

module.exports = RelatorioService;