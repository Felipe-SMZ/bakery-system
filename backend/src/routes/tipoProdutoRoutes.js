// src/routes/tipoProdutoRoutes.js
const express = require('express');
const router = express.Router();
const TipoProdutoController = require('../controllers/tipoProdutoController');

// Listar todos
router.get('/', TipoProdutoController.listarTodos);

// Buscar por ID
router.get('/:id', TipoProdutoController.buscarPorId);

// Criar novo
router.post('/', TipoProdutoController.criar);

// Atualizar
router.put('/:id', TipoProdutoController.atualizar);

// Deletar
router.delete('/:id', TipoProdutoController.deletar);

module.exports = router;