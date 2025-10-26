// src/controllers/funcionarioController.js
const FuncionarioService = require('../services/funcionarioService');

class FuncionarioController {

    // GET /api/funcionarios
    static async listarTodos(req, res) {
        try {
            const funcionarios = await FuncionarioService.listarFuncionarios(req.query);

            res.json({
                success: true,
                total: funcionarios.length,
                data: funcionarios
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // GET /api/funcionarios/:id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const funcionario = await FuncionarioService.buscarPorId(id);

            res.json({
                success: true,
                data: funcionario
            });
        } catch (error) {
            const statusCode = error.message.includes('não encontrado') ? 404 : 500;

            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    // POST /api/funcionarios
    static async criar(req, res) {
        try {
            const funcionario = await FuncionarioService.criar(req.body);

            res.status(201).json({
                success: true,
                message: 'Funcionário criado com sucesso',
                data: funcionario
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

    // PUT /api/funcionarios/:id
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const funcionario = await FuncionarioService.atualizar(id, req.body);

            res.json({
                success: true,
                message: 'Funcionário atualizado com sucesso',
                data: funcionario
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

    // DELETE /api/funcionarios/:id
    static async deletar(req, res) {
        try {
            const { id } = req.params;
            await FuncionarioService.deletar(id);

            res.json({
                success: true,
                message: 'Funcionário deletado com sucesso'
            });
        } catch (error) {
            const statusCode = error.message.includes('não encontrado') ? 404 : 400;

            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    // GET /api/funcionarios/:id/vendas
    static async buscarVendas(req, res) {
        try {
            const { id } = req.params;
            const vendas = await FuncionarioService.buscarHistoricoVendas(id, req.query);

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

    // GET /api/funcionarios/:id/estatisticas
    static async obterEstatisticas(req, res) {
        try {
            const { id } = req.params;
            const estatisticas = await FuncionarioService.obterEstatisticas(id);

            res.json({
                success: true,
                data: estatisticas
            });
        } catch (error) {
            const statusCode = error.message.includes('não encontrado') ? 404 : 500;

            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    // GET /api/funcionarios/ranking
    static async obterRanking(req, res) {
        try {
            const ranking = await FuncionarioService.obterRanking(req.query);

            res.json({
                success: true,
                total: ranking.length,
                data: ranking
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // GET /api/funcionarios/cargos
    static async listarCargos(req, res) {
        try {
            const cargos = await FuncionarioService.listarCargos();

            res.json({
                success: true,
                total: cargos.length,
                data: cargos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = FuncionarioController;