// src/config/db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testar conexão ao iniciar
pool.getConnection()
  .then(connection => {
    console.log('✅ Conectado ao MySQL!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Erro ao conectar no MySQL:', err);
  });

module.exports = pool;