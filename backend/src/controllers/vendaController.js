// src/controllers/vendaController.js
const VendaService = require('../services/vendaService');

class VendaController {

    // ============================================================
    // POST /api/vendas - CRIAR VENDA
    // ============================================================

    /**
     * Cria uma nova venda
     * 
     * Body esperado:
     * {
     *   "id_cliente": 3,
     *   "id_funcionario": 2,
     *   "tipo_pagamento": "fiado",
     *   "itens": [
     *     { "id_produto": 1, "quantidade": 10 },
     *     { "id_produto": 8, "quantidade": 2 }
     *   ]
     * }
     * 
     * FLUXO:
     * 1. Recebe dados do body
     * 2. Chama VendaService.criar()
     * 3. Service faz TODAS as validações
     * 4. Service cria venda com transação
     * 5. Retorna venda criada ou erro
     */
    static async criar(req, res) {
        try {
            // Receber dados do request
            const dados = req.body;

            // Chamar service que faz toda a mágica
            const vendaCriada = await VendaService.criar(dados);

            // Retornar sucesso com status 201 (Created)
            res.status(201).json({
                success: true,
                message: 'Venda realizada com sucesso',
                data: vendaCriada
            });

        } catch (error) {
            // Se tem array de erros (validações múltiplas)
            if (error.errors && Array.isArray(error.errors)) {
                return res.status(400).json({
                    success: false,
                    errors: error.errors
                });
            }

            // Erro único (estoque, crédito, etc)
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // ============================================================
    // GET /api/vendas - LISTAR VENDAS
    // ============================================================

    /**
     * Lista vendas com filtros opcionais
     * 
     * Query params possíveis:
     * - periodo_inicio (YYYY-MM-DD)
     * - periodo_fim (YYYY-MM-DD)
     * - cliente (ID)
     * - funcionario (ID)
     * - tipo_pagamento (dinheiro, cartao, pix, fiado)
     * 
     * Exemplos:
     * GET /api/vendas
     * GET /api/vendas?periodo_inicio=2025-10-01&periodo_fim=2025-10-31
     * GET /api/vendas?cliente=3
     * GET /api/vendas?tipo_pagamento=fiado
     */
    static async listarTodas(req, res) {
        try {
            // Pegar filtros da query string
            const filtros = req.query;

            // Buscar vendas com filtros aplicados
            const vendas = await VendaService.listarVendas(filtros);

            res.json({
                success: true,
                total: vendas.length,
                filtros: filtros,
                data: vendas
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // ============================================================
    // GET /api/vendas/:id - BUSCAR VENDA ESPECÍFICA
    // ============================================================

    /**
     * Busca uma venda específica com todos os seus itens
     * 
     * Retorna:
     * - Dados da venda (cliente, funcionário, data, valor)
     * - Lista de itens (produtos, quantidades, preços)
     * - Status de pagamento
     */
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            // Buscar venda completa (cabeçalho + itens)
            const venda = await VendaService.buscarPorId(id);

            res.json({
                success: true,
                data: venda
            });

        } catch (error) {
            const statusCode = error.message.includes('não encontrada') ? 404 : 500;

            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    // ============================================================
    // GET /api/vendas/fiado/em-aberto - VENDAS A FIADO EM ABERTO
    // ============================================================

    /**
     * Lista todas as vendas a fiado que ainda não foram quitadas
     * 
     * Útil para:
     * - Relatório de devedores
     * - Controle de caixa
     * - Cobrança
     */
    static async listarFiadoEmAberto(req, res) {
        try {
            const vendas = await VendaService.listarFiadoEmAberto();

            // Calcular total em aberto
            const totalEmAberto = vendas.reduce(
                (total, venda) => total + parseFloat(venda.Valor_Total),
                0
            );

            res.json({
                success: true,
                total_vendas: vendas.length,
                total_em_aberto: totalEmAberto.toFixed(2),
                data: vendas
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // ============================================================
    // PATCH /api/vendas/:id/quitar - QUITAR VENDA A FIADO
    // ============================================================

    /**
     * Registra a quitação de uma venda a fiado
     * 
     * O que faz:
     * - Verifica se é venda a fiado
     * - Verifica se ainda não foi quitada
     * - Registra a data de pagamento
     * - Libera o crédito do cliente
     */
    static async quitarFiado(req, res) {
        try {
            const { id } = req.params;

            // Quitar venda
            const vendaAtualizada = await VendaService.quitarFiado(id);

            res.json({
                success: true,
                message: 'Venda quitada com sucesso',
                data: vendaAtualizada
            });

        } catch (error) {
            const statusCode = error.message.includes('não encontrada') ? 404 : 400;

            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    // ============================================================
    // GET /api/vendas/relatorio/resumo - RESUMO GERAL
    // ============================================================

    /**
     * Retorna um resumo geral das vendas
     * (pode ser expandido conforme necessidade)
     */
    static async obterResumo(req, res) {
        try {
            const { data_inicio, data_fim } = req.query;

            // Se não passar datas, usa mês atual
            const inicio = data_inicio || new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                .toISOString().split('T')[0];
            const fim = data_fim || new Date().toISOString().split('T')[0];

            // Buscar vendas do período
            const vendas = await VendaService.listarVendas({
                periodo_inicio: inicio,
                periodo_fim: fim
            });

            // Calcular estatísticas
            const totalVendas = vendas.length;
            const valorTotal = vendas.reduce((sum, v) => sum + parseFloat(v.Valor_Total), 0);
            const ticketMedio = totalVendas > 0 ? valorTotal / totalVendas : 0;

            // Agrupar por forma de pagamento
            const porFormaPagamento = vendas.reduce((acc, venda) => {
                const tipo = venda.Tipo_Pagamento;
                if (!acc[tipo]) {
                    acc[tipo] = { quantidade: 0, valor: 0 };
                }
                acc[tipo].quantidade++;
                acc[tipo].valor += parseFloat(venda.Valor_Total);
                return acc;
            }, {});

            res.json({
                success: true,
                periodo: { inicio, fim },
                resumo: {
                    total_vendas: totalVendas,
                    valor_total: valorTotal.toFixed(2),
                    ticket_medio: ticketMedio.toFixed(2),
                    por_forma_pagamento: porFormaPagamento
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = VendaController;