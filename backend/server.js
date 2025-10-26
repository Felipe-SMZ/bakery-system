// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: '🥖 API Padaria funcionando!',
    version: '1.0.0',
    endpoints: {
      testDb: '/test-db',
      produtos: '/api/produtos (em breve)',
      clientes: '/api/clientes (em breve)',
      vendas: '/api/vendas (em breve)'
    }
  });
});

// Rota de teste do banco de dados
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    const [tables] = await db.query('SHOW TABLES');

    res.json({
      success: true,
      message: '✅ Conexão com MySQL OK!',
      test: rows[0].result,
      database: process.env.DB_NAME,
      tabelas: tables.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao conectar no banco',
      details: error.message
    });
  }
});

// Importar rotas
const tipoProdutoRoutes = require('./src/routes/tipoProdutoRoutes');
const produtoRoutes = require('./src/routes/produtoRoutes');
const clienteRoutes = require('./src/routes/clienteRoutes');

// Rotas da API
app.use('/api/tipos-produto', tipoProdutoRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/clientes', clienteRoutes);

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🗄️  Banco de dados: ${process.env.DB_NAME}`);
  console.log(`\n✅ Pressione Ctrl+C para parar\n`);
});