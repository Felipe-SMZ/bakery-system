// src/controllers/produtoController.js
const ProdutoService = require('../services/produtoService');

class ProdutoController {

    // GET /api/produtos
    static async listarTodos(req, res) {
        try {
            const produtos = await ProdutoService.listarProdutos(req.query);

            res.json({
                success: true,
                total: produtos.length,
                data: produtos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // GET /api/produtos/:id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const produto = await ProdutoService.buscarPorId(id);

            res.json({
                success: true,
                data: produto
            });
        } catch (error) {
            const statusCode = error.message.includes('não encontrado') ? 404 : 500;

            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    // POST /api/produtos
    static async criar(req, res) {
        try {
            const resultado = await ProdutoService.criar(req.body);

            res.status(201).json({
                success: true,
                message: 'Produto criado com sucesso',
                data: resultado
            });
        } catch (error) {
            // Se tem array de erros de validação
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

    // PUT /api/produtos/:id
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            await ProdutoService.atualizar(id, req.body);

            res.json({
                success: true,
                message: 'Produto atualizado com sucesso'
            });
        } catch (error) {
            // Se tem array de erros de validação
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

    // PATCH /api/produtos/:id/estoque
    static async atualizarEstoque(req, res) {
        try {
            const { id } = req.params;
            const { quantidade } = req.body;

            const resultado = await ProdutoService.atualizarEstoque(id, quantidade);

            res.json({
                success: true,
                message: 'Estoque atualizado com sucesso',
                data: resultado
            });
        } catch (error) {
            const statusCode = error.message.includes('não encontrado') ? 404 : 400;

            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    // DELETE /api/produtos/:id
    static async deletar(req, res) {
        try {
            const { id } = req.params;
            await ProdutoService.deletar(id);

            res.json({
                success: true,
                message: 'Produto deletado com sucesso'
            });
        } catch (error) {
            const statusCode = error.message.includes('não encontrado') ? 404 : 400;

            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = ProdutoController;