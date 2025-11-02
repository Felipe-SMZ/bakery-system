// src/pages/Clientes.jsx

import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Users, CreditCard } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import {
    listarClientes,
    criarCliente,
    atualizarCliente,
    deletarCliente
} from '../services/clienteService';
import { formatarMoeda, formatarTelefone } from '../utils/formatters';

/**
 * 👥 PÁGINA DE CLIENTES
 * 
 * DIFERENÇAS EM RELAÇÃO A FUNCIONÁRIOS:
 * - Formulário maior (10+ campos vs 2 campos)
 * - Validações de telefone e CEP
 * - Campos opcionais (endereço)
 * - Status colorido (bom/médio/ruim)
 * - Crédito disponível calculado
 * - Filtros: status + busca
 */

function Clientes() {
    // ========================================================
    // 🗄️ ESTADOS
    // ========================================================

    const [clientes, setClientes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [filtros, setFiltros] = useState({
        status: '',
        busca: ''
    });

    // Estados do Modal
    const [modalAberto, setModalAberto] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [clienteEditando, setClienteEditando] = useState(null);
    const [salvando, setSalvando] = useState(false);

    // Estado do Formulário (MUITOS campos!)
    const [formData, setFormData] = useState({
        // Dados Pessoais
        Nome: '',
        Telefone: '',

        // Endereço (opcional)
        Rua: '',
        Numero: '',
        Bairro: '',
        Cidade: '',
        CEP: '',

        // Controle de Fiado
        Status: 'bom',
        Limite_Fiado: ''
    });

    // ========================================================
    // 🔄 EFEITOS
    // ========================================================

    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            buscarClientes();
        }, 500); // Debounce de 500ms

        return () => clearTimeout(timer);
    }, [filtros]);

    // ========================================================
    // 📡 FUNÇÕES DE REQUISIÇÃO
    // ========================================================

    const carregarDados = async () => {
        try {
            setCarregando(true);
            const clientesData = await listarClientes();
            setClientes(clientesData);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            alert('Erro ao carregar clientes. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    const buscarClientes = async () => {
        try {
            const clientesData = await listarClientes(filtros);
            setClientes(clientesData);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
        }
    };

    // ========================================================
    // 🎯 HANDLERS DE FILTROS
    // ========================================================

    const handleStatusChange = (e) => {
        setFiltros(prev => ({
            ...prev,
            status: e.target.value
        }));
    };

    const handleBuscaChange = (e) => {
        setFiltros(prev => ({
            ...prev,
            busca: e.target.value
        }));
    };

    const limparFiltros = () => {
        setFiltros({
            status: '',
            busca: ''
        });
    };

    // ========================================================
    // 🎯 HANDLERS DO MODAL
    // ========================================================

    const abrirModalCriar = () => {
        setModoEdicao(false);
        setClienteEditando(null);
        setFormData({
            Nome: '',
            Telefone: '',
            Rua: '',
            Numero: '',
            Bairro: '',
            Cidade: '',
            CEP: '',
            Status: 'bom',
            Limite_Fiado: ''
        });
        setModalAberto(true);
    };

    const abrirModalEditar = (cliente) => {
        setModoEdicao(true);
        setClienteEditando(cliente);
        setFormData({
            Nome: cliente.Nome || '',
            Telefone: cliente.Telefone || '',
            Rua: cliente.Rua || '',
            Numero: cliente.Numero || '',
            Bairro: cliente.Bairro || '',
            Cidade: cliente.Cidade || '',
            CEP: cliente.CEP || '',
            Status: cliente.Status || 'bom',
            Limite_Fiado: cliente.Limite_Fiado || ''
        });
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setModoEdicao(false);
        setClienteEditando(null);
        setFormData({
            Nome: '',
            Telefone: '',
            Rua: '',
            Numero: '',
            Bairro: '',
            Cidade: '',
            CEP: '',
            Status: 'bom',
            Limite_Fiado: ''
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

        // Nome obrigatório
        if (!formData.Nome || formData.Nome.trim() === '') {
            erros.push('Nome é obrigatório');
        }

        // Telefone obrigatório
        if (!formData.Telefone || formData.Telefone.trim() === '') {
            erros.push('Telefone é obrigatório');
        }

        // Status obrigatório
        if (!formData.Status) {
            erros.push('Status é obrigatório');
        }

        // Limite de fiado obrigatório e >= 0
        if (formData.Limite_Fiado === '' || parseFloat(formData.Limite_Fiado) < 0) {
            erros.push('Limite de fiado deve ser maior ou igual a zero');
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
            Telefone: formData.Telefone.trim(),
            Rua: formData.Rua.trim() || null,
            Numero: formData.Numero.trim() || null,
            Bairro: formData.Bairro.trim() || null,
            Cidade: formData.Cidade.trim() || null,
            CEP: formData.CEP.trim() || null,
            Status: formData.Status,
            Limite_Fiado: parseFloat(formData.Limite_Fiado)
        };

        // 3. Enviar para API
        try {
            setSalvando(true);

            if (modoEdicao) {
                await atualizarCliente(clienteEditando.ID_Cliente, dados);
                alert('✅ Cliente atualizado com sucesso!');
            } else {
                await criarCliente(dados);
                alert('✅ Cliente criado com sucesso!');
            }

            await buscarClientes();
            fecharModal();

        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            alert('❌ Erro ao salvar cliente: ' + (error.response?.data?.error || error.message));
        } finally {
            setSalvando(false);
        }
    };

    // ========================================================
    // 🗑️ DELETAR CLIENTE
    // ========================================================

    const handleDeletar = async (cliente) => {
        const confirmar = window.confirm(
            `⚠️ Tem certeza que deseja excluir o cliente "${cliente.Nome}"?\n\nEsta ação não pode ser desfeita.`
        );

        if (!confirmar) return;

        try {
            await deletarCliente(cliente.ID_Cliente);
            alert('✅ Cliente excluído com sucesso!');
            await buscarClientes();
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);

            if (error.response?.data?.error?.includes('venda')) {
                alert('❌ Não é possível excluir este cliente pois ele possui vendas registradas.');
            } else {
                alert('❌ Erro ao deletar cliente: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    // ========================================================
    // 🎨 FUNÇÕES AUXILIARES
    // ========================================================

    /**
     * Retorna as classes CSS para o badge de status
     */
    const getStatusBadge = (status) => {
        const classes = {
            'bom': 'bg-success-100 text-success-700',
            'medio': 'bg-warning-100 text-warning-700',
            'ruim': 'bg-danger-100 text-danger-700'
        };

        const labels = {
            'bom': 'Bom',
            'medio': 'Médio',
            'ruim': 'Ruim'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes[status]}`}>
                {labels[status] || status}
            </span>
        );
    };

    /**
     * Retorna a classe CSS para o crédito disponível
     */
    const getCreditoColor = (creditoDisponivel) => {
        if (creditoDisponivel >= 100) return 'text-success-600';
        if (creditoDisponivel >= 0) return 'text-warning-600';
        return 'text-danger-600';
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
                        Clientes
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Gerencie os clientes e controle de fiado
                    </p>
                </div>

                <Button
                    variant="primary"
                    leftIcon={<Plus size={20} />}
                    onClick={abrirModalCriar}
                >
                    Novo Cliente
                </Button>
            </div>

            {/* ===== CARD DE FILTROS ===== */}
            <Card>
                <Card.Body>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Busca por nome ou telefone */}
                        <div className="md:col-span-2">
                            <Input
                                type="search"
                                placeholder="Buscar por nome ou telefone..."
                                value={filtros.busca}
                                onChange={handleBuscaChange}
                                leftIcon={<Search size={20} />}
                            />
                        </div>

                        {/* Filtro por status */}
                        <div className="flex gap-2">
                            <select
                                value={filtros.status}
                                onChange={handleStatusChange}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Todos os status</option>
                                <option value="bom">Bom</option>
                                <option value="medio">Médio</option>
                                <option value="ruim">Ruim</option>
                            </select>

                            {(filtros.busca || filtros.status) && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={limparFiltros}
                                >
                                    Limpar
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* ===== TABELA DE CLIENTES ===== */}
            <Card>
                <Card.Body noPadding>
                    {clientes.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Users size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Nenhum cliente encontrado
                            </h3>
                            <p className="text-gray-600">
                                {filtros.busca || filtros.status
                                    ? 'Tente ajustar os filtros de busca'
                                    : 'Cadastre o primeiro cliente para começar'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Limite</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Crédito Disp.</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {clientes.map(cliente => (
                                        <tr key={cliente.ID_Cliente} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">#{cliente.ID_Cliente}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{cliente.Nome}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{formatarTelefone(cliente.Telefone)}</td>
                                            <td className="px-6 py-4 text-sm">{getStatusBadge(cliente.Status)}</td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-900">{formatarMoeda(cliente.Limite_Fiado)}</td>
                                            <td className="px-6 py-4 text-sm text-right">
                                                <span className={`font-medium ${getCreditoColor(cliente.Credito_Disponivel)}`}>
                                                    {formatarMoeda(cliente.Credito_Disponivel || 0)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        leftIcon={<Pencil size={16} />}
                                                        onClick={() => abrirModalEditar(cliente)}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        leftIcon={<Trash2 size={16} />}
                                                        onClick={() => handleDeletar(cliente)}
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

            {clientes.length > 0 && (
                <div className="text-sm text-gray-600 text-center">
                    Mostrando {clientes.length} cliente{clientes.length !== 1 ? 's' : ''}
                </div>
            )}

            {/* ===== MODAL DE CRIAR/EDITAR ===== */}
            <Modal
                isOpen={modalAberto}
                onClose={fecharModal}
                title={modoEdicao ? 'Editar Cliente' : 'Novo Cliente'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ===== SEÇÃO: DADOS PESSOAIS ===== */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
                            Dados Pessoais
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    name="Nome"
                                    value={formData.Nome}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Ex: José Almeida"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Telefone *
                                </label>
                                <Input
                                    type="phone"
                                    name="Telefone"
                                    value={formData.Telefone}
                                    onChange={handleChange}
                                    placeholder="(11) 98765-4321"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* ===== SEÇÃO: ENDEREÇO ===== */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
                            Endereço <span className="text-sm font-normal text-gray-500">(opcional)</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                                <Input
                                    type="cep"
                                    name="CEP"
                                    value={formData.CEP}
                                    onChange={handleChange}
                                    placeholder="01234-567"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                                <input
                                    type="text"
                                    name="Rua"
                                    value={formData.Rua}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Ex: Rua das Flores"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                                <input
                                    type="text"
                                    name="Numero"
                                    value={formData.Numero}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="123"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                                <input
                                    type="text"
                                    name="Bairro"
                                    value={formData.Bairro}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Centro"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                                <input
                                    type="text"
                                    name="Cidade"
                                    value={formData.Cidade}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="São Paulo"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ===== SEÇÃO: CONTROLE DE FIADO ===== */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
                            Controle de Fiado
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status *
                                </label>
                                <select
                                    name="Status"
                                    value={formData.Status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    required
                                >
                                    <option value="bom">Bom</option>
                                    <option value="medio">Médio</option>
                                    <option value="ruim">Ruim</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Limite de Fiado (R$) *
                                </label>
                                <input
                                    type="number"
                                    name="Limite_Fiado"
                                    value={formData.Limite_Fiado}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="0,00"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* ===== BOTÕES ===== */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
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
                            {salvando ? 'Salvando...' : modoEdicao ? 'Atualizar Cliente' : 'Criar Cliente'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Clientes;