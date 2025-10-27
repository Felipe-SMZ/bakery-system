// src/models/vendaModel.js
const db = require('../config/db');

class VendaModel {

  // ============================================================
  // CRIAR VENDA COMPLETA (COM TRANSAÇÃO)
  // ============================================================
  
  /**
   * Cria uma venda completa com seus itens
   * 
   * ATENÇÃO: Esta função usa TRANSAÇÃO para garantir que:
   * - Ou TUDO é salvo (venda + itens + estoque atualizado)
   * - Ou NADA é salvo (se der erro em qualquer etapa)
   * 
   * @param {Object} dadosVenda - Dados da venda (cliente, funcionário, etc)
   * @param {Array} itens - Array de itens [{id_produto, quantidade, preco_unitario}]
   * @returns {Number} ID da venda criada
   */
  static async criarVendaCompleta(dadosVenda, itens) {
    // Obter uma conexão do pool para usar na transação
    const connection = await db.getConnection();
    
    try {
      // ===== INICIAR TRANSAÇÃO =====
      // Tudo a partir daqui é "temporário" até o COMMIT
      await connection.beginTransaction();

      // ===== PASSO 1: Criar o cabeçalho da venda =====
      const [resultVenda] = await connection.query(`
        INSERT INTO Venda 
        (Data_Hora, Tipo_Pagamento, Valor_Total, ID_Cliente, ID_Funcionario, Status)
        VALUES (NOW(), ?, ?, ?, ?, 'finalizada')
      `, [
        dadosVenda.tipo_pagamento,
        dadosVenda.valor_total,
        dadosVenda.id_cliente,
        dadosVenda.id_funcionario
      ]);

      const vendaId = resultVenda.insertId;

      // ===== PASSO 2: Adicionar cada item da venda =====
      for (const item of itens) {
        // Inserir item na tabela Item_Venda
        await connection.query(`
          INSERT INTO Item_Venda 
          (ID_Venda, ID_Produto, Quantidade, Preco_Unitario)
          VALUES (?, ?, ?, ?)
        `, [
          vendaId,
          item.id_produto,
          item.quantidade,
          item.preco_unitario
        ]);

        // ===== PASSO 3: Atualizar estoque do produto =====
        // IMPORTANTE: Usar UPDATE com WHERE para garantir atomicidade
        await connection.query(`
          UPDATE Produto 
          SET Estoque_Atual = Estoque_Atual - ?
          WHERE ID_Produto = ?
        `, [item.quantidade, item.id_produto]);
      }

      // ===== COMMIT: Salvar TUDO de verdade =====
      // Se chegou aqui sem erro, salva permanentemente
      await connection.commit();

      // Retornar o ID da venda criada
      return vendaId;

    } catch (error) {
      // ===== ROLLBACK: Cancelar TUDO =====
      // Se deu erro em qualquer lugar, desfaz TUDO
      await connection.rollback();
      
      // Re-lançar o erro para o Service tratar
      throw new Error('Erro ao criar venda: ' + error.message);
      
    } finally {
      // ===== LIBERAR CONEXÃO =====
      // SEMPRE liberar a conexão, com erro ou sem erro
      connection.release();
    }
  }

  // ============================================================
  // CONSULTAS DE VENDAS
  // ============================================================

  /**
   * Lista todas as vendas com informações completas
   */
  static async listarTodas() {
    const [rows] = await db.query(`
      SELECT 
        v.ID_Venda,
        v.Data_Hora,
        v.Tipo_Pagamento,
        v.Valor_Total,
        v.Status,
        v.Data_Pagamento_Fiado,
        c.Nome AS Cliente,
        f.Nome AS Funcionario,
        CASE 
          WHEN v.Tipo_Pagamento = 'fiado' AND v.Data_Pagamento_Fiado IS NULL 
          THEN 'Em Aberto'
          WHEN v.Tipo_Pagamento = 'fiado' AND v.Data_Pagamento_Fiado IS NOT NULL 
          THEN 'Quitado'
          ELSE 'Pago'
        END AS Status_Pagamento
      FROM Venda v
      INNER JOIN Cliente c ON v.ID_Cliente = c.ID_Cliente
      INNER JOIN Funcionario f ON v.ID_Funcionario = f.ID_Funcionario
      ORDER BY v.Data_Hora DESC
    `);
    return rows;
  }

  /**
   * Busca uma venda específica por ID
   */
  static async buscarPorId(id) {
    const [rows] = await db.query(`
      SELECT 
        v.*,
        c.Nome AS Cliente,
        c.Telefone AS Cliente_Telefone,
        f.Nome AS Funcionario,
        cg.Nome_Cargo AS Cargo_Funcionario,
        CASE 
          WHEN v.Tipo_Pagamento = 'fiado' AND v.Data_Pagamento_Fiado IS NULL 
          THEN 'Em Aberto'
          WHEN v.Tipo_Pagamento = 'fiado' AND v.Data_Pagamento_Fiado IS NOT NULL 
          THEN 'Quitado'
          ELSE 'Pago'
        END AS Status_Pagamento
      FROM Venda v
      INNER JOIN Cliente c ON v.ID_Cliente = c.ID_Cliente
      INNER JOIN Funcionario f ON v.ID_Funcionario = f.ID_Funcionario
      INNER JOIN Cargo cg ON f.ID_Cargo = cg.ID_Cargo
      WHERE v.ID_Venda = ?
    `, [id]);
    return rows[0];
  }

