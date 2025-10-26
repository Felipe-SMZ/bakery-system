// src/controllers/clienteController.js
const ClienteService = require('../services/clienteService');

class ClienteController {

    // GET /api/clientes
    static async listarTodos(req, res) {
        try {
            const clientes = await ClienteService.listarClientes(req.query);

            res.json({
                success: true,
                total: clientes.length,
                data: clientes
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // GET /api/clientes/:id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const cliente = await ClienteService.buscarDetalhes(id);

            res.json({
                success: true,
                data: cliente
            });
        } catch (error) {
            const statusCode = error.message.includes('não encontrado') ? 404 : 500;

            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    // POST /api/clientes
    static async criar(req, res) {
        try {
            const resultado = await ClienteService.criar(req.body);

            res.status(201).json({
                success: true,
                message: 'Cliente criado com sucesso',
                data: resultado
            });
        } catch (error) {
            if (error.errors && Array.isArray(error.errors)) {
                return res.status(400).json({
                    success: false,
                    errors: error.errors
                });
            }

            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // PUT /api/clientes/:id
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            await ClienteService.atualizar(id, req.body);

            res.json({
                success: true,
                message: 'Cliente atualizado com sucesso'
            });
        } catch (error) {
            if (error.errors && Array.isArray(error.errors)) {
                return res.status(400).json({
                    success: false,
                    errors: error.errors
                });
            }

            const statusCode = error.message.includes('não encontrado') ? 404 : 400;

            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    // DELETE /api/clientes/:id
    static async deletar(req, res) {
        try {
            const { id } = req.params;
            await ClienteService.deletar(id);

            res.json({
                success: true,
                message: 'Cliente deletado com sucesso'
            });
        } catch (error) {
            const statusCode = error.message.includes('não encontrado') ? 404 : 400;

            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    // GET /api/clientes/:id/historico
    static async buscarHistorico(req, res) {
        try {
            const { id } = req.params;
            const vendas = await ClienteService.buscarHistorico(id, req.query);

            res.json({
                success: true,
                total: vendas.length,
                data: vendas
            });
        } catch (error) {
            const statusCode = error.message.includes('não encontrado') ? 404 : 500;

            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    // GET /api/clientes/:id/credito
    static async obterSituacaoCredito(req, res) {
        try {
            const { id } = req.params;
            const situacao = await ClienteService.obterSituacaoCredito(id);

            res.json({
                success: true,
                data: situacao
            });
        } catch (error) {
            const statusCode = error.message.includes('não encontrado') ? 404 : 500;

            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    // POST /api/clientes/:id/validar-fiado
    static async validarVendaFiado(req, res) {
        try {
            const { id } = req.params;
            const { valor_venda } = req.body;

            if (!valor_venda || valor_venda <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Valor da venda é obrigatório e deve ser maior que zero'
                });
            }

            const validacao = await ClienteService.validarVendaFiado(id, valor_venda);

            res.json({
                success: true,
                data: validacao
            });
        } catch (error) {
            const statusCode = error.message.includes('não encontrado') ? 404 : 500;

            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    // GET /api/clientes/devedores
    static async listarDevedores(req, res) {
        try {
            const devedores = await ClienteService.listarDevedores();

            res.json({
                success: true,
                total: devedores.length,
                data: devedores
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // GET /api/clientes/credito-excedido
    static async listarCreditoExcedido(req, res) {
        try {
            const clientes = await ClienteService.listarCreditoExcedido();

            res.json({
                success: true,
                total: clientes.length,
                data: clientes
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = ClienteController;