// src/models/cargoModel.js
const db = require('../config/db');

class CargoModel {

    // Listar todos os cargos
    static async listarTodos() {
        const [rows] = await db.query(`
      SELECT * FROM Cargo 
      ORDER BY Nome_Cargo
    `);
        return rows;
    }

    // Buscar por ID
    static async buscarPorId(id) {
        const [rows] = await db.query(
            'SELECT * FROM Cargo WHERE ID_Cargo = ?',
            [id]
        );
        return rows[0];
    }

    // Verificar se existe
    static async existe(id) {
        const [rows] = await db.query(
            'SELECT EXISTS(SELECT 1 FROM Cargo WHERE ID_Cargo = ?) AS existe',
            [id]
        );
        return rows[0].existe === 1;
    }

    // Buscar por nome
    static async buscarPorNome(nome) {
        const [rows] = await db.query(
            'SELECT * FROM Cargo WHERE Nome_Cargo = ?',
            [nome]
        );
        return rows[0];
    }

    // Contar funcionários vinculados
    static async contarFuncionariosVinculados(id) {
        const [rows] = await db.query(
            'SELECT COUNT(*) as total FROM Funcionario WHERE ID_Cargo = ?',
            [id]
        );
        return rows[0].total;
    }

    // Adicione estes métodos no seu cargoModel.js

    // Criar novo cargo
    static async criar(dados) {
        const [result] = await db.query(
            'INSERT INTO Cargo (Nome_Cargo) VALUES (?)',
            [dados.nome_cargo]
        );
        return result.insertId;
    }

    // Atualizar cargo
    static async atualizar(id, dados) {
        const [result] = await db.query(
            'UPDATE Cargo SET Nome_Cargo = ? WHERE ID_Cargo = ?',
            [dados.nome_cargo, id]
        );
        return result.affectedRows;
    }

    // Deletar cargo
    static async deletar(id) {
        const [result] = await db.query(
            'DELETE FROM Cargo WHERE ID_Cargo = ?',
            [id]
        );
        return result.affectedRows;
    }
}

module.exports = CargoModel;