// src/routes/vendaRoutes.js
const express = require('express');
const router = express.Router();
const VendaController = require('../controllers/vendaController');

// ============================================================
// ⚠️ IMPORTANTE: ROTAS ESPECÍFICAS DEVEM VIR ANTES DE :id
// ============================================================

// Resumo/Relatórios (devem vir ANTES de /:id)
router.get('/relatorio/resumo', VendaController.obterResumo);

// Vendas a fiado em aberto (deve vir ANTES de /:id)
router.get('/fiado/em-aberto', VendaController.listarFiadoEmAberto);

// ============================================================
// ROTAS PRINCIPAIS
// ============================================================

// Listar todas as vendas (com filtros opcionais)
// GET /api/vendas
// GET /api/vendas?periodo_inicio=2025-10-01&periodo_fim=2025-10-31
// GET /api/vendas?cliente=3
// GET /api/vendas?funcionario=2
// GET /api/vendas?tipo_pagamento=fiado
router.get('/', VendaController.listarTodas);

// Criar nova venda
// POST /api/vendas
// Body: { id_cliente, id_funcionario, tipo_pagamento, itens: [...] }
router.post('/', VendaController.criar);

// Buscar venda específica por ID (com itens)
// GET /api/vendas/1
router.get('/:id', VendaController.buscarPorId);

// Quitar venda a fiado
// PATCH /api/vendas/1/quitar
router.patch('/:id/quitar', VendaController.quitarFiado);

// ============================================================
// DOCUMENTAÇÃO DOS ENDPOINTS
// ============================================================

/*

ENDPOINTS DISPONÍVEIS:

1. POST /api/vendas
   Descrição: Cria uma nova venda
   Body exemplo:
   {
     "id_cliente": 3,
     "id_funcionario": 2,
     "tipo_pagamento": "fiado",
     "itens": [
       { "id_produto": 1, "quantidade": 10 },
       { "id_produto": 8, "quantidade": 2 }
     ]
   }
   
2. GET /api/vendas
   Descrição: Lista todas as vendas
   Query params opcionais:
   - periodo_inicio (YYYY-MM-DD)
   - periodo_fim (YYYY-MM-DD)
   - cliente (ID)
   - funcionario (ID)
   - tipo_pagamento (dinheiro|cartao|pix|fiado)

3. GET /api/vendas/:id
   Descrição: Busca uma venda específica com seus itens
   
4. GET /api/vendas/fiado/em-aberto
   Descrição: Lista vendas a fiado ainda não quitadas
   
5. PATCH /api/vendas/:id/quitar
   Descrição: Registra quitação de venda a fiado
   
6. GET /api/vendas/relatorio/resumo
   Descrição: Resumo geral de vendas
   Query params opcionais:
   - data_inicio (YYYY-MM-DD)
   - data_fim (YYYY-MM-DD)

VALIDAÇÕES AUTOMÁTICAS:
- Cliente deve existir
- Funcionário deve existir
- Produtos devem existir
- Deve ter estoque suficiente
- Se fiado: deve ter crédito disponível
- Tipo de pagamento deve ser válido

TRANSAÇÕES:
- Venda é criada usando transação
- Se qualquer erro: ROLLBACK automático
- Estoque é atualizado automaticamente

*/

module.exports = router;