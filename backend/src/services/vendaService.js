// src/services/vendaService.js
const VendaModel = require('../models/vendaModel');
const ClienteService = require('./clienteService');
const ProdutoService = require('./produtoService');
const FuncionarioModel = require('../models/funcionarioModel');
const ProdutoModel = require('../models/produtoModel');

class VendaService {

    // ============================================================
    // CRIAR VENDA - FUNÇÃO PRINCIPAL
    // ============================================================

    /**
     * Cria uma venda completa com todas as validações
     * 
     * FLUXO:
     * 1. Validar dados básicos (cliente, funcionário, itens)
     * 2. Validar estoque de TODOS os produtos
     * 3. Buscar preço atual de cada produto
     * 4. Calcular total da venda
     * 5. Se fiado: validar crédito disponível
     * 6. Criar venda no banco (com transação)
     * 
     * @param {Object} dados - {id_cliente, id_funcionario, tipo_pagamento, itens}
     * @returns {Object} Venda criada com detalhes
     */
    static async criar(dados) {
        try {
            // ===== ETAPA 1: VALIDAR DADOS BÁSICOS =====
            const errosValidacao = this.validarDadosVenda(dados);
            if (errosValidacao.length > 0) {
                const error = new Error('Dados inválidos');
                error.errors = errosValidacao;
                throw error;
            }

            // ===== ETAPA 2: VERIFICAR SE CLIENTE EXISTE =====
            const clienteExiste = await ClienteService.buscarPorId(dados.id_cliente);
            if (!clienteExiste) {
                throw new Error('Cliente não encontrado');
            }

            // ===== ETAPA 3: VERIFICAR SE FUNCIONÁRIO EXISTE =====
            const funcionarioExiste = await FuncionarioModel.existe(dados.id_funcionario);
            if (!funcionarioExiste) {
                throw new Error('Funcionário não encontrado');
            }

            // ===== ETAPA 4: VALIDAR E PROCESSAR ITENS =====
            const itensProcessados = await this.processarItens(dados.itens);

            // ===== ETAPA 5: CALCULAR TOTAL DA VENDA =====
            const valorTotal = this.calcularTotal(itensProcessados);

            // ===== ETAPA 6: SE FIADO, VALIDAR CRÉDITO =====
            if (dados.tipo_pagamento === 'fiado') {
                await this.validarCreditoDisponivel(dados.id_cliente, valorTotal);
            }

            // ===== ETAPA 7: CRIAR VENDA NO BANCO (COM TRANSAÇÃO) =====
            const dadosVenda = {
                id_cliente: dados.id_cliente,
                id_funcionario: dados.id_funcionario,
                tipo_pagamento: dados.tipo_pagamento,
                valor_total: valorTotal
            };

            const vendaId = await VendaModel.criarVendaCompleta(dadosVenda, itensProcessados);

            // ===== ETAPA 8: BUSCAR VENDA CRIADA COM DETALHES =====
            const vendaCriada = await this.buscarPorId(vendaId);

            return vendaCriada;

        } catch (error) {
            throw error;
        }
    }

    // ============================================================
    // VALIDAÇÕES
    // ============================================================

    /**
     * Valida os dados básicos da venda
     */
    static validarDadosVenda(dados) {
        const erros = [];

        // Cliente obrigatório
        if (!dados.id_cliente) {
            erros.push('Cliente é obrigatório');
        }

        // Funcionário obrigatório
        if (!dados.id_funcionario) {
            erros.push('Funcionário é obrigatório');
        }

        // Tipo de pagamento válido
        if (!dados.tipo_pagamento ||
            !['dinheiro', 'cartao', 'pix', 'fiado'].includes(dados.tipo_pagamento)) {
            erros.push('Tipo de pagamento inválido (dinheiro, cartao, pix ou fiado)');
        }

        // Deve ter pelo menos 1 item
        if (!dados.itens || !Array.isArray(dados.itens) || dados.itens.length === 0) {
            erros.push('A venda deve ter pelo menos 1 produto');
        }

        // Validar cada item
        if (dados.itens && Array.isArray(dados.itens)) {
            dados.itens.forEach((item, index) => {
                if (!item.id_produto) {
                    erros.push(`Item ${index + 1}: ID do produto é obrigatório`);
                }
                if (!item.quantidade || item.quantidade <= 0) {
                    erros.push(`Item ${index + 1}: Quantidade deve ser maior que zero`);
                }
            });
        }

        return erros;
    }

