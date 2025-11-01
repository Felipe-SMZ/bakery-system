// src/pages/Funcionarios.jsx

import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Users } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import {
    listarFuncionarios,
    criarFuncionario,
    atualizarFuncionario,
    deletarFuncionario
} from '../services/funcionarioService';
import { listarCargos } from '../services/cargoService';

/**
 * 🧑‍💼 PÁGINA DE FUNCIONÁRIOS
 * 
 * NOTA: Esta página é MUITO SIMILAR a Produtos.jsx!
 * Diferenças principais:
 * - Menos campos no formulário (só Nome e Cargo)
 * - Filtro por cargo ao invés de tipo
 * - Sem validações complexas (preço, estoque, etc)
 */

function Funcionarios() {
    // ========================================================
    // 🗄️ ESTADOS
    // ========================================================

    const [funcionarios, setFuncionarios] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [filtros, setFiltros] = useState({
        cargo: ''
    });

    // Estados do Modal
    const [modalAberto, setModalAberto] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [funcionarioEditando, setFuncionarioEditando] = useState(null);
    const [salvando, setSalvando] = useState(false);

    // Estado do Formulário (SIMPLES - só 2 campos!)
    const [formData, setFormData] = useState({
        Nome: '',
        ID_Cargo: ''
    });

    // ========================================================
    // 🔄 EFEITOS
    // ========================================================

    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        buscarFuncionarios();
    }, [filtros]);

    // ========================================================
    // 📡 FUNÇÕES DE REQUISIÇÃO
    // ========================================================

    const carregarDados = async () => {
        try {
            setCarregando(true);

            const [cargosData, funcionariosData] = await Promise.all([
                listarCargos(),
                listarFuncionarios()
            ]);

            setCargos(cargosData);
            setFuncionarios(funcionariosData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            alert('Erro ao carregar dados. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    const buscarFuncionarios = async () => {
        try {
            const funcionariosData = await listarFuncionarios(filtros);
            setFuncionarios(funcionariosData);
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
        }
    };

    // ========================================================
    // 🎯 HANDLERS DE FILTROS
    // ========================================================

    const handleCargoChange = (e) => {
        setFiltros(prev => ({
            ...prev,
            cargo: e.target.value
        }));
    };

    const limparFiltros = () => {
        setFiltros({ cargo: '' });
    };

    // ========================================================
    // 🎯 HANDLERS DO MODAL
    // ========================================================

    const abrirModalCriar = () => {
        setModoEdicao(false);
        setFuncionarioEditando(null);
        setFormData({
            Nome: '',
            ID_Cargo: ''
        });
        setModalAberto(true);
    };

    const abrirModalEditar = (funcionario) => {
        setModoEdicao(true);
        setFuncionarioEditando(funcionario);
        setFormData({
            Nome: funcionario.Nome,
            ID_Cargo: funcionario.ID_Cargo
        });
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setModoEdicao(false);
        setFuncionarioEditando(null);
        setFormData({
            Nome: '',
            ID_Cargo: ''
        });
    };

    // ========================================================
    // 🎯 HANDLERS DO FORMULÁRIO
    // ========================================================

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validarFormulario = () => {
        const erros = [];

        if (!formData.Nome || formData.Nome.trim() === '') {
            erros.push('Nome é obrigatório');
        }

        if (!formData.ID_Cargo) {
            erros.push('Cargo é obrigatório');
        }

        return erros;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validar
        const erros = validarFormulario();
        if (erros.length > 0) {
            alert('❌ Erros de validação:\n\n' + erros.join('\n'));
            return;
        }

        // 2. Preparar dados
        const dados = {
            Nome: formData.Nome.trim(),
            ID_Cargo: parseInt(formData.ID_Cargo)
        };

        // 3. Enviar para API
        try {
            setSalvando(true);

            if (modoEdicao) {
                await atualizarFuncionario(funcionarioEditando.ID_Funcionario, dados);
                alert('✅ Funcionário atualizado com sucesso!');
            } else {
                await criarFuncionario(dados);
                alert('✅ Funcionário criado com sucesso!');
            }

            await buscarFuncionarios();
            fecharModal();

        } catch (error) {
            console.error('Erro ao salvar funcionário:', error);
            // Se o servidor retornou um array de erros, mostrar as mensagens
            const serverErrors = error.response?.data?.errors;
            if (Array.isArray(serverErrors) && serverErrors.length > 0) {
                const detalhes = serverErrors.map(err => {
                    if (typeof err === 'string') return err;
                    if (err?.message) return err.message;
                    return JSON.stringify(err);
                }).join('\n');

                alert('❌ Erro ao salvar funcionário:\n' + detalhes);
            } else if (error.response?.data?.error?.includes('Cargo')) {
                // Trata erro de cargo não encontrado (compatibilidade com mensagens antigas)
                alert('❌ Cargo não encontrado. Selecione um cargo válido.');
            } else {
                alert('❌ Erro ao salvar funcionário: ' + (error.response?.data?.error || error.message));
            }
        } finally {
            setSalvando(false);
        }
    };

    // ========================================================
    // 🗑️ DELETAR FUNCIONÁRIO
    // ========================================================

    const handleDeletar = async (funcionario) => {
        const confirmar = window.confirm(
            `⚠️ Tem certeza que deseja excluir o funcionário "${funcionario.Nome}"?\n\nEsta ação não pode ser desfeita.`
        );

        if (!confirmar) return;

        try {
            await deletarFuncionario(funcionario.ID_Funcionario);
            alert('✅ Funcionário excluído com sucesso!');
            await buscarFuncionarios();
        } catch (error) {
            console.error('Erro ao deletar funcionário:', error);

            // Trata erro de vendas vinculadas
            if (error.response?.data?.error?.includes('venda')) {
                alert('❌ Não é possível excluir este funcionário pois ele possui vendas registradas.');
            } else {
                alert('❌ Erro ao deletar funcionário: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    // ========================================================
    // 🎨 RENDERIZAÇÃO
    // ========================================================

    if (carregando) {
        return <Loading />;
    }

    return (
        <div className="space-y-6">
            {/* ===== CABEÇALHO ===== */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Funcionários
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Gerencie a equipe da padaria
                    </p>
                </div>

                <Button
                    variant="primary"
                    leftIcon={<Plus size={20} />}
                    onClick={abrirModalCriar}
                >
                    Novo Funcionário
                </Button>
            </div>

            {/* ===== CARD DE FILTROS ===== */}
            <Card>
                <Card.Body>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <select
                                value={filtros.cargo}
                                onChange={handleCargoChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Todos os cargos</option>
                                {cargos.map(cargo => (
                                    <option key={cargo.ID_Cargo} value={cargo.ID_Cargo}>
                                        {cargo.Nome_Cargo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {filtros.cargo && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={limparFiltros}
                            >
                                Limpar
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>

            {/* ===== TABELA DE FUNCIONÁRIOS ===== */}
            <Card>
                <Card.Body noPadding>
                    {funcionarios.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Users size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Nenhum funcionário encontrado
                            </h3>
                            <p className="text-gray-600">
                                {filtros.cargo
                                    ? 'Tente ajustar os filtros de busca'
                                    : 'Cadastre o primeiro funcionário para começar'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Código
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Nome
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Cargo
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {funcionarios.map(funcionario => (
                                        <tr key={funcionario.ID_Funcionario} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                #{funcionario.ID_Funcionario}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {funcionario.Nome}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                                    {funcionario.Nome_Cargo}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        leftIcon={<Pencil size={16} />}
                                                        onClick={() => abrirModalEditar(funcionario)}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        leftIcon={<Trash2 size={16} />}
                                                        onClick={() => handleDeletar(funcionario)}
                                                    >
                                                        Excluir
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {funcionarios.length > 0 && (
                <div className="text-sm text-gray-600 text-center">
                    Mostrando {funcionarios.length} funcionário{funcionarios.length !== 1 ? 's' : ''}
                </div>
            )}

            {/* ===== MODAL DE CRIAR/EDITAR ===== */}
            <Modal
                isOpen={modalAberto}
                onClose={fecharModal}
                title={modoEdicao ? 'Editar Funcionário' : 'Novo Funcionário'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nome */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo *
                        </label>
                        <input
                            type="text"
                            name="Nome"
                            value={formData.Nome}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Ex: Maria Silva"
                            required
                        />
                    </div>

                    {/* Cargo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cargo *
                        </label>
                        <select
                            name="ID_Cargo"
                            value={formData.ID_Cargo}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        >
                            <option value="">Selecione o cargo</option>
                            {cargos.map(cargo => (
                                <option key={cargo.ID_Cargo} value={cargo.ID_Cargo}>
                                    {cargo.Nome_Cargo}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Botões */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={fecharModal}
                            disabled={salvando}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={salvando}
                        >
                            {salvando ? 'Salvando...' : modoEdicao ? 'Atualizar' : 'Criar Funcionário'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Funcionarios;