// src/services/tipoProdutoService.js

/**
 * 🏷️ SERVICE DE TIPOS DE PRODUTO
 * 
 * Gerencia as operações relacionadas aos tipos/categorias de produtos
 * (Pães, Salgados, Doces, Bebidas, etc.)
 */

import api from './api';

// ============================================================
// 📋 LISTAR TIPOS DE PRODUTO
// ============================================================

/**
 * Busca todos os tipos de produto
 * 
 * @returns {Promise<Array>} - Lista de tipos
 * 
 * Exemplo de uso:
 * const tipos = await listarTiposProduto();
 * // [{ ID_Tipo_Produto: 1, Nome_Tipo: "Pães" }, ...]
 */
export const listarTiposProduto = async () => {
    try {
        const response = await api.get('/tipos-produto');
        return response.data.data;
    } catch (error) {
        console.error('Erro ao listar tipos de produto:', error);
        throw error;
    }
};

// ============================================================
// 🔍 BUSCAR TIPO POR ID
// ============================================================

/**
 * Busca um tipo específico pelo ID
 * 
 * @param {Number} id - ID do tipo
 * @returns {Promise<Object>} - Dados do tipo
 */
export const buscarTipoPorId = async (id) => {
    try {
        const response = await api.get(`/tipos-produto/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Erro ao buscar tipo ${id}:`, error);
        throw error;
    }
};

// ============================================================
// ➕ CRIAR TIPO
// ============================================================

/**
 * Cria um novo tipo de produto
 * 
 * @param {Object} dados - { Nome_Tipo: string }
 * @returns {Promise<Object>} - Tipo criado
 */
export const criarTipo = async (dados) => {
    try {
        const response = await api.post('/tipos-produto', dados);
        return response.data.data;
    } catch (error) {
        console.error('Erro ao criar tipo:', error);
        throw error;
    }
};

// ============================================================
// ✏️ ATUALIZAR TIPO
// ============================================================

/**
 * Atualiza um tipo existente
 * 
 * @param {Number} id - ID do tipo
 * @param {Object} dados - Dados a atualizar
 * @returns {Promise<Object>} - Confirmação
 */
export const atualizarTipo = async (id, dados) => {
    try {
        const response = await api.put(`/tipos-produto/${id}`, dados);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar tipo ${id}:`, error);
        throw error;
    }
};

// ============================================================
// 🗑️ DELETAR TIPO
// ============================================================

/**
 * Deleta um tipo de produto
 * 
 * @param {Number} id - ID do tipo
 * @returns {Promise<Object>} - Confirmação
 */
export const deletarTipo = async (id) => {
    try {
        const response = await api.delete(`/tipos-produto/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao deletar tipo ${id}:`, error);
        throw error;
    }
};

// ============================================================
// 📤 EXPORT DEFAULT
// ============================================================

const tipoProdutoService = {
    listarTiposProduto,
    buscarTipoPorId,
    criarTipo,
    atualizarTipo,
    deletarTipo
};

export default tipoProdutoService;