  /**
   * Busca os itens de uma venda específica
   */
  static async buscarItens(vendaId) {
    const [rows] = await db.query(`
      SELECT 
        iv.*,
        p.Nome AS Produto,
        p.Unidade_Medida,
        (iv.Quantidade * iv.Preco_Unitario) AS Subtotal
      FROM Item_Venda iv
      INNER JOIN Produto p ON iv.ID_Produto = p.ID_Produto
      WHERE iv.ID_Venda = ?
      ORDER BY iv.ID_Item
    `, [vendaId]);
    return rows;
  }

  /**
   * Filtra vendas por período
   */
  static async filtrarPorPeriodo(dataInicio, dataFim) {
    const [rows] = await db.query(`
      SELECT 
        v.ID_Venda,
        v.Data_Hora,
        v.Tipo_Pagamento,
        v.Valor_Total,
        v.Status,
        c.Nome AS Cliente,
        f.Nome AS Funcionario,
        CASE 
          WHEN v.Tipo_Pagamento = 'fiado' AND v.Data_Pagamento_Fiado IS NULL 
          THEN 'Em Aberto'
          WHEN v.Tipo_Pagamento = 'fiado' AND v.Data_Pagamento_Fiado IS NOT NULL 
          THEN 'Quitado'
          ELSE 'Pago'
        END AS Status_Pagamento
      FROM Venda v
      INNER JOIN Cliente c ON v.ID_Cliente = c.ID_Cliente
      INNER JOIN Funcionario f ON v.ID_Funcionario = f.ID_Funcionario
      WHERE DATE(v.Data_Hora) BETWEEN ? AND ?
      ORDER BY v.Data_Hora DESC
    `, [dataInicio, dataFim]);
    return rows;
  }

  /**
   * Filtra vendas por cliente
   */
  static async filtrarPorCliente(clienteId) {
    const [rows] = await db.query(`
      SELECT 
        v.ID_Venda,
        v.Data_Hora,
        v.Tipo_Pagamento,
        v.Valor_Total,
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
    `, [clienteId]);
    return rows;
  }

  /**
   * Filtra vendas por funcionário
   */
  static async filtrarPorFuncionario(funcionarioId) {
    const [rows] = await db.query(`
      SELECT 
        v.ID_Venda,
        v.Data_Hora,
        v.Tipo_Pagamento,
        v.Valor_Total,
        v.Status,
        c.Nome AS Cliente,
        CASE 
          WHEN v.Tipo_Pagamento = 'fiado' AND v.Data_Pagamento_Fiado IS NULL 
          THEN 'Em Aberto'
          WHEN v.Tipo_Pagamento = 'fiado' AND v.Data_Pagamento_Fiado IS NOT NULL 
          THEN 'Quitado'
          ELSE 'Pago'
        END AS Status_Pagamento
      FROM Venda v
      INNER JOIN Cliente c ON v.ID_Cliente = c.ID_Cliente
      WHERE v.ID_Funcionario = ?
      ORDER BY v.Data_Hora DESC
    `, [funcionarioId]);
    return rows;
  }

  /**
   * Filtra vendas por forma de pagamento
   */
  static async filtrarPorFormaPagamento(tipoPagamento) {
    const [rows] = await db.query(`
      SELECT 
        v.ID_Venda,
        v.Data_Hora,
        v.Tipo_Pagamento,
        v.Valor_Total,
        v.Status,
        c.Nome AS Cliente,
        f.Nome AS Funcionario,
        CASE 
          WHEN v.Tipo_Pagamento = 'fiado' AND v.Data_Pagamento_Fiado IS NULL 
          THEN 'Em Aberto'
          WHEN v.Tipo_Pagamento = 'fiado' AND v.Data_Pagamento_Fiado IS NOT NULL 
          THEN 'Quitado'
          ELSE 'Pago'
        END AS Status_Pagamento
      FROM Venda v
      INNER JOIN Cliente c ON v.ID_Cliente = c.ID_Cliente
      INNER JOIN Funcionario f ON v.ID_Funcionario = f.ID_Funcionario
      WHERE v.Tipo_Pagamento = ?
      ORDER BY v.Data_Hora DESC
    `, [tipoPagamento]);
    return rows;
  }

  /**
   * Verificar se venda existe
   */
  static async existe(id) {
    const [rows] = await db.query(
      'SELECT EXISTS(SELECT 1 FROM Venda WHERE ID_Venda = ?) AS existe',
      [id]
    );
    return rows[0].existe === 1;
  }

  // ============================================================
  // QUITAÇÃO DE FIADO (OPCIONAL)
  // ============================================================

  /**
   * Registra quitação de venda a fiado
   */
  static async quitarFiado(vendaId) {
    const [result] = await db.query(`
      UPDATE Venda 
      SET Data_Pagamento_Fiado = NOW()
      WHERE ID_Venda = ? 
        AND Tipo_Pagamento = 'fiado'
        AND Data_Pagamento_Fiado IS NULL
    `, [vendaId]);
    return result.affectedRows;
  }

  /**
   * Lista vendas a fiado em aberto
   */
  static async listarFiadoEmAberto() {
    const [rows] = await db.query(`
      SELECT 
        v.ID_Venda,
        v.Data_Hora,
        v.Valor_Total,
        DATEDIFF(NOW(), v.Data_Hora) AS Dias_Em_Aberto,
        c.ID_Cliente,
        c.Nome AS Cliente,
        c.Telefone AS Cliente_Telefone
      FROM Venda v
      INNER JOIN Cliente c ON v.ID_Cliente = c.ID_Cliente
      WHERE v.Tipo_Pagamento = 'fiado'
        AND v.Data_Pagamento_Fiado IS NULL
        AND v.Status = 'finalizada'
      ORDER BY v.Data_Hora ASC
    `);
    return rows;
  }
}

module.exports = VendaModel;