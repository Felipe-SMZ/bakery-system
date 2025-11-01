// src/services/produtoService.js

import api from './api';

/**
 * 📦 SERVIÇO DE PRODUTOS
 * 
 * Todas as funções que conversam com a API de produtos.
 * Cada função retorna uma Promise (operação assíncrona).
 */

// ============================================================
// 📋 LISTAR PRODUTOS
// ============================================================

/**
 * Busca todos os produtos (com filtros opcionais)
 * 
 * @param {Object} filtros - Filtros opcionais
 * @param {Number} filtros.tipo - ID do tipo de produto
 * @param {String} filtros.busca - Termo de busca no nome
 * @returns {Promise} - Lista de produtos
 * 
 * Exemplo de uso:
 * const produtos = await listarProdutos({ tipo: 1, busca: 'pao' });
 */
export const listarProdutos = async (filtros = {}) => {
  try {
    // Monta os query parameters (?tipo=1&nome=pao)
    const params = new URLSearchParams();

    if (filtros.tipo) {
      params.append('tipo', filtros.tipo);
    }

    if (filtros.busca) {
      params.append('nome', filtros.busca); // ← MUDOU: de 'busca' para 'nome'
    }

    // Faz a requisição GET
    const response = await api.get(`/produtos?${params.toString()}`);

    return response.data.data; // Retorna só o array de produtos
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    throw error; // Repassa o erro para quem chamou a função
  }
};

// ============================================================
// 🔍 BUSCAR PRODUTO POR ID
// ============================================================

/**
 * Busca um produto específico pelo ID
 * 
 * @param {Number} id - ID do produto
 * @returns {Promise} - Dados do produto
 */
export const buscarProdutoPorId = async (id) => {
  try {
    const response = await api.get(`/produtos/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    throw error;
  }
};

// ============================================================
// ➕ CRIAR PRODUTO
// ============================================================

/**
 * Cria um novo produto
 * 
 * @param {Object} dados - Dados do produto
 * @param {String} dados.Nome - Nome do produto
 * @param {Number} dados.ID_Tipo_Produto - ID do tipo
 * @param {String} dados.Unidade_Medida - unidade, kg ou fatia
 * @param {Number} dados.Preco_Base - Preço
 * @param {Number} dados.Estoque_Atual - Estoque inicial
 * @returns {Promise} - Produto criado
 */
export const criarProduto = async (dados) => {
  try {
    const response = await api.post('/produtos', dados);
    return response.data.data;
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
};

// ============================================================
// ✏️ ATUALIZAR PRODUTO
// ============================================================

/**
 * Atualiza um produto existente
 * 
 * @param {Number} id - ID do produto
 * @param {Object} dados - Dados para atualizar
 * @returns {Promise} - Confirmação
 */
export const atualizarProduto = async (id, dados) => {
  try {
    const response = await api.put(`/produtos/${id}`, dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
};

// ============================================================
// 🗑️ DELETAR PRODUTO
// ============================================================

/**
 * Deleta um produto
 * 
 * @param {Number} id - ID do produto
 * @returns {Promise} - Confirmação
 */
export const deletarProduto = async (id) => {
  try {
    const response = await api.delete(`/produtos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }
};

// ============================================================
// 🔄 AJUSTAR ESTOQUE
// ============================================================

/**
 * Ajusta o estoque de um produto
 * 
 * @param {Number} id - ID do produto
 * @param {Number} quantidade - Quantidade a adicionar (positivo) ou remover (negativo)
 * @param {String} motivo - Motivo do ajuste
 * @returns {Promise} - Novo estoque
 */
export const ajustarEstoque = async (id, quantidade, motivo) => {
  try {
    const response = await api.patch(`/produtos/${id}/estoque`, {
      quantidade,
      motivo
    });
    return response.data.data;
  } catch (error) {
    console.error('Erro ao ajustar estoque:', error);
    throw error;
  }
};

// ============================================================
// 📊 LISTAR TIPOS DE PRODUTO
// ============================================================

/**
 * Busca todos os tipos de produto (para os filtros)
 * 
 * @returns {Promise} - Lista de tipos
 */
export const listarTiposProduto = async () => {
  try {
    const response = await api.get('/tipos-produto');
    return response.data.data;
  } catch (error) {
    console.error('Erro ao listar tipos:', error);
    throw error;
  }
};