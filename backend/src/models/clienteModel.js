// src/models/clienteModel.js
const db = require('../config/db');

class ClienteModel {

  // Listar todos os clientes
  static async listarTodos() {
    const [rows] = await db.query(`
      SELECT * FROM Cliente 
      ORDER BY Nome
    `);
    return rows;
  }

  // Buscar por ID
  static async buscarPorId(id) {
    const [rows] = await db.query(
      'SELECT * FROM Cliente WHERE ID_Cliente = ?',
      [id]
    );
    return rows[0];
  }

  // Filtrar por status
  static async filtrarPorStatus(status) {
    const [rows] = await db.query(
      'SELECT * FROM Cliente WHERE Status = ? ORDER BY Nome',
      [status]
    );
    return rows;
  }

  // Buscar por nome ou telefone
  static async buscar(termo) {
    const [rows] = await db.query(`
      SELECT * FROM Cliente 
      WHERE Nome LIKE ? OR Telefone LIKE ?
      ORDER BY Nome
    `, [`%${termo}%`, `%${termo}%`]);
    return rows;
  }

  // Criar novo cliente
  static async criar(dados) {
    const [result] = await db.query(`
      INSERT INTO Cliente 
      (Nome, Telefone, Status, Limite_Fiado, Rua, Numero, Bairro, Cidade, CEP)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      dados.nome,
      dados.telefone,
      dados.status,
      dados.limite_fiado,
      dados.rua,
      dados.numero,
      dados.bairro,
      dados.cidade,
      dados.cep
    ]);
    return result.insertId;
  }

  // Atualizar cliente
  static async atualizar(id, dados) {
    const [result] = await db.query(`
      UPDATE Cliente 
      SET Nome = ?,
          Telefone = ?,
          Status = ?,
          Limite_Fiado = ?,
          Rua = ?,
          Numero = ?,
          Bairro = ?,
          Cidade = ?,
          CEP = ?
      WHERE ID_Cliente = ?
    `, [
      dados.nome,
      dados.telefone,
      dados.status,
      dados.limite_fiado,
      dados.rua,
      dados.numero,
      dados.bairro,
      dados.cidade,
      dados.cep,
      id
    ]);
    return result.affectedRows;
  }

  // Deletar cliente
  static async deletar(id) {
    const [result] = await db.query(
      'DELETE FROM Cliente WHERE ID_Cliente = ?',
      [id]
    );
    return result.affectedRows;
  }

  // Verificar se existe
  static async existe(id) {
    const [rows] = await db.query(
      'SELECT EXISTS(SELECT 1 FROM Cliente WHERE ID_Cliente = ?) AS existe',
      [id]
    );
    return rows[0].existe === 1;
  }

  // Contar vendas vinculadas
  static async contarVendasVinculadas(id) {
    const [rows] = await db.query(
      'SELECT COUNT(*) as total FROM Venda WHERE ID_Cliente = ?',
      [id]
    );
    return rows[0].total;
  }

  // Buscar vendas do cliente
  static async buscarVendas(id) {
    const [rows] = await db.query(`
      SELECT 
        v.ID_Venda,
        v.Data_Hora,
        v.Tipo_Pagamento,
        v.Valor_Total,
        v.Data_Pagamento_Fiado,
        v.Status,
        f.Nome AS Funcionario,
        CASE 
          WHEN v.Tipo_Pagamento = 'fiado' AND v.Data_Pagamento_Fiado IS NULL 
          THEN 'Em Aberto'
          WHEN v.Tipo_Pagamento = 'fiado' AND v.Data_Pagamento_Fiado IS NOT NULL 
          THEN 'Quitado'
          ELSE 'Pago'
        END AS Status_Pagamento
      FROM Venda v
      INNER JOIN Funcionario f ON v.ID_Funcionario = f.ID_Funcionario
      WHERE v.ID_Cliente = ?
      ORDER BY v.Data_Hora DESC
    `, [id]);
    return rows;
  }

  // Calcular total em aberto (fiado não pago)
  static async calcularTotalEmAberto(id) {
    const [rows] = await db.query(`
      SELECT COALESCE(SUM(Valor_Total), 0) as total
      FROM Venda
      WHERE ID_Cliente = ?
        AND Tipo_Pagamento = 'fiado'
        AND Data_Pagamento_Fiado IS NULL
        AND Status = 'finalizada'
    `, [id]);
    return parseFloat(rows[0].total);
  }

  // Obter crédito disponível (usando VIEW)
  static async obterCreditoDisponivel(id) {
    const [rows] = await db.query(`
      SELECT 
        c.Limite_Fiado,
        COALESCE(SUM(CASE 
          WHEN v.Tipo_Pagamento = 'fiado' 
          AND v.Data_Pagamento_Fiado IS NULL 
          AND v.Status = 'finalizada'
          THEN v.Valor_Total 
          ELSE 0 
        END), 0) AS Total_Em_Aberto,
        (c.Limite_Fiado - COALESCE(SUM(CASE 
          WHEN v.Tipo_Pagamento = 'fiado' 
          AND v.Data_Pagamento_Fiado IS NULL 
          AND v.Status = 'finalizada'
          THEN v.Valor_Total 
          ELSE 0 
        END), 0)) AS Credito_Disponivel
      FROM Cliente c
      LEFT JOIN Venda v ON c.ID_Cliente = v.ID_Cliente
      WHERE c.ID_Cliente = ?
      GROUP BY c.ID_Cliente, c.Limite_Fiado
    `, [id]);
    return rows[0];
  }

  // Listar clientes com crédito excedido
  static async listarCreditoExcedido() {
    const [rows] = await db.query(`
      SELECT 
        c.*,
        COALESCE(SUM(CASE 
          WHEN v.Tipo_Pagamento = 'fiado' 
          AND v.Data_Pagamento_Fiado IS NULL 
          AND v.Status = 'finalizada'
          THEN v.Valor_Total 
          ELSE 0 
        END), 0) AS Total_Em_Aberto,
        (c.Limite_Fiado - COALESCE(SUM(CASE 
          WHEN v.Tipo_Pagamento = 'fiado' 
          AND v.Data_Pagamento_Fiado IS NULL 
          AND v.Status = 'finalizada'
          THEN v.Valor_Total 
          ELSE 0 
        END), 0)) AS Credito_Disponivel
      FROM Cliente c
      LEFT JOIN Venda v ON c.ID_Cliente = v.ID_Cliente
      GROUP BY c.ID_Cliente
      HAVING Credito_Disponivel < 0
      ORDER BY Credito_Disponivel ASC
    `);
    return rows;
  }

  // Listar clientes devedores (com fiado em aberto)
  static async listarDevedores() {
    const [rows] = await db.query(`
      SELECT 
        c.ID_Cliente,
        c.Nome,
        c.Telefone,
        c.Status,
        c.Limite_Fiado,
        SUM(v.Valor_Total) as Total_Em_Aberto,
        (c.Limite_Fiado - SUM(v.Valor_Total)) as Credito_Disponivel,
        COUNT(v.ID_Venda) as Quantidade_Vendas_Abertas,
        MIN(DATEDIFF(NOW(), v.Data_Hora)) as Dias_Mais_Antigo
      FROM Cliente c
      INNER JOIN Venda v ON c.ID_Cliente = v.ID_Cliente
      WHERE v.Tipo_Pagamento = 'fiado'
        AND v.Data_Pagamento_Fiado IS NULL
        AND v.Status = 'finalizada'
      GROUP BY c.ID_Cliente, c.Nome, c.Telefone, c.Status, c.Limite_Fiado
      ORDER BY Total_Em_Aberto DESC
    `);
    return rows;
  }
}

module.exports = ClienteModel;