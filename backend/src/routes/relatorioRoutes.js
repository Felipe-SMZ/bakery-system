// src/routes/relatorioRoutes.js
const express = require('express');
const router = express.Router();
const RelatorioController = require('../controllers/relatorioController');

// ============================================================
// ROTAS DE RELATÓRIOS
// ============================================================

// Dashboard geral
router.get('/dashboard', RelatorioController.dashboardGeral);

// Vendas por período
router.get('/vendas-periodo', RelatorioController.vendasPorPeriodo);

// Produtos mais vendidos
router.get('/produtos-mais-vendidos', RelatorioController.produtosMaisVendidos);

// Vendas por forma de pagamento
router.get('/vendas-por-forma-pagamento', RelatorioController.vendasPorFormaPagamento);

// Desempenho de funcionários
router.get('/desempenho-funcionarios', RelatorioController.desempenhoFuncionarios);

// Clientes devedores
router.get('/clientes-devedores', RelatorioController.clientesDevedores);

// Produtos com estoque baixo
router.get('/produtos-estoque-baixo', RelatorioController.produtosEstoqueBaixo);

module.exports = router;