// backend/src/controllers/cargoController.js
const CargoService = require('../services/cargoService');

class CargoController {

    // GET /api/cargos
    static async listarTodos(req, res) {
        try {
            const cargos = await CargoService.listarCargos();

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

    // GET /api/cargos/:id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const cargo = await CargoService.buscarPorId(id);

            res.json({
                success: true,
                data: cargo
            });
        } catch (error) {
            const statusCode = error.message.includes('não encontrado') ? 404 : 500;

            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    // POST /api/cargos
    static async criar(req, res) {
        try {
            const resultado = await CargoService.criar(req.body);

            res.status(201).json({
                success: true,
                message: 'Cargo criado com sucesso',
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

    // PUT /api/cargos/:id
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            await CargoService.atualizar(id, req.body);

            res.json({
                success: true,
                message: 'Cargo atualizado com sucesso'
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

    // DELETE /api/cargos/:id
    static async deletar(req, res) {
        try {
            const { id } = req.params;
            await CargoService.deletar(id);

            res.json({
                success: true,
                message: 'Cargo deletado com sucesso'
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

module.exports = CargoController;