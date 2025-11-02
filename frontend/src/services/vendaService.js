// src/services/vendaService.js

/**
 * 🛒 SERVICE DE VENDAS
 * 
 * Este arquivo contém todas as funções para gerenciar VENDAS.
 * É a camada de comunicação entre o frontend (React) e o backend (API).
 * 
 * 📚 CONCEITOS IMPORTANTES:
 * 
 * 1. SERVICE LAYER (Camada de Serviço)
 *    - Isola a lógica de comunicação com a API
 *    - Se a API mudar, só mexemos aqui
 *    - Componentes não precisam saber como funciona a API
 * 
 * 2. ASYNC/AWAIT
 *    - Requisições HTTP são assíncronas (demoram tempo)
 *    - async: marca uma função como assíncrona
 *    - await: espera a promessa ser resolvida
 * 
 * 3. TRY/CATCH
 *    - try: tenta executar o código
 *    - catch: captura erros que acontecerem
 *    - Importante para não quebrar a aplicação
 * 
 * 4. PADRONIZAÇÃO DE RESPOSTA
 *    - Backend retorna: { success, message, data }
 *    - Sempre acessamos response.data.data para pegar os dados
 */

import api from './api';

// ============================================================
// 📋 LISTAR VENDAS
// ============================================================

/**
 * Busca todas as vendas com filtros opcionais
 * 
 * @param {Object} filtros - Filtros opcionais
 * @param {String} filtros.periodo_inicio - Data inicial (YYYY-MM-DD)
 * @param {String} filtros.periodo_fim - Data final (YYYY-MM-DD)
 * @param {String} filtros.tipo_pagamento - 'dinheiro', 'cartao', 'pix', 'fiado'
 * @param {Number} filtros.cliente - ID do cliente
 * @param {Number} filtros.funcionario - ID do funcionário
 * 
 * @returns {Promise<Array>} Array de vendas
 * 
 * @example
 * // Buscar todas as vendas
 * const resultado = await listarVendas();
 * console.log(resultado); // Array de vendas
 * 
 * @example
 * // Buscar vendas com filtros
 * const resultado = await listarVendas({
 *   periodo_inicio: '2024-01-01',
 *   periodo_fim: '2024-12-31',
 *   tipo_pagamento: 'dinheiro'
 * });
 */
export const listarVendas = async (filtros = {}) => {
    try {
        // Faz requisição GET para /vendas com parâmetros de query
        // Backend aceita: periodo_inicio, periodo_fim, cliente, funcionario, tipo_pagamento
        const response = await api.get('/vendas', { 
            params: filtros 
        });
        
        // Backend retorna: { success, total, filtros, data: [...] }
        // Retornamos o array de vendas
        return response.data.data;
    } catch (error) {
        // Loga o erro no console para debug
        console.error('❌ Erro ao listar vendas:', error);
        
        // Repassa o erro para quem chamou a função tratar
        throw error;
    }
};

// ============================================================
// 🔍 BUSCAR VENDA POR ID
// ============================================================

/**
 * Busca uma venda específica pelo ID
 * Inclui os itens da venda e dados do cliente/funcionário
 * 
 * @param {Number} id - ID da venda
 * @returns {Promise<Object>} Dados completos da venda
 * 
 * @example
 * const venda = await buscarVendaPorId(1);
 * console.log(venda.cliente.nome);
 * console.log(venda.itens); // Array de produtos vendidos
 */
export const buscarVendaPorId = async (id) => {
    try {
        // Validação: ID é obrigatório
        if (!id) {
            throw new Error('ID da venda é obrigatório');
        }
        
        // Faz requisição GET para /vendas/:id
        const response = await api.get(`/vendas/${id}`);
        
        return response.data.data;
    } catch (error) {
        console.error(`❌ Erro ao buscar venda ${id}:`, error);
        throw error;
    }
};

// ============================================================
// ➕ CRIAR NOVA VENDA
// ============================================================

/**
 * Registra uma nova venda no sistema
 * 
 * ⚠️ IMPORTANTE: Backend valida TUDO automaticamente:
 * - Existência de cliente e funcionário
 * - Estoque disponível de cada produto
 * - Preço atual (busca do banco, não usa o enviado!)
 * - Crédito disponível (se fiado)
 * - Usa TRANSAÇÃO (ou salva tudo ou nada)
 * 
 * @param {Object} dadosVenda - Dados da venda
 * @param {Number} dadosVenda.id_cliente - ID do cliente (obrigatório)
 * @param {Number} dadosVenda.id_funcionario - ID do funcionário (obrigatório)
 * @param {String} dadosVenda.tipo_pagamento - 'dinheiro', 'cartao', 'pix', 'fiado'
 * @param {Array} dadosVenda.itens - Array de produtos vendidos
 * @param {Number} dadosVenda.itens[].id_produto - ID do produto
 * @param {Number} dadosVenda.itens[].quantidade - Quantidade vendida
 * 
 * @returns {Promise<Object>} Venda criada com todos os detalhes
 * 
 * @example
 * const novaVenda = await criarVenda({
 *   id_cliente: 1,
 *   id_funcionario: 2,
 *   tipo_pagamento: 'dinheiro',
 *   itens: [
 *     { id_produto: 5, quantidade: 2 },
 *     { id_produto: 8, quantidade: 1 }
 *   ]
 * });
 */
