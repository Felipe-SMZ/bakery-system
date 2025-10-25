// src/models/produtoModel.js
const db = require('../config/db');

class ProdutoModel {

    // Listar todos os produtos com tipo
    static async listarTodos() {
        try {
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
        } catch (error) {
            throw new Error('Erro ao listar produtos: ' + error.message);
        }
    }

    // Buscar por ID
    static async buscarPorId(id) {
        try {
            const [rows] = await db.query(`
        SELECT 
          p.*,
          tp.Nome_Tipo AS Tipo
        FROM Produto p
        INNER JOIN Tipo_Produto tp ON p.ID_Tipo_Produto = tp.ID_Tipo_Produto
        WHERE p.ID_Produto = ?
      `, [id]);
            return rows[0];
        } catch (error) {
            throw new Error('Erro ao buscar produto: ' + error.message);
        }
    }

    // Filtrar por tipo
    static async filtrarPorTipo(tipoId) {
        try {
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
        } catch (error) {
            throw new Error('Erro ao filtrar produtos: ' + error.message);
        }
    }

    // Buscar por nome (parcial)
    static async buscarPorNome(nome) {
        try {
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
        } catch (error) {
            throw new Error('Erro ao buscar produtos por nome: ' + error.message);
        }
    }

    // Produtos com estoque baixo
    static async estoqueBaixo(limite = 50) {
        try {
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
        } catch (error) {
            throw new Error('Erro ao buscar produtos com estoque baixo: ' + error.message);
        }
    }

    // Criar novo produto
    static async criar(dados) {
        try {
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
        } catch (error) {
            throw new Error('Erro ao criar produto: ' + error.message);
        }
    }

    // Atualizar produto
    static async atualizar(id, dados) {
        try {
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
        } catch (error) {
            throw new Error('Erro ao atualizar produto: ' + error.message);
        }
    }

    // Atualizar estoque
    static async atualizarEstoque(id, quantidade) {
        try {
            const [result] = await db.query(`
        UPDATE Produto 
        SET Estoque_Atual = Estoque_Atual + ?
        WHERE ID_Produto = ?
      `, [quantidade, id]);
            return result.affectedRows;
        } catch (error) {
            throw new Error('Erro ao atualizar estoque: ' + error.message);
        }
    }

    // Deletar produto
    static async deletar(id) {
        try {
            // Verificar se tem vendas
            const [vendas] = await db.query(
                'SELECT COUNT(*) as total FROM Item_Venda WHERE ID_Produto = ?',
                [id]
            );

            if (vendas[0].total > 0) {
                throw new Error('Não é possível deletar. Existem vendas vinculadas a este produto.');
            }

            const [result] = await db.query(
                'DELETE FROM Produto WHERE ID_Produto = ?',
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
                'SELECT EXISTS(SELECT 1 FROM Produto WHERE ID_Produto = ?) AS existe',
                [id]
            );
            return rows[0].existe === 1;
        } catch (error) {
            throw new Error('Erro ao verificar produto: ' + error.message);
        }
    }

    // Validar estoque disponível
    static async validarEstoque(id, quantidadeSolicitada) {
        try {
            const [rows] = await db.query(
                'SELECT Estoque_Atual FROM Produto WHERE ID_Produto = ?',
                [id]
            );

            if (!rows[0]) {
                throw new Error('Produto não encontrado');
            }

            return rows[0].Estoque_Atual >= quantidadeSolicitada;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProdutoModel;