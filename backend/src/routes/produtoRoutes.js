// src/routes/produtoRoutes.js
const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/produtoController');

// Listar todos (com filtros opcionais)
// GET /api/produtos
// GET /api/produtos?tipo=1
// GET /api/produtos?nome=pao
// GET /api/produtos?estoque_baixo=50
router.get('/', ProdutoController.listarTodos);

// Buscar por ID
router.get('/:id', ProdutoController.buscarPorId);

// Criar novo
router.post('/', ProdutoController.criar);

// Atualizar completo
router.put('/:id', ProdutoController.atualizar);

// Atualizar apenas estoque
router.patch('/:id/estoque', ProdutoController.atualizarEstoque);

// Deletar
router.delete('/:id', ProdutoController.deletar);

module.exports = router;