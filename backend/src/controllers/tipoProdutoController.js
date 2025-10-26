// src/controllers/tipoProdutoController.js
const TipoProdutoService = require('../services/tipoProdutoService');

class TipoProdutoController {

    // GET /api/tipos-produto
    static async listarTodos(req, res) {
        try {
            const tipos = await TipoProdutoService.listarTodos();

            res.json({
                success: true,
                total: tipos.length,
                data: tipos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // GET /api/tipos-produto/:id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const tipo = await TipoProdutoService.buscarPorId(id);

            res.json({
                success: true,
                data: tipo
            });
        } catch (error) {
            const statusCode = error.message.includes('não encontrado') ? 404 : 500;

            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    // POST /api/tipos-produto
    static async criar(req, res) {
        try {
            const resultado = await TipoProdutoService.criar(req.body);

            res.status(201).json({
                success: true,
                message: 'Tipo de produto criado com sucesso',
                data: resultado
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // PUT /api/tipos-produto/:id
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await TipoProdutoService.atualizar(id, req.body);

            res.json({
                success: true,
                message: 'Tipo de produto atualizado com sucesso',
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

    // DELETE /api/tipos-produto/:id
    static async deletar(req, res) {
        try {
            const { id } = req.params;
            await TipoProdutoService.deletar(id);

            res.json({
                success: true,
                message: 'Tipo de produto deletado com sucesso'
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

module.exports = TipoProdutoController;