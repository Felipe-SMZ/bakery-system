// src/services/api.js

/**
 * 🌐 CONFIGURAÇÃO DA API
 * 
 * Este arquivo configura o Axios para fazer requisições HTTP pro backend.
 * É como criar um "carteiro" que sabe o endereço do backend.
 */

import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// ============================================================
// 📡 CRIAR INSTÂNCIA DO AXIOS
// ============================================================

/**
 * Criamos uma instância configurada do Axios
 * 
 * Por que fazer isso?
 * - Não precisa repetir a URL base em toda requisição
 * - Configurações aplicadas automaticamente em todas as chamadas
 * - Facilita manutenção (muda URL em um só lugar)
 */
const api = axios.create({
    baseURL: API_BASE_URL,  // URL base: http://localhost:3000/api
    timeout: 10000,         // Tempo máximo de espera: 10 segundos
    headers: {
        'Content-Type': 'application/json'  // Tipo de dados: JSON
    }
});

// ============================================================
// 🔄 INTERCEPTOR DE REQUISIÇÃO
// ============================================================

/**
 * Interceptor = "Intercepta" toda requisição ANTES de enviar
 * 
 * Aqui podemos:
 * - Adicionar token de autenticação (futuro)
 * - Fazer log das requisições
 * - Modificar headers
 */
api.interceptors.request.use(
    (config) => {
        // Aqui você pode adicionar token de autenticação no futuro:
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }

        return config;
    },
    (error) => {
        // Se der erro antes mesmo de enviar
        console.error('❌ Erro na requisição:', error);
        return Promise.reject(error);
    }
);

// ============================================================
// 📥 INTERCEPTOR DE RESPOSTA
// ============================================================

/**
 * Interceptor = "Intercepta" toda resposta ANTES de devolver pro código
 * 
 * Aqui podemos:
 * - Tratar erros globalmente
 * - Fazer log das respostas
 * - Renovar token expirado (futuro)
 */
api.interceptors.response.use(
    (response) => {
        // Resposta com sucesso (status 200, 201, etc)
        return response;
    },
    (error) => {
        // Resposta com erro (status 400, 404, 500, etc)

        if (error.response) {
            // Servidor respondeu com erro
            const { status } = error.response;

            // Tratamento específico por tipo de erro
            switch (status) {
                case 401:
                    console.error('🔒 Não autorizado - faça login');
                    // Aqui você pode redirecionar pro login no futuro
                    break;
                case 404:
                    console.error('🔍 Recurso não encontrado');
                    break;
                case 500:
                    console.error('💥 Erro no servidor');
                    break;
            }
        } else if (error.request) {
            // Requisição foi feita mas sem resposta (servidor offline)
            console.error('📡 Servidor não respondeu. Verifique se o backend está rodando.');
        } else {
            // Erro ao configurar requisição
            console.error('⚠️ Erro:', error.message);
        }

        return Promise.reject(error);
    }
);

// ============================================================
// 🎯 FUNÇÕES AUXILIARES (HELPERS)
// ============================================================

/**
 * Trata erros da API e retorna mensagem amigável
 * 
 * @param {Error} error - Erro capturado
 * @returns {String} - Mensagem de erro formatada
 */
export const tratarErroApi = (error) => {
    if (error.response) {
        // Servidor respondeu com erro
        return error.response.data?.error ||
            error.response.data?.message ||
            'Erro ao processar requisição';
    } else if (error.request) {
        // Sem resposta do servidor
        return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    } else {
        // Erro na configuração
        return error.message || 'Erro desconhecido';
    }
};

/**
 * Verifica se há erro de validação específico
 * 
 * @param {Error} error - Erro capturado
 * @param {String} campo - Nome do campo
 * @returns {Boolean}
 */
export const temErroValidacao = (error, campo) => {
    return error.response?.data?.details?.some(
        detail => detail.field === campo
    );
};

// ============================================================
// 📤 EXPORTAR INSTÂNCIA CONFIGURADA
// ============================================================

/**
 * Exporta a instância do Axios configurada
 * 
 * Agora em outros arquivos você pode fazer:
 * import api from './services/api';
 * api.get('/produtos') // já inclui http://localhost:3000/api
 */
export default api;