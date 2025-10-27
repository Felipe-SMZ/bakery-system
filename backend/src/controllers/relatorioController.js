// src/controllers/relatorioController.js
const RelatorioService = require('../services/relatorioService');

class RelatorioController {

    // ============================================================
    // GET /api/relatorios/vendas-periodo
    // ============================================================

    /**
     * Relatório de vendas por período
     * 
     * Query params:
     * - data_inicio (obrigatório): YYYY-MM-DD
     * - data_fim (obrigatório): YYYY-MM-DD
     * - agrupamento (opcional): dia, semana, mes (padrão: dia)
     */
    static async vendasPorPeriodo(req, res) {
        try {
            const { data_inicio, data_fim, agrupamento = 'dia' } = req.query;

            const relatorio = await RelatorioService.vendasPorPeriodo(
                data_inicio,
                data_fim,
                agrupamento
            );

            res.json({
                success: true,
                data: relatorio
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // ============================================================
    // GET /api/relatorios/produtos-mais-vendidos
    // ============================================================

    /**
     * Ranking dos produtos mais vendidos
     * 
     * Query params:
     * - data_inicio (opcional): YYYY-MM-DD
     * - data_fim (opcional): YYYY-MM-DD
     * - limite (opcional): número de produtos (padrão: 10)
     */
    static async produtosMaisVendidos(req, res) {
        try {
            const relatorio = await RelatorioService.produtosMaisVendidos(req.query);

            res.json({
                success: true,
                data: relatorio
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // ============================================================
    // GET /api/relatorios/vendas-por-forma-pagamento
    // ============================================================

    /**
     * Distribuição de vendas por forma de pagamento
     * 
     * Query params:
     * - data_inicio (opcional): YYYY-MM-DD
     * - data_fim (opcional): YYYY-MM-DD
     */
    static async vendasPorFormaPagamento(req, res) {
        try {
            const relatorio = await RelatorioService.vendasPorFormaPagamento(req.query);

            res.json({
                success: true,
                data: relatorio
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // ============================================================
    // GET /api/relatorios/desempenho-funcionarios
    // ============================================================

    /**
     * Ranking de funcionários por vendas
     * 
     * Query params:
     * - data_inicio (opcional): YYYY-MM-DD
     * - data_fim (opcional): YYYY-MM-DD
     */
    static async desempenhoFuncionarios(req, res) {
        try {
            const relatorio = await RelatorioService.desempenhoFuncionarios(req.query);

            res.json({
                success: true,
                data: relatorio
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // ============================================================
    // GET /api/relatorios/clientes-devedores
    // ============================================================

    /**
     * Clientes com vendas a fiado em aberto
     */
    static async clientesDevedores(req, res) {
        try {
            const relatorio = await RelatorioService.clientesDevedores();

            res.json({
                success: true,
                data: relatorio
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // ============================================================
    // GET /api/relatorios/produtos-estoque-baixo
    // ============================================================

    /**
     * Produtos com estoque abaixo do limite
     * 
     * Query params:
     * - limite (opcional): estoque mínimo (padrão: 50)
     */
    static async produtosEstoqueBaixo(req, res) {
        try {
            const { limite = 50 } = req.query;

            const relatorio = await RelatorioService.produtosEstoqueBaixo(limite);

            res.json({
                success: true,
                data: relatorio
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // ============================================================
    // GET /api/relatorios/dashboard
    // ============================================================

    /**
     * Dashboard com estatísticas gerais
     */
    static async dashboardGeral(req, res) {
        try {
            const dashboard = await RelatorioService.dashboardGeral();

            res.json({
                success: true,
                data: dashboard
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = RelatorioController;