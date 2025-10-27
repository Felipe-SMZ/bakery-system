// src/services/produtoService.js

/**
 * 🍞 SERVICE DE PRODUTOS
 * 
 * Este arquivo concentra TODAS as requisições relacionadas a produtos.
 * 
 * Por que criar um service?
 * - Organização: todas as chamadas de produto em um só lugar
 * - Reutilização: vários componentes usam as mesmas funções
 * - Manutenção: se mudar a URL, muda só aqui
 */

import api from './api';

// ============================================================
// 📋 LISTAR PRODUTOS
// ============================================================

/**
 * Busca todos os produtos
 * 
 * @param {Object} filtros - Filtros opcionais (tipo, busca)
 * @returns {Promise<Array>} - Lista de produtos
 * 
 * Exemplo de uso:
 * const produtos = await listarProdutos();
 * const produtosFiltrados = await listarProdutos({ tipo: 1 });
 */
export const listarProdutos = async (filtros = {}) => {
  try {
    // Monta a URL com query params se houver filtros
    // Exemplo: /produtos?tipo=1&busca=pao
    const params = new URLSearchParams();
    
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.busca) params.append('busca', filtros.busca);
    
    const queryString = params.toString();
    const url = queryString ? `/produtos?${queryString}` : '/produtos';
    
    // Faz a requisição GET
    const response = await api.get(url);
    
    // Retorna só os dados (não toda a resposta)
    return response.data.data;
    
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    throw error;
  }
};

// ============================================================
// 🔍 BUSCAR PRODUTO POR ID
// ============================================================

/**
 * Busca um produto específico pelo ID
 * 
 * @param {Number} id - ID do produto
 * @returns {Promise<Object>} - Dados do produto
 * 
 * Exemplo de uso:
 * const produto = await buscarProdutoPorId(1);
 */
export const buscarProdutoPorId = async (id) => {
  try {
    // GET /produtos/1
    const response = await api.get(`/produtos/${id}`);
    return response.data.data;
    
  } catch (error) {
    console.error(`Erro ao buscar produto ${id}:`, error);
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
 * @returns {Promise<Object>} - Produto criado
 * 
 * Exemplo de uso:
 * const novoProduto = await criarProduto({
 *   Nome: 'Pão Integral',
 *   ID_Tipo_Produto: 1,
 *   Unidade_Medida: 'unidade',
 *   Preco_Base: 0.80,
 *   Estoque_Atual: 50
 * });
 */
export const criarProduto = async (dados) => {
  try {
    // POST /produtos
    // Envia dados no corpo da requisição
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
 * @param {Object} dados - Dados a serem atualizados
 * @returns {Promise<Object>} - Produto atualizado
 * 
 * Exemplo de uso:
 * await atualizarProduto(1, { Preco_Base: 0.90 });
 */
export const atualizarProduto = async (id, dados) => {
  try {
    // PUT /produtos/1
    const response = await api.put(`/produtos/${id}`, dados);
    return response.data;
    
  } catch (error) {
    console.error(`Erro ao atualizar produto ${id}:`, error);
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
 * @returns {Promise<Object>} - Confirmação
 * 
 * Exemplo de uso:
 * await deletarProduto(1);
 */
export const deletarProduto = async (id) => {
  try {
    // DELETE /produtos/1
    const response = await api.delete(`/produtos/${id}`);
    return response.data;
    
  } catch (error) {
    console.error(`Erro ao deletar produto ${id}:`, error);
    throw error;
  }
};

// ============================================================
// 📦 AJUSTAR ESTOQUE
// ============================================================

/**
 * Ajusta o estoque de um produto
 * 
 * @param {Number} id - ID do produto
 * @param {Number} quantidade - Quantidade a ajustar (+ ou -)
 * @param {String} motivo - Motivo do ajuste
 * @returns {Promise<Object>} - Confirmação
 * 
 * Exemplo de uso:
 * await ajustarEstoque(1, 50, 'Entrada de mercadoria');
 * await ajustarEstoque(1, -10, 'Perda');
 */
export const ajustarEstoque = async (id, quantidade, motivo) => {
  try {
    // PATCH /produtos/1/estoque
    const response = await api.patch(`/produtos/${id}/estoque`, {
      quantidade,
      motivo
    });
    return response.data;
    
  } catch (error) {
    console.error(`Erro ao ajustar estoque do produto ${id}:`, error);
    throw error;
  }
};

// ============================================================
// 📊 BUSCAR PRODUTOS POR TIPO
// ============================================================

/**
 * Busca produtos de um tipo específico
 * 
 * @param {Number} idTipo - ID do tipo de produto
 * @returns {Promise<Array>} - Lista de produtos
 * 
 * Exemplo de uso:
 * const paes = await buscarProdutosPorTipo(1);
 */
export const buscarProdutosPorTipo = async (idTipo) => {
  try {
    // GET /produtos?tipo=1
    return await listarProdutos({ tipo: idTipo });
    
  } catch (error) {
    console.error(`Erro ao buscar produtos do tipo ${idTipo}:`, error);
    throw error;
  }
};

// ============================================================
// 🔍 BUSCAR PRODUTOS (AUTOCOMPLETE)
// ============================================================

/**
 * Busca produtos por nome (para autocomplete)
 * 
 * @param {String} termo - Termo de busca
 * @returns {Promise<Array>} - Lista de produtos
 * 
 * Exemplo de uso:
 * const produtos = await buscarProdutos('pao');
 */
export const buscarProdutos = async (termo) => {
  try {
    // GET /produtos?busca=pao
    if (!termo || termo.length < 2) {
      return []; // Não busca com menos de 2 caracteres
    }
    
    return await listarProdutos({ busca: termo });
    
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

// ============================================================
// 📤 EXPORTAR TODAS AS FUNÇÕES COMO DEFAULT
// ============================================================

/**
 * Exporta um objeto com todas as funções
 * Permite usar de duas formas:
 * 
 * 1. Import nomeado:
 *    import { listarProdutos, criarProduto } from './produtoService';
 * 
 * 2. Import default:
 *    import produtoService from './produtoService';
 *    produtoService.listarProdutos();
 */
const produtoService = {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  deletarProduto,
  ajustarEstoque,
  buscarProdutosPorTipo,
  buscarProdutos
};

export default produtoService;