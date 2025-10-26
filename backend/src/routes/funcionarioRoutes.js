// src/routes/funcionarioRoutes.js
const express = require('express');
const router = express.Router();
const FuncionarioController = require('../controllers/funcionarioController');

// Listar cargos disponíveis
router.get('/cargos', FuncionarioController.listarCargos);

// Ranking de funcionários
router.get('/ranking', FuncionarioController.obterRanking);

// Listar todos (com filtros opcionais)
// GET /api/funcionarios
// GET /api/funcionarios?cargo=2
// GET /api/funcionarios?nome=maria
router.get('/', FuncionarioController.listarTodos);

// Buscar por ID
router.get('/:id', FuncionarioController.buscarPorId);

// Vendas do funcionário
router.get('/:id/vendas', FuncionarioController.buscarVendas);

// Estatísticas do funcionário
router.get('/:id/estatisticas', FuncionarioController.obterEstatisticas);

// Criar novo
router.post('/', FuncionarioController.criar);

// Atualizar
router.put('/:id', FuncionarioController.atualizar);

// Deletar
router.delete('/:id', FuncionarioController.deletar);

module.exports = router;