    /**
     * Processa os itens: valida estoque e busca preço atual
     * 
     * IMPORTANTE: Esta função faz 2 coisas para CADA produto:
     * 1. Valida se tem estoque suficiente
     * 2. Busca o preço ATUAL do produto (não confia no frontend!)
     */
    static async processarItens(itens) {
        const itensProcessados = [];

        for (const item of itens) {
            // ===== 1. BUSCAR DADOS DO PRODUTO =====
            const produto = await ProdutoModel.buscarPorId(item.id_produto);

            if (!produto) {
                throw new Error(`Produto ${item.id_produto} não encontrado`);
            }

            // ===== 2. VALIDAR ESTOQUE =====
            const estoqueDisponivel = parseFloat(produto.Estoque_Atual);
            const quantidadeSolicitada = parseFloat(item.quantidade);

            if (estoqueDisponivel < quantidadeSolicitada) {
                throw new Error(
                    `Estoque insuficiente para ${produto.Nome}. ` +
                    `Disponível: ${estoqueDisponivel} ${produto.Unidade_Medida}`
                );
            }

            // ===== 3. CAPTURAR PREÇO ATUAL =====
            // ATENÇÃO: Sempre usar o preço do banco, NUNCA confiar no frontend!
            const precoAtual = parseFloat(produto.Preco_Base);

            // ===== 4. ADICIONAR À LISTA DE ITENS PROCESSADOS =====
            itensProcessados.push({
                id_produto: item.id_produto,
                quantidade: quantidadeSolicitada,
                preco_unitario: precoAtual,
                subtotal: quantidadeSolicitada * precoAtual
            });
        }

        return itensProcessados;
    }

    /**
     * Calcula o valor total da venda
     */
    static calcularTotal(itens) {
        return itens.reduce((total, item) => total + item.subtotal, 0);
    }

    /**
     * Valida se cliente tem crédito disponível para venda a fiado
     * 
     * REGRA DE NEGÓCIO CRÍTICA:
     * - Busca o crédito disponível do cliente
     * - Se valor da venda > crédito disponível → BLOQUEIA
     */
    static async validarCreditoDisponivel(clienteId, valorVenda) {
        try {
            // Usar o service de cliente que já tem a lógica de crédito
            const validacao = await ClienteService.validarVendaFiado(clienteId, valorVenda);

            if (!validacao.pode_vender) {
                throw new Error(validacao.mensagem);
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    // ============================================================
    // CONSULTAS
    // ============================================================

    /**
     * Lista vendas com filtros opcionais
     */
    static async listarVendas(filtros = {}) {
        try {
            const { periodo_inicio, periodo_fim, cliente, funcionario, tipo_pagamento } = filtros;

            // Aplicar filtros conforme parâmetros
            if (periodo_inicio && periodo_fim) {
                return await VendaModel.filtrarPorPeriodo(periodo_inicio, periodo_fim);
            }

            if (cliente) {
                return await VendaModel.filtrarPorCliente(cliente);
            }

            if (funcionario) {
                return await VendaModel.filtrarPorFuncionario(funcionario);
            }

            if (tipo_pagamento) {
                return await VendaModel.filtrarPorFormaPagamento(tipo_pagamento);
            }

            // Sem filtros: retorna todas
            return await VendaModel.listarTodas();
        } catch (error) {
            throw new Error('Erro ao listar vendas: ' + error.message);
        }
    }

    /**
     * Busca uma venda específica com seus itens
     */
    static async buscarPorId(id) {
        try {
            // Buscar dados da venda
            const venda = await VendaModel.buscarPorId(id);

            if (!venda) {
                throw new Error('Venda não encontrada');
            }

            // Buscar itens da venda
            const itens = await VendaModel.buscarItens(id);

            // Retornar venda completa
            return {
                ...venda,
                itens: itens
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Lista vendas a fiado em aberto
     */
    static async listarFiadoEmAberto() {
        try {
            return await VendaModel.listarFiadoEmAberto();
        } catch (error) {
            throw new Error('Erro ao listar fiado em aberto: ' + error.message);
        }
    }

    /**
     * Quitar venda a fiado
     */
    static async quitarFiado(vendaId) {
        try {
            // Verificar se venda existe
            const venda = await VendaModel.buscarPorId(vendaId);

            if (!venda) {
                throw new Error('Venda não encontrada');
            }

            // Verificar se é fiado
            if (venda.Tipo_Pagamento !== 'fiado') {
                throw new Error('Esta venda não é a fiado');
            }

            // Verificar se já foi quitada
            if (venda.Data_Pagamento_Fiado) {
                throw new Error('Esta venda já foi quitada');
            }

            // Quitar
            const affectedRows = await VendaModel.quitarFiado(vendaId);

            if (affectedRows === 0) {
                throw new Error('Não foi possível quitar a venda');
            }

            // Buscar venda atualizada
            return await this.buscarPorId(vendaId);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = VendaService;