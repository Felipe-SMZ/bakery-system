// ════════════════════════════════════════════════════════════
// src/pages/NovaVenda.jsx
// ════════════════════════════════════════════════════════════

/**
 * 🛒 TELA DE NOVA VENDA
 * 
 * Esta é uma das telas mais importantes do sistema!
 * Permite registrar uma venda completa com múltiplos produtos.
 * 
 * 📚 CONCEITOS APRENDIDOS AQUI:
 * 
 * 1. ESTADO COMPLEXO (useState com objetos e arrays)
 *    - Gerenciar cliente, funcionário, forma de pagamento
 *    - Gerenciar lista de itens (carrinho de compras)
 * 
 * 2. MANIPULAÇÃO DE ARRAYS
 *    - Adicionar item ao carrinho
 *    - Remover item do carrinho
 *    - Calcular totais
 * 
 * 3. VALIDAÇÕES
 *    - Verificar estoque antes de adicionar
 *    - Validar crédito do cliente (se fiado)
 *    - Impedir venda sem itens
 * 
 * 4. INTEGRAÇÃO COM API
 *    - Buscar clientes, funcionários e produtos
 *    - Enviar venda completa com transação
 * 
 * 5. FEEDBACK AO USUÁRIO
 *    - Loading durante carregamento
 *    - Mensagens de erro
 *    - Mensagens de sucesso
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { criarVenda } from '../services/vendaService';
import { listarClientes } from '../services/clienteService';
import { listarFuncionarios } from '../services/funcionarioService';
import { listarProdutos } from '../services/produtoService';
import { formatarMoeda, formatarQuantidade } from '../utils/formatters';

const NovaVenda = () => {
    const navigate = useNavigate();

    // ============================================================
    // 📊 ESTADOS (State Management)
    // ============================================================

    /**
     * ESTADOS DE DADOS
     * Armazenam as informações que o usuário seleciona
     */
    const [clienteSelecionado, setClienteSelecionado] = useState('');
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState('');
    const [tipoPagamento, setTipoPagamento] = useState('dinheiro');
    const [itensCarrinho, setItensCarrinho] = useState([]);

    /**
     * ESTADOS PARA ADICIONAR ITEM
     * Controlam o formulário de adicionar produto
     */
    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [buscaProduto, setBuscaProduto] = useState('');
    const [mostrarListaProdutos, setMostrarListaProdutos] = useState(false);

    /**
     * ESTADOS DE LISTAS
     * Armazenam dados vindos da API
     */
    const [clientes, setClientes] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [produtos, setProdutos] = useState([]);

    /**
     * ESTADOS DE CONTROLE
     * Gerenciam loading, erros e mensagens
     */
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    // ============================================================
    // 🔄 CARREGAR DADOS INICIAIS (useEffect)
    // ============================================================

    /**
     * useEffect = Executa código quando o componente é montado
     * 
     * Aqui carregamos:
     * - Lista de clientes
     * - Lista de funcionários
     * - Lista de produtos
     * 
     * [] = Executa apenas UMA VEZ quando a página carrega
     */
    useEffect(() => {
        carregarDadosIniciais();
    }, []);

    /**
     * Função que busca todos os dados necessários da API
     */
    const carregarDadosIniciais = async () => {
        try {
            setLoading(true);
            setErro('');

            // Buscar dados em paralelo (Promise.all = mais rápido!)
            const [clientesData, funcionariosData, produtosData] = await Promise.all([
                listarClientes(),
                listarFuncionarios(),
                listarProdutos()
            ]);

            // Atualizar estados
            setClientes(clientesData);
            setFuncionarios(funcionariosData);
            setProdutos(produtosData);

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setErro('Erro ao carregar dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // 🛒 GERENCIAR CARRINHO DE COMPRAS
    // ============================================================

    /**
     * Adiciona um produto ao carrinho
     * 
     * VALIDAÇÕES:
     * 1. Produto selecionado existe
     * 2. Quantidade é válida (> 0)
     * 3. Tem estoque suficiente
     * 4. Produto não está duplicado no carrinho
     */
    const adicionarItem = () => {
        try {
            // ===== VALIDAÇÃO 1: Produto selecionado =====
            if (!produtoSelecionado) {
                setErro('Selecione um produto');
                return;
            }

            // ===== VALIDAÇÃO 2: Quantidade válida =====
            const qtd = parseFloat(quantidade);
            if (!qtd || qtd <= 0) {
                setErro('Informe uma quantidade válida');
                return;
            }

            // ===== BUSCAR DADOS DO PRODUTO =====
            const produto = produtos.find(p => p.ID_Produto === parseInt(produtoSelecionado));

            if (!produto) {
                setErro('Produto não encontrado');
                return;
            }

            // ===== VALIDAÇÃO 3: Estoque suficiente =====
            const estoqueDisponivel = parseFloat(produto.Estoque_Atual);
            if (qtd > estoqueDisponivel) {
                setErro(`Estoque insuficiente! Disponível: ${estoqueDisponivel} ${produto.Unidade_Medida}`);
                return;
            }

            // ===== VALIDAÇÃO 4: Produto já no carrinho? =====
            const jaExiste = itensCarrinho.find(item => item.id_produto === produto.ID_Produto);
            if (jaExiste) {
                setErro('Produto já está no carrinho. Remova para adicionar novamente.');
                return;
            }

            // ===== CRIAR OBJETO DO ITEM =====
            const novoItem = {
                id_produto: produto.ID_Produto,
                nome: produto.Nome,
                quantidade: qtd,
                preco_unitario: parseFloat(produto.Preco_Base),
                subtotal: qtd * parseFloat(produto.Preco_Base),
                unidade: produto.Unidade_Medida
            };

            // ===== VALIDAÇÃO 5: Verificar crédito se for fiado =====
            if (tipoPagamento === 'fiado' && clienteSelecionado) {
                const cliente = clientes.find(c => c.ID_Cliente === parseInt(clienteSelecionado));
                
                if (cliente) {
                    const limiteCredito = parseFloat(cliente.Limite_Fiado || 0);
                    const saldoDevedor = parseFloat(cliente.Total_Em_Aberto || 0);
                    const creditoDisponivel = limiteCredito - saldoDevedor;
                    const totalAtual = calcularTotal();
                    const novoTotal = totalAtual + novoItem.subtotal;

                    if (limiteCredito <= 0) {
                        setErro('⚠️ Cliente não possui limite de crédito! Altere a forma de pagamento.');
                        return;
                    }

                    if (novoTotal > creditoDisponivel) {
                        setErro(`⚠️ Adicionar este item excederá o crédito disponível! Disponível: ${formatarMoeda(creditoDisponivel)} | Total com item: ${formatarMoeda(novoTotal)}`);
                        return;
                    }
                }
            }

            // ===== ADICIONAR AO CARRINHO =====
            setItensCarrinho([...itensCarrinho, novoItem]);

            // ===== LIMPAR CAMPOS =====
            setProdutoSelecionado('');
            setQuantidade('');
            setErro('');

        } catch (error) {
            console.error('Erro ao adicionar item:', error);
            setErro('Erro ao adicionar item ao carrinho');
        }
    };

    /**
     * Remove um item do carrinho pelo índice
     */
    const removerItem = (index) => {
        const novosItens = itensCarrinho.filter((_, i) => i !== index);
        setItensCarrinho(novosItens);
    };

    /**
     * Calcula o total da venda
     * reduce() = soma todos os subtotais
     */
    const calcularTotal = () => {
        return itensCarrinho.reduce((total, item) => total + item.subtotal, 0);
    };

    // ============================================================
    // � FILTRAR PRODUTOS (para busca)
    // ============================================================

    /**
     * Filtra produtos com base na busca digitada
     * 
     * CRITÉRIOS DE BUSCA:
     * - ID do produto
     * - Nome do produto
     * - Tipo do produto
     * 
     * Busca é case-insensitive (não diferencia maiúsculas/minúsculas)
     */
    const produtosFiltrados = produtos.filter(produto => {
        if (!buscaProduto.trim()) return true;
        
        const termoBusca = buscaProduto.toLowerCase();
        const id = produto.ID_Produto.toString();
        const nome = produto.Nome.toLowerCase();
        const tipo = produto.Tipo?.toLowerCase() || '';
        
        return id.includes(termoBusca) || 
               nome.includes(termoBusca) || 
               tipo.includes(termoBusca);
    });

    /**
     * Seleciona um produto da lista filtrada
     */
    const selecionarProduto = (idProduto) => {
        setProdutoSelecionado(idProduto.toString());
        const produto = produtos.find(p => p.ID_Produto === idProduto);
        if (produto) {
            setBuscaProduto(`#${produto.ID_Produto} - ${produto.Nome}`);
        }
        setMostrarListaProdutos(false);
    };

    /**
     * Limpa a seleção de produto
     */
    const limparSelecaoProduto = () => {
        setProdutoSelecionado('');
        setBuscaProduto('');
        setQuantidade('');
    };

    // ============================================================
    // �💾 FINALIZAR VENDA
    // ============================================================

    /**
     * Envia a venda para a API
     * 
     * ETAPAS:
     * 1. Validar dados obrigatórios
     * 2. Montar objeto da venda
     * 3. Enviar para API
     * 4. Tratar sucesso/erro
     * 5. Redirecionar para lista de vendas
     */
    const finalizarVenda = async () => {
        try {
            setSalvando(true);
            setErro('');

            // ===== VALIDAÇÕES =====
            if (!clienteSelecionado) {
                setErro('Selecione um cliente');
                return;
            }

            if (!funcionarioSelecionado) {
                setErro('Selecione um funcionário');
                return;
            }

            if (itensCarrinho.length === 0) {
                setErro('Adicione pelo menos um produto');
                return;
            }

            // ===== VALIDAÇÃO DE CRÉDITO PARA VENDAS FIADAS =====
            if (tipoPagamento === 'fiado') {
                const cliente = clientes.find(c => c.ID_Cliente === parseInt(clienteSelecionado));
                
                if (!cliente) {
                    setErro('Cliente não encontrado');
                    return;
                }

                const limiteCredito = parseFloat(cliente.Limite_Fiado || 0);
                const saldoDevedor = parseFloat(cliente.Total_Em_Aberto || 0);
                const creditoDisponivel = limiteCredito - saldoDevedor;
                const totalVenda = calcularTotal();

                // Verificar se cliente tem limite de crédito
                if (limiteCredito <= 0) {
                    setErro('❌ Cliente não possui limite de crédito cadastrado! Não é possível vender fiado.');
                    return;
                }

                // Verificar se tem crédito disponível
                if (creditoDisponivel <= 0) {
                    setErro(`❌ Cliente não possui crédito disponível! Limite: ${formatarMoeda(limiteCredito)} | Devedor: ${formatarMoeda(saldoDevedor)}`);
                    return;
                }

                // Verificar se o valor da venda excede o crédito disponível
                if (totalVenda > creditoDisponivel) {
                    setErro(`❌ Valor da venda (${formatarMoeda(totalVenda)}) excede o crédito disponível (${formatarMoeda(creditoDisponivel)})! Ajuste os itens ou escolha outra forma de pagamento.`);
                    return;
                }
            }

            // ===== MONTAR OBJETO DA VENDA =====
            const dadosVenda = {
                id_cliente: parseInt(clienteSelecionado),
                id_funcionario: parseInt(funcionarioSelecionado),
                tipo_pagamento: tipoPagamento,
                itens: itensCarrinho.map(item => ({
                    id_produto: item.id_produto,
                    quantidade: item.quantidade
                    // Não enviamos preço! Backend busca do banco
                }))
            };

            // ===== ENVIAR PARA API =====
            await criarVenda(dadosVenda);

            // ===== SUCESSO! =====
            setSucesso('✅ Venda registrada com sucesso! Pronto para nova venda.');

            // ===== LIMPAR FORMULÁRIO =====
            setItensCarrinho([]);
            setClienteSelecionado('');
            setFuncionarioSelecionado('');
            setTipoPagamento('dinheiro');
            setProdutoSelecionado('');
            setQuantidade('');
            setBuscaProduto('');

            // Limpar mensagem de sucesso após 3 segundos
            setTimeout(() => {
                setSucesso('');
            }, 3000);

        } catch (error) {
            console.error('Erro ao finalizar venda:', error);
            
            // Tratar erros de validação do backend
            if (error.response?.data?.errors) {
                setErro(error.response.data.errors.join(', '));
            } else if (error.response?.data?.error) {
                setErro(error.response.data.error);
            } else {
                setErro(error.message || 'Erro ao finalizar venda');
            }
        } finally {
            setSalvando(false);
        }
    };

    // ============================================================
    // 🎨 RENDERIZAÇÃO
    // ============================================================

    // Loading inicial
    if (loading) {
        return <Loading mensagem="Carregando dados..." />;
    }

    return (
        <div className="space-y-6">
            {/* ===== CABEÇALHO ===== */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Nova Venda</h1>
                    <p className="text-gray-600 mt-1">Registre uma nova venda no sistema</p>
                </div>
                <Button 
                    variant="secondary" 
                    onClick={() => navigate('/vendas')}
                >
                    Voltar
                </Button>
            </div>

            {/* ===== MENSAGENS ===== */}
            {erro && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {erro}
                </div>
            )}

            {sucesso && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {sucesso}
                </div>
            )}

            {/* ===== FORMULÁRIO DE VENDA ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* COLUNA ESQUERDA: Dados da Venda */}
                <Card titulo="Dados da Venda">
                    <div className="space-y-4">
                        {/* Cliente */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cliente <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={clienteSelecionado}
                                onChange={(e) => {
                                    const idCliente = e.target.value;
                                    setClienteSelecionado(idCliente);
                                    

                                }}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecione um cliente</option>
                                {clientes.map(cliente => (
                                    <option key={cliente.ID_Cliente} value={cliente.ID_Cliente}>
                                        {cliente.Nome} - {cliente.Telefone}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Funcionário */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Funcionário <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={funcionarioSelecionado}
                                onChange={(e) => setFuncionarioSelecionado(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecione um funcionário</option>
                                {funcionarios.map(funcionario => (
                                    <option key={funcionario.ID_Funcionario} value={funcionario.ID_Funcionario}>
                                        {funcionario.Nome} - {funcionario.Nome_Cargo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Forma de Pagamento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Forma de Pagamento <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={tipoPagamento}
                                onChange={(e) => {
                                    const novoValor = e.target.value;
                                    
                                    // Validar se pode selecionar fiado
                                    if (novoValor === 'fiado' && clienteSelecionado) {
                                        const cliente = clientes.find(c => c.ID_Cliente === parseInt(clienteSelecionado));
                                        if (cliente) {
                                            const limiteCredito = parseFloat(cliente.Limite_Fiado || 0);
                                            const saldoDevedor = parseFloat(cliente.Total_Em_Aberto || 0);
                                            const creditoDisponivel = limiteCredito - saldoDevedor;
                                            
                                            if (limiteCredito <= 0) {
                                                setErro('❌ Este cliente não possui limite de crédito cadastrado!');
                                                return;
                                            }
                                            
                                            if (creditoDisponivel <= 0) {
                                                setErro('❌ Este cliente não possui crédito disponível!');
                                                return;
                                            }
                                        }
                                    }
                                    
                                    setTipoPagamento(novoValor);
                                    setErro(''); // Limpa erro ao mudar forma de pagamento
                                }}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="dinheiro">💵 Dinheiro</option>
                                <option value="cartao">💳 Cartão</option>
                                <option value="pix">📱 PIX</option>
                                <option value="fiado">📋 Fiado</option>
                            </select>
                            
                            {/* Aviso se cliente não selecionado e tentar fiado */}
                            {!clienteSelecionado && (
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 Selecione um cliente para ver o crédito disponível
                                </p>
                            )}

                            {/* Mostrar limite de crédito quando Fiado for selecionado */}
                            {tipoPagamento === 'fiado' && clienteSelecionado && (() => {
                                const cliente = clientes.find(c => c.ID_Cliente === parseInt(clienteSelecionado));
                                if (!cliente) return null;

                                const limiteCredito = parseFloat(cliente.Limite_Fiado || 0);
                                const saldoDevedor = parseFloat(cliente.Total_Em_Aberto || 0);
                                const creditoDisponivel = limiteCredito - saldoDevedor;
                                const totalVenda = calcularTotal();
                                const creditoAposVenda = creditoDisponivel - totalVenda;

                                return (
                                    <div className="mt-3 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                                        <p className="text-sm font-bold text-yellow-800 mb-2 flex items-center gap-2">
                                            <span className="text-lg">💳</span>
                                            Informações de Crédito
                                        </p>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-700">Limite Total:</span>
                                                <span className="font-semibold text-gray-800">{formatarMoeda(limiteCredito)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-700">Saldo Devedor:</span>
                                                <span className="font-semibold text-red-600">-{formatarMoeda(saldoDevedor)}</span>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t border-yellow-300">
                                                <span className="text-gray-700 font-semibold">Crédito Disponível:</span>
                                                <span className={`font-bold ${creditoDisponivel > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatarMoeda(creditoDisponivel)}
                                                </span>
                                            </div>
                                            {totalVenda > 0 && (
                                                <>
                                                    <div className="flex justify-between text-xs pt-2">
                                                        <span className="text-gray-600">Valor desta venda:</span>
                                                        <span className="font-semibold text-blue-600">{formatarMoeda(totalVenda)}</span>
                                                    </div>
                                                    <div className="flex justify-between pt-1 border-t border-yellow-300">
                                                        <span className="text-gray-700 font-semibold">Crédito após venda:</span>
                                                        <span className={`font-bold ${creditoAposVenda >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {formatarMoeda(creditoAposVenda)}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {creditoDisponivel <= 0 && (
                                            <p className="mt-2 text-xs text-red-700 font-semibold">
                                                ⚠️ Cliente sem crédito disponível!
                                            </p>
                                        )}
                                        {totalVenda > creditoDisponivel && creditoDisponivel > 0 && (
                                            <p className="mt-2 text-xs text-red-700 font-semibold">
                                                ⚠️ Valor da venda excede o crédito disponível!
                                            </p>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Adicionar Produto */}
                        <div className="pt-4 border-t-2 border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="text-2xl">🛍️</span>
                                Adicionar Produto
                            </h3>
                            
                            <div className="space-y-4">
                                {/* Produto Selecionado - Card de Preview */}
                                {produtoSelecionado && produtos.find(p => p.ID_Produto === parseInt(produtoSelecionado)) && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        {(() => {
                                            const produto = produtos.find(p => p.ID_Produto === parseInt(produtoSelecionado));
                                            return (
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-xs text-blue-600 font-semibold">PRODUTO SELECIONADO</p>
                                                        <p className="font-bold text-gray-800">{produto.Nome}</p>
                                                        <p className="text-sm text-gray-600">
                                                            Código: #{produto.ID_Produto} | Preço: {formatarMoeda(produto.Preco_Base)} | 
                                                            Estoque: {formatarQuantidade(produto.Estoque_Atual, produto.Unidade_Medida)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        🔍 Buscar Produto
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={buscaProduto}
                                            onChange={(e) => {
                                                setBuscaProduto(e.target.value);
                                                setMostrarListaProdutos(true);
                                                if (!e.target.value.trim()) {
                                                    setProdutoSelecionado('');
                                                }
                                            }}
                                            onFocus={() => setMostrarListaProdutos(true)}
                                            placeholder="Digite o código, nome ou tipo do produto..."
                                            className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium transition-all"
                                        />
                                        {produtoSelecionado && (
                                            <button
                                                onClick={limparSelecaoProduto}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                                type="button"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                    
                                    {/* Lista de produtos filtrados */}
                                    {mostrarListaProdutos && buscaProduto.trim() && !produtoSelecionado && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                                            {produtosFiltrados.length > 0 ? (
                                                <div className="py-1">
                                                    {produtosFiltrados.map(produto => (
                                                        <button
                                                            key={produto.ID_Produto}
                                                            onClick={() => selecionarProduto(produto.ID_Produto)}
                                                            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                                                            type="button"
                                                        >
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded flex-shrink-0">
                                                                            #{produto.ID_Produto}
                                                                        </span>
                                                                        <span className="font-semibold text-gray-800 break-words">
                                                                            {produto.Nome}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 flex-wrap">
                                                                        <span className="font-medium text-green-600 flex-shrink-0">
                                                                            {formatarMoeda(produto.Preco_Base)}
                                                                        </span>
                                                                        <span className={`flex-shrink-0 ${produto.Estoque_Atual > 0 ? 'text-gray-600' : 'text-red-600 font-semibold'}`}>
                                                                            Est: {formatarQuantidade(produto.Estoque_Atual, produto.Unidade_Medida)}
                                                                        </span>
                                                                        {produto.Tipo && (
                                                                            <span className="text-gray-500 flex-shrink-0">
                                                                                {produto.Tipo}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="text-blue-500 text-xl flex-shrink-0 mt-1">
                                                                    →
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="px-4 py-8 text-center text-gray-500">
                                                    <p className="text-4xl mb-2">🔍</p>
                                                    <p className="font-semibold">Nenhum produto encontrado</p>
                                                    <p className="text-sm mt-1">Tente buscar por outro termo</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    <p className="text-xs text-gray-500 mt-1">
                                        💡 Dica: Digite para buscar por código, nome ou tipo do produto
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        🔢 Quantidade
                                        {produtoSelecionado && produtos.find(p => p.ID_Produto === parseInt(produtoSelecionado)) && (
                                            <span className="text-gray-500 font-normal ml-2">
                                                (Disponível: {formatarQuantidade(produtos.find(p => p.ID_Produto === parseInt(produtoSelecionado)).Estoque_Atual, produtos.find(p => p.ID_Produto === parseInt(produtoSelecionado)).Unidade_Medida)})
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        type="number"
                                        value={quantidade}
                                        onChange={(e) => setQuantidade(e.target.value)}
                                        placeholder="Digite a quantidade"
                                        min="0"
                                        step="0.1"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold transition-all"
                                        disabled={!produtoSelecionado}
                                    />
                                    {!produtoSelecionado && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            ℹ️ Selecione um produto primeiro
                                        </p>
                                    )}
                                </div>

                                <Button 
                                    variant="success" 
                                    size="lg"
                                    onClick={adicionarItem}
                                    className="w-full text-lg font-bold"
                                    disabled={!produtoSelecionado || !quantidade}
                                >
                                    ➕ Adicionar ao Carrinho
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* COLUNA DIREITA: Carrinho */}
                <Card titulo="Carrinho de Compras">
                    {itensCarrinho.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <p className="text-4xl mb-2">🛒</p>
                            <p>Nenhum item adicionado</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Lista de Itens */}
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {itensCarrinho.map((item, index) => (
                                    <div 
                                        key={index}
                                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">{item.nome}</p>
                                            <p className="text-sm text-gray-600">
                                                {formatarQuantidade(item.quantidade, item.unidade)} × {formatarMoeda(item.preco_unitario)}
                                            </p>
                                        </div>
                                        <div className="text-right mr-4">
                                            <p className="font-bold text-gray-800">
                                                {formatarMoeda(item.subtotal)}
                                            </p>
                                        </div>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => removerItem(index)}
                                        >
                                            🗑️
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="pt-4 border-t-2 border-gray-300">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xl font-bold text-gray-700">TOTAL:</span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        {formatarMoeda(calcularTotal())}
                                    </span>
                                </div>

                                <Button
                                    variant="success"
                                    size="lg"
                                    onClick={finalizarVenda}
                                    disabled={salvando || itensCarrinho.length === 0}
                                    className="w-full"
                                >
                                    {salvando ? '⏳ Finalizando...' : '✅ Finalizar Venda'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default NovaVenda;