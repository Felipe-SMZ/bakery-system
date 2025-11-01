// src/services/produtoService.js
const ProdutoModel = require('../models/produtoModel');
const TipoProdutoModel = require('../models/tipoProdutoModel');

class ProdutoService {

    // ⭐ Listar produtos (com filtros opcionais combinados)
    static async listarProdutos(filtros = {}) {
        try {
            const { tipo, nome, estoque_baixo } = filtros;

            // Se tiver tipo OU nome (ou ambos), usa a função que combina
            if (tipo || nome) {
                return await ProdutoModel.listarComFiltros({ tipo, nome });
            }

            // Estoque baixo
            if (estoque_baixo) {
                const limite = parseInt(estoque_baixo) || 50;
                return await ProdutoModel.estoqueBaixo(limite);
            }

            // Sem filtros: retorna todos
            return await ProdutoModel.listarTodos();
        } catch (error) {
            throw new Error('Erro ao listar produtos: ' + error.message);
        }
    }

    // Buscar por ID
    static async buscarPorId(id) {
        try {
            const produto = await ProdutoModel.buscarPorId(id);

            if (!produto) {
                throw new Error('Produto não encontrado');
            }

            return produto;
        } catch (error) {
            throw error;
        }
    }

    // Validar dados do produto
    static validarDadosProduto(dados) {
        const erros = [];

        if (!dados.nome || dados.nome.trim() === '') {
            erros.push('Nome é obrigatório');
        }

        if (!dados.unidade_medida || !['unidade', 'kg', 'fatia'].includes(dados.unidade_medida)) {
            erros.push('Unidade de medida inválida (unidade, kg ou fatia)');
        }

        if (dados.preco_base === undefined || dados.preco_base <= 0) {
            erros.push('Preço base deve ser maior que zero');
        }

        if (dados.estoque_atual === undefined || dados.estoque_atual < 0) {
            erros.push('Estoque atual não pode ser negativo');
        }

        if (!dados.id_tipo_produto) {
            erros.push('Tipo de produto é obrigatório');
        }

        return erros;
    }

    // Criar novo produto
    static async criar(dados) {
        try {
            // Validar dados
            const erros = this.validarDadosProduto(dados);
            if (erros.length > 0) {
                const error = new Error('Dados inválidos');
                error.errors = erros;
                throw error;
            }

            // Verificar se tipo de produto existe
            const tipoExiste = await TipoProdutoModel.existe(dados.id_tipo_produto);
            if (!tipoExiste) {
                throw new Error('Tipo de produto não encontrado');
            }

            // Criar produto
            const id = await ProdutoModel.criar({
                nome: dados.nome.trim(),
                unidade_medida: dados.unidade_medida,
                preco_base: parseFloat(dados.preco_base),
                estoque_atual: parseFloat(dados.estoque_atual),
                id_tipo_produto: dados.id_tipo_produto
            });

            return {
                id,
                nome: dados.nome.trim(),
                preco_base: parseFloat(dados.preco_base),
                estoque_atual: parseFloat(dados.estoque_atual)
            };
        } catch (error) {
            throw error;
        }
    }

    // Atualizar produto
    static async atualizar(id, dados) {
        try {
            // Verificar se produto existe
            const existe = await ProdutoModel.existe(id);
            if (!existe) {
                throw new Error('Produto não encontrado');
            }

            // Validar dados
            const erros = this.validarDadosProduto(dados);
            if (erros.length > 0) {
                const error = new Error('Dados inválidos');
                error.errors = erros;
                throw error;
            }

            // Verificar se tipo de produto existe
            const tipoExiste = await TipoProdutoModel.existe(dados.id_tipo_produto);
            if (!tipoExiste) {
                throw new Error('Tipo de produto não encontrado');
            }

            // Atualizar produto
            await ProdutoModel.atualizar(id, {
                nome: dados.nome.trim(),
                unidade_medida: dados.unidade_medida,
                preco_base: parseFloat(dados.preco_base),
                estoque_atual: parseFloat(dados.estoque_atual),
                id_tipo_produto: dados.id_tipo_produto
            });

            return true;
        } catch (error) {
            throw error;
        }
    }

    // Atualizar estoque
    static async atualizarEstoque(id, quantidade) {
        try {
            // Verificar se produto existe
            const existe = await ProdutoModel.existe(id);
            if (!existe) {
                throw new Error('Produto não encontrado');
            }

            // Validar quantidade
            if (quantidade === undefined || quantidade === null) {
                throw new Error('Quantidade é obrigatória');
            }

            const quantidadeNum = parseFloat(quantidade);

            // Verificar se operação resulta em estoque negativo
            const estoqueAtual = await ProdutoModel.obterEstoqueAtual(id);
            const novoEstoque = parseFloat(estoqueAtual) + quantidadeNum;

            if (novoEstoque < 0) {
                throw new Error(`Operação resultaria em estoque negativo (${novoEstoque}). Estoque atual: ${estoqueAtual}`);
            }

            // Atualizar estoque
            await ProdutoModel.atualizarEstoque(id, quantidadeNum);

            // Buscar produto atualizado
            const produtoAtualizado = await ProdutoModel.buscarPorId(id);

            return {
                id: produtoAtualizado.ID_Produto,
                nome: produtoAtualizado.Nome,
                estoque_anterior: parseFloat(estoqueAtual),
                quantidade_alterada: quantidadeNum,
                estoque_atual: parseFloat(produtoAtualizado.Estoque_Atual)
            };
        } catch (error) {
            throw error;
        }
    }

    // Deletar produto
    static async deletar(id) {
        try {
            // Verificar se produto existe
            const existe = await ProdutoModel.existe(id);
            if (!existe) {
                throw new Error('Produto não encontrado');
            }

            // Regra de negócio: verificar vendas vinculadas
            const totalVendas = await ProdutoModel.contarVendasVinculadas(id);

            if (totalVendas > 0) {
                throw new Error(`Não é possível deletar. Existem ${totalVendas} venda(s) vinculada(s) a este produto.`);
            }

            // Deletar produto
            await ProdutoModel.deletar(id);

            return true;
        } catch (error) {
            throw error;
        }
    }

    // Validar estoque disponível (para vendas)
    static async validarEstoqueDisponivel(id, quantidadeSolicitada) {
        try {
            const estoqueAtual = await ProdutoModel.obterEstoqueAtual(id);

            if (!estoqueAtual) {
                throw new Error('Produto não encontrado');
            }

            const disponivel = parseFloat(estoqueAtual) >= parseFloat(quantidadeSolicitada);

            return {
                disponivel,
                estoque_atual: parseFloat(estoqueAtual),
                quantidade_solicitada: parseFloat(quantidadeSolicitada),
                diferenca: parseFloat(estoqueAtual) - parseFloat(quantidadeSolicitada)
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProdutoService;