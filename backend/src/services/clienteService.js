// src/services/clienteService.js
const ClienteModel = require('../models/clienteModel');

class ClienteService {

    // Listar clientes (com filtros opcionais)
    static async listarClientes(filtros = {}) {
        try {
            const { status, busca } = filtros;

            if (status) {
                return await ClienteModel.filtrarPorStatus(status);
            }

            if (busca) {
                return await ClienteModel.buscar(busca);
            }

            return await ClienteModel.listarTodos();
        } catch (error) {
            throw new Error('Erro ao listar clientes: ' + error.message);
        }
    }

    // Buscar por ID
    static async buscarPorId(id) {
        try {
            const cliente = await ClienteModel.buscarPorId(id);

            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }

            return cliente;
        } catch (error) {
            throw error;
        }
    }

    // Buscar detalhes completos (com crédito)
    static async buscarDetalhes(id) {
        try {
            const cliente = await ClienteModel.buscarPorId(id);

            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }

            // Obter crédito disponível
            const credito = await ClienteModel.obterCreditoDisponivel(id);

            return {
                ...cliente,
                Total_Em_Aberto: credito ? parseFloat(credito.Total_Em_Aberto) : 0,
                Credito_Disponivel: credito ? parseFloat(credito.Credito_Disponivel) : parseFloat(cliente.Limite_Fiado)
            };
        } catch (error) {
            throw error;
        }
    }

    // Validar dados do cliente
    static validarDadosCliente(dados) {
        const erros = [];

        // Nome obrigatório
        if (!dados.nome || dados.nome.trim() === '') {
            erros.push('Nome é obrigatório');
        }

        // Status válido
        if (!dados.status || !['bom', 'medio', 'ruim'].includes(dados.status)) {
            erros.push('Status inválido (bom, medio ou ruim)');
        }

        // Limite de fiado não negativo
        if (dados.limite_fiado === undefined || dados.limite_fiado < 0) {
            erros.push('Limite de fiado não pode ser negativo');
        }

        // Validar telefone (básico)
        if (dados.telefone && dados.telefone.trim() !== '') {
            const telefone = dados.telefone.replace(/\D/g, '');
            if (telefone.length < 10 || telefone.length > 11) {
                erros.push('Telefone inválido (deve ter 10 ou 11 dígitos)');
            }
        }

        // Validar CEP (se fornecido)
        if (dados.cep && dados.cep.trim() !== '') {
            const cep = dados.cep.replace(/\D/g, '');
            if (cep.length !== 8) {
                erros.push('CEP inválido (deve ter 8 dígitos)');
            }
        }

        return erros;
    }

    // Normalizar telefone
    static normalizarTelefone(telefone) {
        if (!telefone) return null;

        // Remove tudo que não é número
        const numeros = telefone.replace(/\D/g, '');

        // Formata (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
        if (numeros.length === 11) {
            return `(${numeros.substr(0, 2)}) ${numeros.substr(2, 5)}-${numeros.substr(7)}`;
        } else if (numeros.length === 10) {
            return `(${numeros.substr(0, 2)}) ${numeros.substr(2, 4)}-${numeros.substr(6)}`;
        }

        return telefone;
    }

    // Normalizar CEP
    static normalizarCEP(cep) {
        if (!cep) return null;

        const numeros = cep.replace(/\D/g, '');

        if (numeros.length === 8) {
            return `${numeros.substr(0, 5)}-${numeros.substr(5)}`;
        }

        return cep;
    }

    // Criar novo cliente
    static async criar(dados) {
        try {
            // Validar dados
            const erros = this.validarDadosCliente(dados);
            if (erros.length > 0) {
                const error = new Error('Dados inválidos');
                error.errors = erros;
                throw error;
            }

            // Normalizar dados
            const dadosNormalizados = {
                nome: dados.nome.trim(),
                telefone: this.normalizarTelefone(dados.telefone),
                status: dados.status,
                limite_fiado: parseFloat(dados.limite_fiado),
                rua: dados.rua ? dados.rua.trim() : null,
                numero: dados.numero ? dados.numero.trim() : null,
                bairro: dados.bairro ? dados.bairro.trim() : null,
                cidade: dados.cidade ? dados.cidade.trim() : null,
                cep: this.normalizarCEP(dados.cep)
            };

            // Criar cliente
            const id = await ClienteModel.criar(dadosNormalizados);

            return {
                id,
                ...dadosNormalizados
            };
        } catch (error) {
            throw error;
        }
    }

    // Atualizar cliente
    static async atualizar(id, dados) {
        try {
            // Verificar se existe
            const existe = await ClienteModel.existe(id);
            if (!existe) {
                throw new Error('Cliente não encontrado');
            }

            // Validar dados
            const erros = this.validarDadosCliente(dados);
            if (erros.length > 0) {
                const error = new Error('Dados inválidos');
                error.errors = erros;
                throw error;
            }

            // Normalizar dados
            const dadosNormalizados = {
                nome: dados.nome.trim(),
                telefone: this.normalizarTelefone(dados.telefone),
                status: dados.status,
                limite_fiado: parseFloat(dados.limite_fiado),
                rua: dados.rua ? dados.rua.trim() : null,
                numero: dados.numero ? dados.numero.trim() : null,
                bairro: dados.bairro ? dados.bairro.trim() : null,
                cidade: dados.cidade ? dados.cidade.trim() : null,
                cep: this.normalizarCEP(dados.cep)
            };

            // Atualizar cliente
            await ClienteModel.atualizar(id, dadosNormalizados);

            return true;
        } catch (error) {
            throw error;
        }
    }

    // Deletar cliente
    static async deletar(id) {
        try {
            // Verificar se existe
            const existe = await ClienteModel.existe(id);
            if (!existe) {
                throw new Error('Cliente não encontrado');
            }

            // Regra de negócio: verificar vendas vinculadas
            const totalVendas = await ClienteModel.contarVendasVinculadas(id);

            if (totalVendas > 0) {
                throw new Error(`Não é possível deletar. Existem ${totalVendas} venda(s) vinculada(s) a este cliente.`);
            }

            // Deletar cliente
            await ClienteModel.deletar(id);

            return true;
        } catch (error) {
            throw error;
        }
    }

    // Buscar histórico de compras
    static async buscarHistorico(id, filtros = {}) {
        try {
            // Verificar se existe
            const existe = await ClienteModel.existe(id);
            if (!existe) {
                throw new Error('Cliente não encontrado');
            }

            const vendas = await ClienteModel.buscarVendas(id);

            // Aplicar filtros se necessário (futuro: por data, status, etc)

            return vendas;
        } catch (error) {
            throw error;
        }
    }

    // Obter situação de crédito
    static async obterSituacaoCredito(id) {
        try {
            // Verificar se existe
            const existe = await ClienteModel.existe(id);
            if (!existe) {
                throw new Error('Cliente não encontrado');
            }

            const cliente = await ClienteModel.buscarPorId(id);
            const credito = await ClienteModel.obterCreditoDisponivel(id);

            return {
                cliente: {
                    id: cliente.ID_Cliente,
                    nome: cliente.Nome,
                    status: cliente.Status
                },
                limite_fiado: parseFloat(cliente.Limite_Fiado),
                total_em_aberto: credito ? parseFloat(credito.Total_Em_Aberto) : 0,
                credito_disponivel: credito ? parseFloat(credito.Credito_Disponivel) : parseFloat(cliente.Limite_Fiado),
                percentual_utilizado: credito ?
                    ((parseFloat(credito.Total_Em_Aberto) / parseFloat(cliente.Limite_Fiado)) * 100).toFixed(2) : 0,
                situacao: credito && parseFloat(credito.Credito_Disponivel) < 0 ? 'EXCEDIDO' :
                    credito && parseFloat(credito.Credito_Disponivel) < parseFloat(cliente.Limite_Fiado) * 0.2 ? 'ATENCAO' :
                        'OK'
            };
        } catch (error) {
            throw error;
        }
    }

    // Validar se pode realizar venda a fiado
    static async validarVendaFiado(id, valorVenda) {
        try {
            const situacao = await this.obterSituacaoCredito(id);

            const podeVender = situacao.credito_disponivel >= valorVenda;

            return {
                pode_vender: podeVender,
                credito_disponivel: situacao.credito_disponivel,
                valor_venda: parseFloat(valorVenda),
                credito_apos_venda: situacao.credito_disponivel - parseFloat(valorVenda),
                mensagem: podeVender ?
                    'Venda autorizada' :
                    `Crédito insuficiente. Disponível: R$ ${situacao.credito_disponivel.toFixed(2)}`
            };
        } catch (error) {
            throw error;
        }
    }

    // Listar clientes devedores
    static async listarDevedores() {
        try {
            return await ClienteModel.listarDevedores();
        } catch (error) {
            throw new Error('Erro ao listar devedores: ' + error.message);
        }
    }

    // Listar clientes com crédito excedido
    static async listarCreditoExcedido() {
        try {
            return await ClienteModel.listarCreditoExcedido();
        } catch (error) {
            throw new Error('Erro ao listar crédito excedido: ' + error.message);
        }
    }
}

module.exports = ClienteService;