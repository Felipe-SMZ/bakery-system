// src/services/tipoProdutoService.js
const TipoProdutoModel = require('../models/tipoProdutoModel');

class TipoProdutoService {

    // Listar todos
    static async listarTodos() {
        try {
            return await TipoProdutoModel.listarTodos();
        } catch (error) {
            throw new Error('Erro ao listar tipos de produto: ' + error.message);
        }
    }

    // Buscar por ID
    static async buscarPorId(id) {
        try {
            const tipo = await TipoProdutoModel.buscarPorId(id);

            if (!tipo) {
                throw new Error('Tipo de produto não encontrado');
            }

            return tipo;
        } catch (error) {
            throw error;
        }
    }

    // Criar novo tipo
    static async criar(dados) {
        try {
            // Validação de dados
            if (!dados.nome_tipo || dados.nome_tipo.trim() === '') {
                throw new Error('Nome do tipo é obrigatório');
            }

            // Normalizar nome
            const nomeTipo = dados.nome_tipo.trim().toLowerCase();

            const id = await TipoProdutoModel.criar({ nome_tipo: nomeTipo });

            return {
                id,
                nome_tipo: nomeTipo
            };
        } catch (error) {
            // Tratar erro de duplicação
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Tipo de produto já existe');
            }
            throw error;
        }
    }

    // Atualizar tipo
    static async atualizar(id, dados) {
        try {
            // Verificar se existe
            const existe = await TipoProdutoModel.existe(id);
            if (!existe) {
                throw new Error('Tipo de produto não encontrado');
            }

            // Validação de dados
            if (!dados.nome_tipo || dados.nome_tipo.trim() === '') {
                throw new Error('Nome do tipo é obrigatório');
            }

            // Normalizar nome
            const nomeTipo = dados.nome_tipo.trim().toLowerCase();

            await TipoProdutoModel.atualizar(id, { nome_tipo: nomeTipo });

            return {
                id,
                nome_tipo: nomeTipo
            };
        } catch (error) {
            // Tratar erro de duplicação
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Tipo de produto já existe');
            }
            throw error;
        }
    }

    // Deletar tipo
    static async deletar(id) {
        try {
            // Verificar se existe
            const existe = await TipoProdutoModel.existe(id);
            if (!existe) {
                throw new Error('Tipo de produto não encontrado');
            }

            // Regra de negócio: verificar produtos vinculados
            const totalProdutos = await TipoProdutoModel.contarProdutosVinculados(id);

            if (totalProdutos > 0) {
                throw new Error(`Não é possível deletar. Existem ${totalProdutos} produto(s) vinculado(s) a este tipo.`);
            }

            await TipoProdutoModel.deletar(id);

            return true;
        } catch (error) {
            throw error;
        }
    }

    // Verificar se existe
    static async existe(id) {
        try {
            return await TipoProdutoModel.existe(id);
        } catch (error) {
            throw new Error('Erro ao verificar tipo de produto: ' + error.message);
        }
    }
}

module.exports = TipoProdutoService;