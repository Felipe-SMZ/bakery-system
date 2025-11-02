// src/services/clienteService.js

/**
 * 👥 SERVICE DE CLIENTES
 * 
 * Gerencia todas as operações relacionadas a clientes.
 * Inclui controle de crédito (fiado) e histórico de compras.
 */

import api from './api';

// ============================================================
// 📋 LISTAR CLIENTES
// ============================================================

/**
 * Busca todos os clientes (com filtros opcionais)
 * 
 * @param {Object} filtros - Filtros opcionais
 * @param {String} filtros.status - Status do cliente (bom, medio, ruim)
 * @param {String} filtros.busca - Buscar por nome ou telefone
 * @returns {Promise<Array>} - Lista de clientes
 * 
 * Exemplo de uso:
 * const clientes = await listarClientes();
 * const bons = await listarClientes({ status: 'bom' });
 * const busca = await listarClientes({ busca: 'jose' });
 */
export const listarClientes = async (filtros = {}) => {
    try {
        // Monta os query parameters
        const params = new URLSearchParams();

        if (filtros.status) {
            params.append('status', filtros.status);
        }

        if (filtros.busca) {
            params.append('busca', filtros.busca);
        }

        // Faz a requisição GET
        const url = params.toString() ? `/clientes?${params.toString()}` : '/clientes';
        const response = await api.get(url);

        return response.data.data;
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        throw error;
    }
};

// ============================================================
// 🔍 BUSCAR CLIENTE POR ID
// ============================================================

/**
 * Busca um cliente específico pelo ID
 * Inclui informações de crédito calculadas
 * 
 * @param {Number} id - ID do cliente
 * @returns {Promise<Object>} - Dados completos do cliente
 */
export const buscarClientePorId = async (id) => {
    try {
        const response = await api.get(`/clientes/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        throw error;
    }
};

// ============================================================
// ➕ CRIAR CLIENTE
// ============================================================

/**
 * Cria um novo cliente
 * 
 * @param {Object} dados - Dados do cliente
 * @param {String} dados.Nome - Nome completo *
 * @param {String} dados.Telefone - Telefone *
 * @param {String} dados.Rua - Rua (opcional)
 * @param {String} dados.Numero - Número (opcional)
 * @param {String} dados.Bairro - Bairro (opcional)
 * @param {String} dados.Cidade - Cidade (opcional)
 * @param {String} dados.CEP - CEP (opcional)
 * @param {String} dados.Status - Status (bom, medio, ruim) *
 * @param {Number} dados.Limite_Fiado - Limite de fiado *
 * @returns {Promise<Object>} - Cliente criado
 * 
 * Exemplo de uso:
 * const novoCliente = await criarCliente({
 *   Nome: 'Ana Costa',
 *   Telefone: '(11) 91234-5678',
 *   Status: 'bom',
 *   Limite_Fiado: 150.00
 * });
 */
export const criarCliente = async (dados) => {
    try {
        // Adapter: PascalCase → snake_case
        const payload = {
            nome: dados.Nome,
            telefone: dados.Telefone,
            rua: dados.Rua || null,
            numero: dados.Numero || null,
            bairro: dados.Bairro || null,
            cidade: dados.Cidade || null,
            cep: dados.CEP || null,
            status: dados.Status,
            limite_fiado: dados.Limite_Fiado
        };

        const response = await api.post('/clientes', payload);
        return response.data.data;
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        throw error;
    }
};

// ============================================================
// ✏️ ATUALIZAR CLIENTE
// ============================================================

/**
 * Atualiza um cliente existente
 * 
 * @param {Number} id - ID do cliente
 * @param {Object} dados - Dados para atualizar
 * @returns {Promise<Object>} - Confirmação
 */
export const atualizarCliente = async (id, dados) => {
    try {
        // Adapter: PascalCase → snake_case
        const payload = {
            nome: dados.Nome,
            telefone: dados.Telefone,
            rua: dados.Rua || null,
            numero: dados.Numero || null,
            bairro: dados.Bairro || null,
            cidade: dados.Cidade || null,
            cep: dados.CEP || null,
            status: dados.Status,
            limite_fiado: dados.Limite_Fiado
        };

        const response = await api.put(`/clientes/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        throw error;
    }
};

// ============================================================
// 🗑️ DELETAR CLIENTE
// ============================================================

/**
 * Deleta um cliente
 * 
 * @param {Number} id - ID do cliente
 * @returns {Promise<Object>} - Confirmação
 * 
 * Observação: Backend vai bloquear se houver vendas vinculadas
 */
export const deletarCliente = async (id) => {
    try {
        const response = await api.delete(`/clientes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        throw error;
    }
};

// ============================================================
// 💰 VERIFICAR CRÉDITO DISPONÍVEL
// ============================================================

/**
 * Verifica o crédito disponível de um cliente
 * Útil antes de fazer uma venda a fiado
 * 
 * @param {Number} id - ID do cliente
 * @returns {Promise<Object>} - Informações de crédito
 * 
 * Retorna:
 * {
 *   Limite_Fiado: 200.00,
 *   Total_Em_Aberto: 50.00,
 *   Credito_Disponivel: 150.00,
 *   Status: "bom"
 * }
 */
export const verificarCredito = async (id) => {
    try {
        const response = await api.get(`/clientes/${id}/credito`);
        return response.data.data;
    } catch (error) {
        console.error('Erro ao verificar crédito:', error);
        throw error;
    }
};

// ============================================================
// 📊 HISTÓRICO DE COMPRAS
// ============================================================

/**
 * Busca o histórico de compras de um cliente
 * 
 * @param {Number} id - ID do cliente
 * @param {Object} filtros - Filtros opcionais
 * @param {String} filtros.dataInicio - Data início (YYYY-MM-DD)
 * @param {String} filtros.dataFim - Data fim (YYYY-MM-DD)
 * @returns {Promise<Array>} - Lista de vendas
 */
export const buscarHistoricoCompras = async (id, filtros = {}) => {
    try {
        const params = new URLSearchParams();

        if (filtros.dataInicio) {
            params.append('dataInicio', filtros.dataInicio);
        }

        if (filtros.dataFim) {
            params.append('dataFim', filtros.dataFim);
        }

        const url = params.toString()
            ? `/clientes/${id}/compras?${params.toString()}`
            : `/clientes/${id}/compras`;

        const response = await api.get(url);
        return response.data.data;
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        throw error;
    }
};

// ============================================================
// 📤 EXPORT DEFAULT
// ============================================================

const clienteService = {
    listarClientes,
    buscarClientePorId,
    criarCliente,
    atualizarCliente,
    deletarCliente,
    verificarCredito,
    buscarHistoricoCompras
};

export default clienteService;