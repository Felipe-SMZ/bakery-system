// src/services/cargoService.js

/**
 * 💼 SERVICE DE CARGOS
 * 
 * Gerencia as operações relacionadas aos cargos de funcionários
 * (Atendente, Caixa, Padeiro, Gerente, etc.)
 */

import api from './api';

// ============================================================
// 📋 LISTAR CARGOS
// ============================================================

/**
 * Busca todos os cargos
 * 
 * @returns {Promise<Array>} - Lista de cargos
 * 
 * Exemplo de uso:
 * const cargos = await listarCargos();
 * // [{ ID_Cargo: 1, Nome_Cargo: "Atendente" }, ...]
 */
export const listarCargos = async () => {
    try {
        const response = await api.get('/cargos');
        return response.data.data;
    } catch (error) {
        console.error('Erro ao listar cargos:', error);
        throw error;
    }
};

// ============================================================
// 🔍 BUSCAR CARGO POR ID
// ============================================================

/**
 * Busca um cargo específico pelo ID
 * 
 * @param {Number} id - ID do cargo
 * @returns {Promise<Object>} - Dados do cargo
 */
export const buscarCargoPorId = async (id) => {
    try {
        const response = await api.get(`/cargos/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Erro ao buscar cargo ${id}:`, error);
        throw error;
    }
};

// ============================================================
// ➕ CRIAR CARGO
// ============================================================

/**
 * Cria um novo cargo
 * 
 * @param {Object} dados - { Nome_Cargo: string }
 * @returns {Promise<Object>} - Cargo criado
 */
export const criarCargo = async (dados) => {
    try {
        const response = await api.post('/cargos', dados);
        return response.data.data;
    } catch (error) {
        console.error('Erro ao criar cargo:', error);
        throw error;
    }
};

// ============================================================
// ✏️ ATUALIZAR CARGO
// ============================================================

/**
 * Atualiza um cargo existente
 * 
 * @param {Number} id - ID do cargo
 * @param {Object} dados - Dados a atualizar
 * @returns {Promise<Object>} - Confirmação
 */
export const atualizarCargo = async (id, dados) => {
    try {
        const response = await api.put(`/cargos/${id}`, dados);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar cargo ${id}:`, error);
        throw error;
    }
};

// ============================================================
// 🗑️ DELETAR CARGO
// ============================================================

/**
 * Deleta um cargo
 * 
 * @param {Number} id - ID do cargo
 * @returns {Promise<Object>} - Confirmação
 */
export const deletarCargo = async (id) => {
    try {
        const response = await api.delete(`/cargos/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao deletar cargo ${id}:`, error);
        throw error;
    }
};

// ============================================================
// 📤 EXPORT DEFAULT
// ============================================================

const cargoService = {
    listarCargos,
    buscarCargoPorId,
    criarCargo,
    atualizarCargo,
    deletarCargo
};

export default cargoService;