// src/models/funcionarioModel.js
const db = require('../config/db');

class FuncionarioModel {

    // Listar todos os funcionários com cargo
    static async listarTodos() {
        const [rows] = await db.query(`
      SELECT 
        f.ID_Funcionario,
        f.Nome,
        f.ID_Cargo,
        c.Nome_Cargo AS Cargo,
        f.created_at,
        f.updated_at
      FROM Funcionario f
      INNER JOIN Cargo c ON f.ID_Cargo = c.ID_Cargo
      ORDER BY f.Nome
    `);
        return rows;
    }

    // Buscar por ID
    static async buscarPorId(id) {
        const [rows] = await db.query(`
      SELECT 
        f.*,
        c.Nome_Cargo AS Cargo
      FROM Funcionario f
      INNER JOIN Cargo c ON f.ID_Cargo = c.ID_Cargo
      WHERE f.ID_Funcionario = ?
    `, [id]);
        return rows[0];
    }

    // Filtrar por cargo
    static async filtrarPorCargo(cargoId) {
        const [rows] = await db.query(`
      SELECT 
        f.*,
        c.Nome_Cargo AS Cargo
      FROM Funcionario f
      INNER JOIN Cargo c ON f.ID_Cargo = c.ID_Cargo
      WHERE f.ID_Cargo = ?
      ORDER BY f.Nome
    `, [cargoId]);
        return rows;
    }

    // Buscar por nome
    static async buscarPorNome(nome) {
        const [rows] = await db.query(`
      SELECT 
        f.*,
        c.Nome_Cargo AS Cargo
      FROM Funcionario f
      INNER JOIN Cargo c ON f.ID_Cargo = c.ID_Cargo
      WHERE f.Nome LIKE ?
      ORDER BY f.Nome
    `, [`%${nome}%`]);
        return rows;
    }

    // Criar novo funcionário
    static async criar(dados) {
        const [result] = await db.query(
            'INSERT INTO Funcionario (Nome, ID_Cargo) VALUES (?, ?)',
            [dados.nome, dados.id_cargo]
        );
        return result.insertId;
    }

    // Atualizar funcionário
    static async atualizar(id, dados) {
        const [result] = await db.query(
            'UPDATE Funcionario SET Nome = ?, ID_Cargo = ? WHERE ID_Funcionario = ?',
            [dados.nome, dados.id_cargo, id]
        );
        return result.affectedRows;
    }

    // Deletar funcionário
    static async deletar(id) {
        const [result] = await db.query(
            'DELETE FROM Funcionario WHERE ID_Funcionario = ?',
            [id]
        );
        return result.affectedRows;
    }

    // Verificar se existe
    static async existe(id) {
        const [rows] = await db.query(
            'SELECT EXISTS(SELECT 1 FROM Funcionario WHERE ID_Funcionario = ?) AS existe',
            [id]
        );
        return rows[0].existe === 1;
    }

    // Contar vendas vinculadas
    static async contarVendasVinculadas(id) {
        const [rows] = await db.query(
            'SELECT COUNT(*) as total FROM Venda WHERE ID_Funcionario = ?',
            [id]
        );
        return rows[0].total;
    }

    // Buscar vendas do funcionário
    static async buscarVendas(id) {
        const [rows] = await db.query(`
      SELECT 
        v.ID_Venda,
        v.Data_Hora,
        v.Tipo_Pagamento,
        v.Valor_Total,
        v.Status,
        c.Nome AS Cliente
      FROM Venda v
      INNER JOIN Cliente c ON v.ID_Cliente = c.ID_Cliente
      WHERE v.ID_Funcionario = ?
      ORDER BY v.Data_Hora DESC
    `, [id]);
        return rows;
    }

    // Estatísticas de vendas do funcionário
    static async obterEstatisticas(id) {
        const [rows] = await db.query(`
      SELECT 
        COUNT(*) as Total_Vendas,
        COALESCE(SUM(Valor_Total), 0) as Valor_Total_Vendido,
        COALESCE(AVG(Valor_Total), 0) as Ticket_Medio
      FROM Venda
      WHERE ID_Funcionario = ?
        AND Status = 'finalizada'
    `, [id]);
        return rows[0];
    }

    // Ranking de funcionários por vendas
    static async obterRanking(dataInicio = null, dataFim = null) {
        let query = `
      SELECT 
        f.ID_Funcionario,
        f.Nome,
        c.Nome_Cargo AS Cargo,
        COUNT(v.ID_Venda) as Total_Vendas,
        COALESCE(SUM(v.Valor_Total), 0) as Valor_Total_Vendido,
        COALESCE(AVG(v.Valor_Total), 0) as Ticket_Medio
      FROM Funcionario f
      INNER JOIN Cargo c ON f.ID_Cargo = c.ID_Cargo
      LEFT JOIN Venda v ON f.ID_Funcionario = v.ID_Funcionario 
        AND v.Status = 'finalizada'
    `;

        const params = [];

        if (dataInicio && dataFim) {
            query += ' AND DATE(v.Data_Hora) BETWEEN ? AND ?';
            params.push(dataInicio, dataFim);
        }

        query += `
      GROUP BY f.ID_Funcionario, f.Nome, c.Nome_Cargo
      ORDER BY Valor_Total_Vendido DESC
    `;

        const [rows] = await db.query(query, params);
        return rows;
    }
}

module.exports = FuncionarioModel;