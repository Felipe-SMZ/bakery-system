// src/routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/clienteController');

// Rotas especiais (devem vir antes das rotas com :id)
router.get('/devedores', ClienteController.listarDevedores);
router.get('/credito-excedido', ClienteController.listarCreditoExcedido);

// Listar todos (com filtros opcionais)
// GET /api/clientes
// GET /api/clientes?status=bom
// GET /api/clientes?busca=maria
router.get('/', ClienteController.listarTodos);

// Buscar por ID (com crédito disponível)
router.get('/:id', ClienteController.buscarPorId);

// Criar novo
router.post('/', ClienteController.criar);

// Atualizar
router.put('/:id', ClienteController.atualizar);

// Deletar
router.delete('/:id', ClienteController.deletar);

// Histórico de compras
router.get('/:id/historico', ClienteController.buscarHistorico);

// Situação de crédito
router.get('/:id/credito', ClienteController.obterSituacaoCredito);

// Validar se pode fazer venda a fiado
router.post('/:id/validar-fiado', ClienteController.validarVendaFiado);

module.exports = router;