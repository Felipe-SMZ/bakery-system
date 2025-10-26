// src/services/funcionarioService.js
const FuncionarioModel = require('../models/funcionarioModel');
const CargoModel = require('../models/cargoModel');

class FuncionarioService {

    // Listar funcionários (com filtros opcionais)
    static async listarFuncionarios(filtros = {}) {
        try {
            const { cargo, nome } = filtros;

            if (cargo) {
                return await FuncionarioModel.filtrarPorCargo(cargo);
            }

            if (nome) {
                return await FuncionarioModel.buscarPorNome(nome);
            }

            return await FuncionarioModel.listarTodos();
        } catch (error) {
            throw new Error('Erro ao listar funcionários: ' + error.message);
        }
    }

    // Buscar por ID
    static async buscarPorId(id) {
        try {
            const funcionario = await FuncionarioModel.buscarPorId(id);

            if (!funcionario) {
                throw new Error('Funcionário não encontrado');
            }

            return funcionario;
        } catch (error) {
            throw error;
        }
    }

    // Validar dados do funcionário
    static validarDadosFuncionario(dados) {
        const erros = [];

        // Nome obrigatório
        if (!dados.nome || dados.nome.trim() === '') {
            erros.push('Nome é obrigatório');
        }

        // Nome com pelo menos 3 caracteres
        if (dados.nome && dados.nome.trim().length < 3) {
            erros.push('Nome deve ter pelo menos 3 caracteres');
        }

        // Cargo obrigatório
        if (!dados.id_cargo) {
            erros.push('Cargo é obrigatório');
        }

        return erros;
    }

    // Criar novo funcionário
    static async criar(dados) {
        try {
            // Validar dados
            const erros = this.validarDadosFuncionario(dados);
            if (erros.length > 0) {
                const error = new Error('Dados inválidos');
                error.errors = erros;
                throw error;
            }

            // Verificar se cargo existe
            const cargoExiste = await CargoModel.existe(dados.id_cargo);
            if (!cargoExiste) {
                throw new Error('Cargo não encontrado');
            }

            // Criar funcionário
            const id = await FuncionarioModel.criar({
                nome: dados.nome.trim(),
                id_cargo: dados.id_cargo
            });

            // Buscar funcionário criado com dados completos
            const funcionario = await FuncionarioModel.buscarPorId(id);

            return funcionario;
        } catch (error) {
            throw error;
        }
    }

    // Atualizar funcionário
    static async atualizar(id, dados) {
        try {
            // Verificar se existe
            const existe = await FuncionarioModel.existe(id);
            if (!existe) {
                throw new Error('Funcionário não encontrado');
            }

            // Validar dados
            const erros = this.validarDadosFuncionario(dados);
            if (erros.length > 0) {
                const error = new Error('Dados inválidos');
                error.errors = erros;
                throw error;
            }

            // Verificar se cargo existe
            const cargoExiste = await CargoModel.existe(dados.id_cargo);
            if (!cargoExiste) {
                throw new Error('Cargo não encontrado');
            }

            // Atualizar funcionário
            await FuncionarioModel.atualizar(id, {
                nome: dados.nome.trim(),
                id_cargo: dados.id_cargo
            });

            // Buscar funcionário atualizado
            const funcionario = await FuncionarioModel.buscarPorId(id);

            return funcionario;
        } catch (error) {
            throw error;
        }
    }

    // Deletar funcionário
    static async deletar(id) {
        try {
            // Verificar se existe
            const existe = await FuncionarioModel.existe(id);
            if (!existe) {
                throw new Error('Funcionário não encontrado');
            }

            // Regra de negócio: verificar vendas vinculadas
            const totalVendas = await FuncionarioModel.contarVendasVinculadas(id);

            if (totalVendas > 0) {
                throw new Error(`Não é possível deletar. Existem ${totalVendas} venda(s) registrada(s) por este funcionário.`);
            }

            // Deletar funcionário
            await FuncionarioModel.deletar(id);

            return true;
        } catch (error) {
            throw error;
        }
    }

    // Buscar histórico de vendas
    static async buscarHistoricoVendas(id, filtros = {}) {
        try {
            // Verificar se existe
            const existe = await FuncionarioModel.existe(id);
            if (!existe) {
                throw new Error('Funcionário não encontrado');
            }

            const vendas = await FuncionarioModel.buscarVendas(id);

            return vendas;
        } catch (error) {
            throw error;
        }
    }

    // Obter estatísticas do funcionário
    static async obterEstatisticas(id) {
        try {
            // Verificar se existe
            const existe = await FuncionarioModel.existe(id);
            if (!existe) {
                throw new Error('Funcionário não encontrado');
            }

            const funcionario = await FuncionarioModel.buscarPorId(id);
            const estatisticas = await FuncionarioModel.obterEstatisticas(id);

            return {
                funcionario: {
                    id: funcionario.ID_Funcionario,
                    nome: funcionario.Nome,
                    cargo: funcionario.Cargo
                },
                estatisticas: {
                    total_vendas: parseInt(estatisticas.Total_Vendas),
                    valor_total_vendido: parseFloat(estatisticas.Valor_Total_Vendido),
                    ticket_medio: parseFloat(estatisticas.Ticket_Medio)
                }
            };
        } catch (error) {
            throw error;
        }
    }

    // Obter ranking de funcionários
    static async obterRanking(filtros = {}) {
        try {
            const { data_inicio, data_fim } = filtros;

            const ranking = await FuncionarioModel.obterRanking(data_inicio, data_fim);

            return ranking.map((item, index) => ({
                posicao: index + 1,
                ...item,
                Total_Vendas: parseInt(item.Total_Vendas),
                Valor_Total_Vendido: parseFloat(item.Valor_Total_Vendido),
                Ticket_Medio: parseFloat(item.Ticket_Medio)
            }));
        } catch (error) {
            throw new Error('Erro ao obter ranking: ' + error.message);
        }
    }

    // Listar todos os cargos
    static async listarCargos() {
        try {
            return await CargoModel.listarTodos();
        } catch (error) {
            throw new Error('Erro ao listar cargos: ' + error.message);
        }
    }
}

module.exports = FuncionarioService;