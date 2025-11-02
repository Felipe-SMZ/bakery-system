// src/services/relatorioService.js

/**
 * 📊 SERVICE DE RELATÓRIOS
 * 
 * Funções para buscar dados de relatórios e dashboard.
 */

import api from './api';

// ============================================================
// 📊 DASHBOARD GERAL
// ============================================================

/**
 * Busca estatísticas gerais para o dashboard
 * 
 * @returns {Promise<Object>} Dados do dashboard
 * 
 * Retorna:
 * - vendas_hoje: { quantidade, valor_total }
 * - vendas_mes: { quantidade, valor_total }
 * - clientes: { total }
 * - produtos: { total, estoque_baixo }
 * - alertas: { clientes_credito_excedido, fiado_em_aberto }
 * - vendas_ultimos_7_dias: [ { data, quantidade, total } ]
 */
export const buscarDashboard = async () => {
    try {
        const response = await api.get('/relatorios/dashboard');
        // Backend retorna response.data.data (objeto completo)
        return response.data.data;
    } catch (error) {
        console.error('Erro ao buscar dashboard:', error);
        throw error;
    }
};

// ============================================================
// 📈 VENDAS POR PERÍODO
// ============================================================

/**
 * Busca vendas agrupadas por período
 * 
 * @param {String} dataInicio - Data início (YYYY-MM-DD)
 * @param {String} dataFim - Data fim (YYYY-MM-DD)
 * @param {String} agrupamento - 'dia', 'semana' ou 'mes'
 * @returns {Promise<Array>} Lista de vendas agrupadas
 */
export const buscarVendasPorPeriodo = async (dataInicio, dataFim, agrupamento = 'dia') => {
    try {
        const response = await api.get('/relatorios/vendas-periodo', {
            params: { 
                data_inicio: dataInicio,
                data_fim: dataFim,
                agrupamento
            }
        });
        // Backend retorna { periodo, resumo, dados: [...] }
        // Extrai apenas o array de dados
        return response.data.data?.dados || [];
    } catch (error) {
        console.error('Erro ao buscar vendas por período:', error);
        throw error;
    }
};

// ============================================================
// 🏆 PRODUTOS MAIS VENDIDOS
// ============================================================

/**
 * Busca ranking de produtos mais vendidos
 * 
 * @param {Object} filtros - Objeto com filtros { data_inicio, data_fim, limite }
 * @returns {Promise<Array>} Lista de produtos
 */
export const buscarProdutosMaisVendidos = async (filtros = {}) => {
    try {
        const response = await api.get('/relatorios/produtos-mais-vendidos', { 
            params: filtros 
        });
        // Extrai o array de dados
        return response.data.data?.dados || [];
    } catch (error) {
        console.error('Erro ao buscar produtos mais vendidos:', error);
        throw error;
    }
};

// ============================================================
// 💳 VENDAS POR FORMA DE PAGAMENTO
// ============================================================

/**
 * Busca distribuição de vendas por forma de pagamento
 * 
 * @param {Object} filtros - Objeto com filtros { data_inicio, data_fim }
 * @returns {Promise<Array>} Distribuição por forma de pagamento
 */
export const buscarVendasPorFormaPagamento = async (filtros = {}) => {
    try {
        const response = await api.get('/relatorios/vendas-por-forma-pagamento', { 
            params: filtros 
        });
        // Extrai o array de dados
        return response.data.data?.dados || [];
    } catch (error) {
        console.error('Erro ao buscar vendas por forma de pagamento:', error);
        throw error;
    }
};

// ============================================================
// 👥 DESEMPENHO DE FUNCIONÁRIOS
// ============================================================

/**
 * Busca ranking de funcionários por vendas
 * 
 * @param {Object} filtros - Objeto com filtros { data_inicio, data_fim }
 * @returns {Promise<Array>} Lista de funcionários
 */
export const buscarDesempenhoFuncionarios = async (filtros = {}) => {
    try {
        const response = await api.get('/relatorios/desempenho-funcionarios', { 
            params: filtros 
        });
        // Extrai o array de dados
        return response.data.data?.dados || [];
    } catch (error) {
        console.error('Erro ao buscar desempenho de funcionários:', error);
        throw error;
    }
};

// ============================================================
// 💰 CLIENTES DEVEDORES
// ============================================================

/**
 * Busca clientes com vendas a fiado em aberto
 * 
 * @returns {Promise<Array>} Lista de clientes devedores
 */
export const buscarClientesDevedores = async () => {
    try {
        const response = await api.get('/relatorios/clientes-devedores');
        // Backend retorna { resumo, dados: [...] }
        return response.data.data?.dados || [];
    } catch (error) {
        console.error('Erro ao buscar clientes devedores:', error);
        throw error;
    }
};

// ============================================================
// 📦 PRODUTOS COM ESTOQUE BAIXO
// ============================================================

/**
 * Busca produtos com estoque abaixo do limite
 * 
 * @param {Number} limite - Estoque mínimo (padrão: 50)
 * @returns {Promise<Array>} Lista de produtos
 */
export const buscarProdutosEstoqueBaixo = async (limite = 50) => {
    try {
        const response = await api.get('/relatorios/produtos-estoque-baixo', {
            params: { limite }
        });
        // Backend retorna { limite, resumo, dados: [...] }
        return response.data.data?.dados || [];
    } catch (error) {
        console.error('Erro ao buscar produtos com estoque baixo:', error);
        throw error;
    }
};

// ============================================================
// 📤 EXPORTAR TODAS AS FUNÇÕES
// ============================================================

const relatorioService = {
    buscarDashboard,
    buscarVendasPorPeriodo,
    buscarProdutosMaisVendidos,
    buscarVendasPorFormaPagamento,
    buscarDesempenhoFuncionarios,
    buscarClientesDevedores,
    buscarProdutosEstoqueBaixo
};

export default relatorioService;