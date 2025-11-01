// backend/src/routes/cargoRoutes.js
const express = require('express');
const router = express.Router();
const CargoController = require('../controllers/cargoController');

// Listar todos os cargos
// GET /api/cargos
router.get('/', CargoController.listarTodos);

// Buscar por ID
// GET /api/cargos/:id
router.get('/:id', CargoController.buscarPorId);

// Criar novo cargo
// POST /api/cargos
router.post('/', CargoController.criar);

// Atualizar cargo
// PUT /api/cargos/:id
router.put('/:id', CargoController.atualizar);

// Deletar cargo
// DELETE /api/cargos/:id
router.delete('/:id', CargoController.deletar);

module.exports = router;