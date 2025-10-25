// src/models/tipoProdutoModel.js
const db = require('../config/db');

class TipoProdutoModel {

    // Listar todos os tipos
    static async listarTodos() {
        try {
            const [rows] = await db.query(`
        SELECT * FROM Tipo_Produto 
        ORDER BY Nome_Tipo
      `);
            return rows;
        } catch (error) {
            throw new Error('Erro ao listar tipos de produto: ' + error.message);
        }
    }

    // Buscar por ID
    static async buscarPorId(id) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM Tipo_Produto WHERE ID_Tipo_Produto = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw new Error('Erro ao buscar tipo de produto: ' + error.message);
        }
    }

    // Criar novo tipo
    static async criar(dados) {
        try {
            const [result] = await db.query(
                'INSERT INTO Tipo_Produto (Nome_Tipo) VALUES (?)',
                [dados.nome_tipo]
            );
            return result.insertId;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Tipo de produto já existe');
            }
            throw new Error('Erro ao criar tipo de produto: ' + error.message);
        }
    }

    // Atualizar tipo
    static async atualizar(id, dados) {
        try {
            const [result] = await db.query(
                'UPDATE Tipo_Produto SET Nome_Tipo = ? WHERE ID_Tipo_Produto = ?',
                [dados.nome_tipo, id]
            );
            return result.affectedRows;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Tipo de produto já existe');
            }
            throw new Error('Erro ao atualizar tipo de produto: ' + error.message);
        }
    }

    // Deletar tipo
    static async deletar(id) {
        try {
            // Verificar se tem produtos vinculados
            const [produtos] = await db.query(
                'SELECT COUNT(*) as total FROM Produto WHERE ID_Tipo_Produto = ?',
                [id]
            );

            if (produtos[0].total > 0) {
                throw new Error('Não é possível deletar. Existem produtos vinculados a este tipo.');
            }

            const [result] = await db.query(
                'DELETE FROM Tipo_Produto WHERE ID_Tipo_Produto = ?',
                [id]
            );
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Verificar se existe
    static async existe(id) {
        try {
            const [rows] = await db.query(
                'SELECT EXISTS(SELECT 1 FROM Tipo_Produto WHERE ID_Tipo_Produto = ?) AS existe',
                [id]
            );
            return rows[0].existe === 1;
        } catch (error) {
            throw new Error('Erro ao verificar tipo de produto: ' + error.message);
        }
    }
}

module.exports = TipoProdutoModel;