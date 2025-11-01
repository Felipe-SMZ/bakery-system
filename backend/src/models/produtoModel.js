// src/models/produtoModel.js
const db = require('../config/db');

class ProdutoModel {

  // Listar todos os produtos com tipo
  static async listarTodos() {
    const [rows] = await db.query(`
      SELECT 
        p.ID_Produto,
        p.Nome,
        p.Unidade_Medida,
        p.Preco_Base,
        p.Estoque_Atual,
        p.ID_Tipo_Produto,
        tp.Nome_Tipo AS Tipo
      FROM Produto p
      INNER JOIN Tipo_Produto tp ON p.ID_Tipo_Produto = tp.ID_Tipo_Produto
      ORDER BY p.Nome
    `);
    return rows;
  }

  // Buscar por ID
  static async buscarPorId(id) {
    const [rows] = await db.query(`
      SELECT 
        p.*,
        tp.Nome_Tipo AS Tipo
      FROM Produto p
      INNER JOIN Tipo_Produto tp ON p.ID_Tipo_Produto = tp.ID_Tipo_Produto
      WHERE p.ID_Produto = ?
    `, [id]);
    return rows[0];
  }

  // Filtrar por tipo
  static async filtrarPorTipo(tipoId) {
    const [rows] = await db.query(`
      SELECT 
        p.*,
        tp.Nome_Tipo AS Tipo
      FROM Produto p
      INNER JOIN Tipo_Produto tp ON p.ID_Tipo_Produto = tp.ID_Tipo_Produto
      WHERE p.ID_Tipo_Produto = ?
      ORDER BY p.Nome
    `, [tipoId]);
    return rows;
  }

  // Buscar por nome (parcial)
  static async buscarPorNome(nome) {
    const [rows] = await db.query(`
      SELECT 
        p.*,
        tp.Nome_Tipo AS Tipo
      FROM Produto p
      INNER JOIN Tipo_Produto tp ON p.ID_Tipo_Produto = tp.ID_Tipo_Produto
      WHERE p.Nome LIKE ?
      ORDER BY p.Nome
    `, [`%${nome}%`]);
    return rows;
  }

  // Produtos com estoque baixo
  static async estoqueBaixo(limite) {
    const [rows] = await db.query(`
      SELECT 
        p.*,
        tp.Nome_Tipo AS Tipo
      FROM Produto p
      INNER JOIN Tipo_Produto tp ON p.ID_Tipo_Produto = tp.ID_Tipo_Produto
      WHERE p.Estoque_Atual < ?
      ORDER BY p.Estoque_Atual ASC
    `, [limite]);
    return rows;
  }

  // ⭐ NOVA: Listar produtos com filtros combinados
  static async listarComFiltros(filtros = {}) {
    const { tipo, nome } = filtros;

    let sql = `
      SELECT 
        p.ID_Produto,
        p.Nome,
        p.Unidade_Medida,
        p.Preco_Base,
        p.Estoque_Atual,
        p.ID_Tipo_Produto,
        tp.Nome_Tipo AS Tipo
      FROM Produto p
      INNER JOIN Tipo_Produto tp ON p.ID_Tipo_Produto = tp.ID_Tipo_Produto
      WHERE 1=1
    `;

    const params = [];

    if (tipo) {
      sql += ' AND p.ID_Tipo_Produto = ?';
      params.push(tipo);
    }

    if (nome) {
      sql += ' AND p.Nome LIKE ?';
      params.push(`%${nome}%`);
    }

    sql += ' ORDER BY p.Nome';

    const [rows] = await db.query(sql, params);
    return rows;
  }

  // Criar novo produto
  static async criar(dados) {
    const [result] = await db.query(`
      INSERT INTO Produto 
      (Nome, Unidade_Medida, Preco_Base, Estoque_Atual, ID_Tipo_Produto)
      VALUES (?, ?, ?, ?, ?)
    `, [
      dados.nome,
      dados.unidade_medida,
      dados.preco_base,
      dados.estoque_atual,
      dados.id_tipo_produto
    ]);
    return result.insertId;
  }

  // Atualizar produto
  static async atualizar(id, dados) {
    const [result] = await db.query(`
      UPDATE Produto 
      SET Nome = ?,
          Unidade_Medida = ?,
          Preco_Base = ?,
          Estoque_Atual = ?,
          ID_Tipo_Produto = ?
      WHERE ID_Produto = ?
    `, [
      dados.nome,
      dados.unidade_medida,
      dados.preco_base,
      dados.estoque_atual,
      dados.id_tipo_produto,
      id
    ]);
    return result.affectedRows;
  }

  // Atualizar estoque
  static async atualizarEstoque(id, quantidade) {
    const [result] = await db.query(`
      UPDATE Produto 
      SET Estoque_Atual = Estoque_Atual + ?
      WHERE ID_Produto = ?
    `, [quantidade, id]);
    return result.affectedRows;
  }

  // Deletar produto
  static async deletar(id) {
    const [result] = await db.query(
      'DELETE FROM Produto WHERE ID_Produto = ?',
      [id]
    );
    return result.affectedRows;
  }

  // Verificar se existe
  static async existe(id) {
    const [rows] = await db.query(
      'SELECT EXISTS(SELECT 1 FROM Produto WHERE ID_Produto = ?) AS existe',
      [id]
    );
    return rows[0].existe === 1;
  }

  // Contar vendas vinculadas
  static async contarVendasVinculadas(id) {
    const [rows] = await db.query(
      'SELECT COUNT(*) as total FROM Item_Venda WHERE ID_Produto = ?',
      [id]
    );
    return rows[0].total;
  }

  // Obter estoque atual
  static async obterEstoqueAtual(id) {
    const [rows] = await db.query(
      'SELECT Estoque_Atual FROM Produto WHERE ID_Produto = ?',
      [id]
    );
    return rows[0] ? rows[0].Estoque_Atual : null;
  }
}

module.exports = ProdutoModel;