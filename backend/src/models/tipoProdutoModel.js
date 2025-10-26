// src/models/tipoProdutoModel.js
const db = require('../config/db');

class TipoProdutoModel {

    // Listar todos os tipos
    static async listarTodos() {
        const [rows] = await db.query(`
      SELECT * FROM Tipo_Produto 
      ORDER BY Nome_Tipo
    `);
        return rows;
    }

    // Buscar por ID
    static async buscarPorId(id) {
        const [rows] = await db.query(
            'SELECT * FROM Tipo_Produto WHERE ID_Tipo_Produto = ?',
            [id]
        );
        return rows[0];
    }

    // Criar novo tipo
    static async criar(dados) {
        const [result] = await db.query(
            'INSERT INTO Tipo_Produto (Nome_Tipo) VALUES (?)',
            [dados.nome_tipo]
        );
        return result.insertId;
    }

    // Atualizar tipo
    static async atualizar(id, dados) {
        const [result] = await db.query(
            'UPDATE Tipo_Produto SET Nome_Tipo = ? WHERE ID_Tipo_Produto = ?',
            [dados.nome_tipo, id]
        );
        return result.affectedRows;
    }

    // Deletar tipo
    static async deletar(id) {
        const [result] = await db.query(
            'DELETE FROM Tipo_Produto WHERE ID_Tipo_Produto = ?',
            [id]
        );
        return result.affectedRows;
    }

    // Verificar se existe
    static async existe(id) {
        const [rows] = await db.query(
            'SELECT EXISTS(SELECT 1 FROM Tipo_Produto WHERE ID_Tipo_Produto = ?) AS existe',
            [id]
        );
        return rows[0].existe === 1;
    }

    // Contar produtos vinculados
    static async contarProdutosVinculados(id) {
        const [rows] = await db.query(
            'SELECT COUNT(*) as total FROM Produto WHERE ID_Tipo_Produto = ?',
            [id]
        );
        return rows[0].total;
    }
}

module.exports = TipoProdutoModel;