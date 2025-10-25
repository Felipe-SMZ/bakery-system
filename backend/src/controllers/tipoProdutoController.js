// src/controllers/tipoProdutoController.js
const TipoProdutoModel = require('../models/tipoProdutoModel');

class TipoProdutoController {

    // GET /api/tipos-produto
    static async listarTodos(req, res) {
        try {
            const tipos = await TipoProdutoModel.listarTodos();
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
            const tipo = await TipoProdutoModel.buscarPorId(id);

            if (!tipo) {
                return res.status(404).json({
                    success: false,
                    error: 'Tipo de produto não encontrado'
                });
            }

            res.json({
                success: true,
                data: tipo
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // POST /api/tipos-produto
    static async criar(req, res) {
        try {
            const { nome_tipo } = req.body;

            // Validação
            if (!nome_tipo || nome_tipo.trim() === '') {
                return res.status(400).json({
                    success: false,
                    error: 'Nome do tipo é obrigatório'
                });
            }

            const id = await TipoProdutoModel.criar({ nome_tipo: nome_tipo.trim() });

            res.status(201).json({
                success: true,
                message: 'Tipo de produto criado com sucesso',
                data: { id, nome_tipo }
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
            const { nome_tipo } = req.body;

            // Validação
            if (!nome_tipo || nome_tipo.trim() === '') {
                return res.status(400).json({
                    success: false,
                    error: 'Nome do tipo é obrigatório'
                });
            }

            // Verificar se existe
            const existe = await TipoProdutoModel.existe(id);
            if (!existe) {
                return res.status(404).json({
                    success: false,
                    error: 'Tipo de produto não encontrado'
                });
            }

            const affectedRows = await TipoProdutoModel.atualizar(id, { nome_tipo: nome_tipo.trim() });

            res.json({
                success: true,
                message: 'Tipo de produto atualizado com sucesso',
                data: { id, nome_tipo }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // DELETE /api/tipos-produto/:id
    static async deletar(req, res) {
        try {
            const { id } = req.params;

            // Verificar se existe
            const existe = await TipoProdutoModel.existe(id);
            if (!existe) {
                return res.status(404).json({
                    success: false,
                    error: 'Tipo de produto não encontrado'
                });
            }

            await TipoProdutoModel.deletar(id);

            res.json({
                success: true,
                message: 'Tipo de produto deletado com sucesso'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = TipoProdutoController;