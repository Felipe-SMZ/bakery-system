// src/controllers/produtoController.js
const ProdutoModel = require('../models/produtoModel');

class ProdutoController {

    // GET /api/produtos
    static async listarTodos(req, res) {
        try {
            const { tipo, nome, estoque_baixo } = req.query;

            let produtos;

            if (tipo) {
                produtos = await ProdutoModel.filtrarPorTipo(tipo);
            } else if (nome) {
                produtos = await ProdutoModel.buscarPorNome(nome);
            } else if (estoque_baixo) {
                produtos = await ProdutoModel.estoqueBaixo(estoque_baixo);
            } else {
                produtos = await ProdutoModel.listarTodos();
            }

            res.json({
                success: true,
                total: produtos.length,
                data: produtos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // GET /api/produtos/:id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const produto = await ProdutoModel.buscarPorId(id);

            if (!produto) {
                return res.status(404).json({
                    success: false,
                    error: 'Produto não encontrado'
                });
            }

            res.json({
                success: true,
                data: produto
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // POST /api/produtos
    static async criar(req, res) {
        try {
            const { nome, unidade_medida, preco_base, estoque_atual, id_tipo_produto } = req.body;

            // Validações
            const erros = [];

            if (!nome || nome.trim() === '') {
                erros.push('Nome é obrigatório');
            }

            if (!unidade_medida || !['unidade', 'kg', 'fatia'].includes(unidade_medida)) {
                erros.push('Unidade de medida inválida (unidade, kg ou fatia)');
            }

            if (preco_base === undefined || preco_base <= 0) {
                erros.push('Preço base deve ser maior que zero');
            }

            if (estoque_atual === undefined || estoque_atual < 0) {
                erros.push('Estoque atual não pode ser negativo');
            }

            if (!id_tipo_produto) {
                erros.push('Tipo de produto é obrigatório');
            }

            if (erros.length > 0) {
                return res.status(400).json({
                    success: false,
                    errors: erros
                });
            }

            const id = await ProdutoModel.criar({
                nome: nome.trim(),
                unidade_medida,
                preco_base: parseFloat(preco_base),
                estoque_atual: parseFloat(estoque_atual),
                id_tipo_produto
            });

            res.status(201).json({
                success: true,
                message: 'Produto criado com sucesso',
                data: { id, nome, preco_base, estoque_atual }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // PUT /api/produtos/:id
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, unidade_medida, preco_base, estoque_atual, id_tipo_produto } = req.body;

            // Verificar se existe
            const existe = await ProdutoModel.existe(id);
            if (!existe) {
                return res.status(404).json({
                    success: false,
                    error: 'Produto não encontrado'
                });
            }

            // Validações
            const erros = [];

            if (!nome || nome.trim() === '') {
                erros.push('Nome é obrigatório');
            }

            if (!unidade_medida || !['unidade', 'kg', 'fatia'].includes(unidade_medida)) {
                erros.push('Unidade de medida inválida');
            }

            if (preco_base === undefined || preco_base <= 0) {
                erros.push('Preço base deve ser maior que zero');
            }

            if (estoque_atual === undefined || estoque_atual < 0) {
                erros.push('Estoque atual não pode ser negativo');
            }

            if (!id_tipo_produto) {
                erros.push('Tipo de produto é obrigatório');
            }

            if (erros.length > 0) {
                return res.status(400).json({
                    success: false,
                    errors: erros
                });
            }

            await ProdutoModel.atualizar(id, {
                nome: nome.trim(),
                unidade_medida,
                preco_base: parseFloat(preco_base),
                estoque_atual: parseFloat(estoque_atual),
                id_tipo_produto
            });

            res.json({
                success: true,
                message: 'Produto atualizado com sucesso'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // PATCH /api/produtos/:id/estoque
    static async atualizarEstoque(req, res) {
        try {
            const { id } = req.params;
            const { quantidade } = req.body;

            // Verificar se existe
            const existe = await ProdutoModel.existe(id);
            if (!existe) {
                return res.status(404).json({
                    success: false,
                    error: 'Produto não encontrado'
                });
            }

            if (quantidade === undefined) {
                return res.status(400).json({
                    success: false,
                    error: 'Quantidade é obrigatória'
                });
            }

            await ProdutoModel.atualizarEstoque(id, parseFloat(quantidade));

            const produto = await ProdutoModel.buscarPorId(id);

            res.json({
                success: true,
                message: 'Estoque atualizado com sucesso',
                data: {
                    id: produto.ID_Produto,
                    nome: produto.Nome,
                    estoque_atual: produto.Estoque_Atual
                }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // DELETE /api/produtos/:id
    static async deletar(req, res) {
        try {
            const { id } = req.params;

            // Verificar se existe
            const existe = await ProdutoModel.existe(id);
            if (!existe) {
                return res.status(404).json({
                    success: false,
                    error: 'Produto não encontrado'
                });
            }

            await ProdutoModel.deletar(id);

            res.json({
                success: true,
                message: 'Produto deletado com sucesso'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = ProdutoController;