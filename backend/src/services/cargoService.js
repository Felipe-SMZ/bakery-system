// backend/src/services/cargoService.js
const CargoModel = require('../models/cargoModel');

class CargoService {

    // Listar todos os cargos
    static async listarCargos() {
        try {
            return await CargoModel.listarTodos();
        } catch (error) {
            throw new Error('Erro ao listar cargos: ' + error.message);
        }
    }

    // Buscar por ID
    static async buscarPorId(id) {
        try {
            const cargo = await CargoModel.buscarPorId(id);

            if (!cargo) {
                throw new Error('Cargo não encontrado');
            }

            return cargo;
        } catch (error) {
            throw error;
        }
    }

    // Validar dados do cargo
    static validarDadosCargo(dados) {
        const erros = [];

        if (!dados.nome_cargo || dados.nome_cargo.trim() === '') {
            erros.push('Nome do cargo é obrigatório');
        }

        return erros;
    }

    // Criar novo cargo
    static async criar(dados) {
        try {
            // Validar dados
            const erros = this.validarDadosCargo(dados);
            if (erros.length > 0) {
                const error = new Error('Dados inválidos');
                error.errors = erros;
                throw error;
            }

            // Verificar se já existe cargo com esse nome
            const cargoExistente = await CargoModel.buscarPorNome(dados.nome_cargo.trim());
            if (cargoExistente) {
                throw new Error('Já existe um cargo com este nome');
            }

            // Criar cargo
            // Nota: Você precisa adicionar o método criar no CargoModel
            const id = await CargoModel.criar({
                nome_cargo: dados.nome_cargo.trim()
            });

            return {
                id,
                nome_cargo: dados.nome_cargo.trim()
            };
        } catch (error) {
            throw error;
        }
    }

    // Atualizar cargo
    static async atualizar(id, dados) {
        try {
            // Verificar se cargo existe
            const existe = await CargoModel.existe(id);
            if (!existe) {
                throw new Error('Cargo não encontrado');
            }

            // Validar dados
            const erros = this.validarDadosCargo(dados);
            if (erros.length > 0) {
                const error = new Error('Dados inválidos');
                error.errors = erros;
                throw error;
            }

            // Verificar se nome já existe (em outro cargo)
            const cargoExistente = await CargoModel.buscarPorNome(dados.nome_cargo.trim());
            if (cargoExistente && cargoExistente.ID_Cargo !== parseInt(id)) {
                throw new Error('Já existe um cargo com este nome');
            }

            // Atualizar cargo
            // Nota: Você precisa adicionar o método atualizar no CargoModel
            await CargoModel.atualizar(id, {
                nome_cargo: dados.nome_cargo.trim()
            });

            return true;
        } catch (error) {
            throw error;
        }
    }

    // Deletar cargo
    static async deletar(id) {
        try {
            // Verificar se cargo existe
            const existe = await CargoModel.existe(id);
            if (!existe) {
                throw new Error('Cargo não encontrado');
            }

            // Verificar se há funcionários vinculados
            const totalFuncionarios = await CargoModel.contarFuncionariosVinculados(id);

            if (totalFuncionarios > 0) {
                throw new Error(`Não é possível deletar. Existem ${totalFuncionarios} funcionário(s) vinculado(s) a este cargo.`);
            }

            // Deletar cargo
            // Nota: Você precisa adicionar o método deletar no CargoModel
            await CargoModel.deletar(id);

            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CargoService;