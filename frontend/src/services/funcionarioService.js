// src/services/funcionarioService.js

/**
 * 🧑‍💼 SERVICE DE FUNCIONÁRIOS
 * 
 * Todas as funções que conversam com a API de funcionários.
 * Similar ao produtoService, mas mais simples (menos campos).
 */

import api from './api';

/**
 * Helper: Constrói payload limpo para API de funcionários
 * 
 * O backend espera os campos em snake_case minúsculo:
 * - nome (string) - nome do funcionário
 * - id_cargo (number) - ID do cargo
 * 
 * Fonte: backend/src/services/funcionarioService.js - método validarDadosFuncionario
 */
const buildFuncionarioPayload = (dados) => {
    return {
        nome: dados.Nome.trim(),
        id_cargo: parseInt(dados.ID_Cargo)
    };
};

// ============================================================
// 📋 LISTAR FUNCIONÁRIOS
// ============================================================

/**
 * Busca todos os funcionários (com filtros opcionais)
 * 
 * @param {Object} filtros - Filtros opcionais
 * @param {Number} filtros.cargo - ID do cargo
 * @returns {Promise<Array>} - Lista de funcionários
 * 
 * Exemplo de uso:
 * const funcionarios = await listarFuncionarios();
 * const caixas = await listarFuncionarios({ cargo: 2 });
 */
export const listarFuncionarios = async (filtros = {}) => {
    try {
        // Monta os query parameters
        const params = new URLSearchParams();

        if (filtros.cargo) {
            params.append('cargo', filtros.cargo);
        }

        // Faz a requisição GET
        const url = params.toString() ? `/funcionarios?${params.toString()}` : '/funcionarios';
        const response = await api.get(url);

        return response.data.data;
    } catch (error) {
        console.error('Erro ao listar funcionários:', error);
        throw error;
    }
};

// ============================================================
// 🔍 BUSCAR FUNCIONÁRIO POR ID
// ============================================================

/**
 * Busca um funcionário específico pelo ID
 * 
 * @param {Number} id - ID do funcionário
 * @returns {Promise<Object>} - Dados do funcionário
 */
export const buscarFuncionarioPorId = async (id) => {
    try {
        const response = await api.get(`/funcionarios/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Erro ao buscar funcionário:', error);
        throw error;
    }
};

// ============================================================
// ➕ CRIAR FUNCIONÁRIO
// ============================================================

/**
 * Cria um novo funcionário
 * 
 * @param {Object} dados - Dados do funcionário
 * @param {String} dados.Nome - Nome do funcionário
 * @param {Number} dados.ID_Cargo - ID do cargo
 * @returns {Promise<Object>} - Funcionário criado
 * 
 * Exemplo de uso:
 * const novoFunc = await criarFuncionario({
 *   Nome: 'João Santos',
 *   ID_Cargo: 1
 * });
 */
export const criarFuncionario = async (dados) => {
    try {
        const payload = buildFuncionarioPayload(dados);
        const response = await api.post('/funcionarios', payload);
        return response.data.data;
    } catch (error) {
        console.error('Erro ao criar funcionário:', error);
        console.error('Resposta do servidor:', error.response?.status, error.response?.data);
        throw error;
    }
};

// ============================================================
// ✏️ ATUALIZAR FUNCIONÁRIO
// ============================================================

/**
 * Atualiza um funcionário existente
 * 
 * @param {Number} id - ID do funcionário
 * @param {Object} dados - Dados para atualizar
 * @returns {Promise<Object>} - Confirmação
 */
export const atualizarFuncionario = async (id, dados) => {
    try {
        const payload = buildFuncionarioPayload(dados);
        const response = await api.put(`/funcionarios/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar funcionário:', error);
        console.error('Resposta do servidor:', error.response?.status, error.response?.data);
        throw error;
    }
};

// ============================================================
// 🗑️ DELETAR FUNCIONÁRIO
// ============================================================

/**
 * Deleta um funcionário
 * 
 * @param {Number} id - ID do funcionário
 * @returns {Promise<Object>} - Confirmação
 * 
 * Observação: Backend vai bloquear se houver vendas vinculadas
 */
export const deletarFuncionario = async (id) => {
    try {
        const response = await api.delete(`/funcionarios/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar funcionário:', error);
        throw error;
    }
};

// ============================================================
// 📊 VENDAS DO FUNCIONÁRIO
// ============================================================

/**
 * Busca vendas de um funcionário específico
 * 
 * @param {Number} id - ID do funcionário
 * @param {Object} filtros - Filtros opcionais
 * @param {String} filtros.dataInicio - Data início (YYYY-MM-DD)
 * @param {String} filtros.dataFim - Data fim (YYYY-MM-DD)
 * @returns {Promise<Object>} - Estatísticas e lista de vendas
 */
export const buscarVendasFuncionario = async (id, filtros = {}) => {
    try {
        const params = new URLSearchParams();

        if (filtros.dataInicio) {
            params.append('dataInicio', filtros.dataInicio);
        }

        if (filtros.dataFim) {
            params.append('dataFim', filtros.dataFim);
        }

        const url = params.toString()
            ? `/funcionarios/${id}/vendas?${params.toString()}`
            : `/funcionarios/${id}/vendas`;

        const response = await api.get(url);
        return response.data.data;
    } catch (error) {
        console.error('Erro ao buscar vendas do funcionário:', error);
        throw error;
    }
};

// ============================================================
// 📤 EXPORT DEFAULT
// ============================================================

const funcionarioService = {
    listarFuncionarios,
    buscarFuncionarioPorId,
    criarFuncionario,
    atualizarFuncionario,
    deletarFuncionario,
    buscarVendasFuncionario
};

export default funcionarioService;