export const criarVenda = async (dadosVenda) => {
    try {
        // ⚠️ VALIDAÇÕES BÁSICAS (frontend)
        // Backend faz validações completas, mas fazemos validações básicas aqui
        // para dar feedback rápido ao usuário
        
        // 1. Verifica se tem cliente
        if (!dadosVenda.id_cliente) {
            throw new Error('Cliente é obrigatório');
        }
        
        // 2. Verifica se tem funcionário
        if (!dadosVenda.id_funcionario) {
            throw new Error('Funcionário é obrigatório');
        }
        
        // 3. Verifica se tem itens
        if (!dadosVenda.itens || dadosVenda.itens.length === 0) {
            throw new Error('A venda precisa ter pelo menos 1 item');
        }
        
        // 4. Verifica se tem tipo de pagamento
        if (!dadosVenda.tipo_pagamento) {
            throw new Error('Forma de pagamento é obrigatória');
        }
        
        // 5. Valida cada item da venda
        dadosVenda.itens.forEach((item, index) => {
            if (!item.id_produto) {
                throw new Error(`Item ${index + 1}: produto é obrigatório`);
            }
            if (!item.quantidade || item.quantidade <= 0) {
                throw new Error(`Item ${index + 1}: quantidade deve ser maior que 0`);
            }
        });
        
        // Faz requisição POST para /vendas
        // Backend retorna: { success, message, data: vendaCompleta }
        const response = await api.post('/vendas', dadosVenda);
        
        return response.data.data;
    } catch (error) {
        console.error('❌ Erro ao criar venda:', error);
        throw error;
    }
};

// ============================================================
// 💰 QUITAR VENDA A FIADO
// ============================================================

/**
 * Registra a quitação de uma venda a fiado
 * 
 * ⚠️ IMPORTANTE:
 * - Só funciona para vendas a fiado
 * - Não pode quitar venda já quitada
 * - Registra a data de pagamento
 * - Libera o crédito do cliente
 * 
 * @param {Number} id - ID da venda
 * @returns {Promise<Object>} Venda atualizada
 * 
 * @example
 * const vendaQuitada = await quitarVendaFiado(15);
 * console.log(vendaQuitada.Data_Pagamento_Fiado); // Data de hoje
 */
export const quitarVendaFiado = async (id) => {
    try {
        if (!id) {
            throw new Error('ID da venda é obrigatório');
        }
        
        // PATCH /vendas/:id/quitar
        const response = await api.patch(`/vendas/${id}/quitar`);
        
        return response.data.data;
    } catch (error) {
        console.error(`❌ Erro ao quitar venda ${id}:`, error);
        throw error;
    }
};

// ============================================================
// 📊 LISTAR VENDAS A FIADO EM ABERTO
// ============================================================

/**
 * Lista todas as vendas a fiado que ainda não foram quitadas
 * 
 * Útil para:
 * - Relatório de devedores
 * - Controle de recebíveis
 * - Cobrança de clientes
 * 
 * @returns {Promise<Object>} Objeto com vendas e totais
 * 
 * @example
 * const resultado = await listarFiadoEmAberto();
 * console.log(resultado.total_vendas); // Quantidade de vendas
 * console.log(resultado.total_em_aberto); // Valor total em R$
 * console.log(resultado.vendas); // Array de vendas
 */
export const listarFiadoEmAberto = async () => {
    try {
        // GET /vendas/fiado/em-aberto
        const response = await api.get('/vendas/fiado/em-aberto');
        
        // Backend retorna: { success, total_vendas, total_em_aberto, data: [...] }
        return {
            total_vendas: response.data.total_vendas,
            total_em_aberto: response.data.total_em_aberto,
            vendas: response.data.data
        };
    } catch (error) {
        console.error('❌ Erro ao listar fiado em aberto:', error);
        throw error;
    }
};

// ============================================================
// 📤 EXPORTAR TODAS AS FUNÇÕES
// ============================================================

/**
 * Exporta um objeto com todas as funções
 * Isso permite importar de duas formas:
 * 
 * 1. Import nomeado:
 *    import { listarVendas, criarVenda } from './vendaService';
 * 
 * 2. Import padrão:
 *    import vendaService from './vendaService';
 *    vendaService.listarVendas();
 */
const vendaService = {
    listarVendas,
    buscarVendaPorId,
    criarVenda,
    quitarVendaFiado,
    listarFiadoEmAberto
};

export default vendaService;
