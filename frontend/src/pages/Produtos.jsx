// src/pages/Produtos.jsx

import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import { listarProdutos, criarProduto, atualizarProduto, deletarProduto } from '../services/produtoService';
import { listarTiposProduto } from '../services/tipoProdutoService';
import { formatarMoeda, formatarQuantidade } from '../utils/formatters';

function Produtos() {
  // ========================================================
  // 🗄️ ESTADOS
  // ========================================================

  const [produtos, setProdutos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtros, setFiltros] = useState({
    busca: '',
    tipo: ''
  });

  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);

  // Estado do Formulário
  const [formData, setFormData] = useState({
    nome: '',
    id_tipo_produto: '',
    unidade_medida: 'unidade',
    preco_base: '',
    estoque_atual: ''
  });

  // ========================================================
  // 🔄 EFEITOS
  // ========================================================

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      buscarProdutos();
    }, 500);

    return () => clearTimeout(timer);
  }, [filtros]);

  // ========================================================
  // 📡 FUNÇÕES DE REQUISIÇÃO
  // ========================================================

  const carregarDados = async () => {
    try {
      setCarregando(true);

      const [tiposData, produtosData] = await Promise.all([
        listarTiposProduto(),
        listarProdutos()
      ]);

      setTipos(tiposData);
      setProdutos(produtosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const buscarProdutos = async () => {
    try {
      console.log('🔍 Buscando produtos com filtros:', filtros);
      const produtosData = await listarProdutos(filtros);
      console.log('✅ Produtos encontrados:', produtosData.length);
      setProdutos(produtosData);
    } catch (error) {
      console.error('❌ Erro ao buscar produtos:', error);
      alert('Erro ao buscar produtos. Verifique se o backend está rodando.');
    }
  };

  // ========================================================
  // 🎯 HANDLERS DE FILTROS
  // ========================================================

  const handleBuscaChange = (e) => {
    const valor = e.target.value;
    console.log('📝 Digitando busca:', valor);
    setFiltros(prev => ({
      ...prev,
      busca: valor
    }));
  };

  const handleTipoChange = (e) => {
    setFiltros(prev => ({
      ...prev,
      tipo: e.target.value
    }));
  };

  const limparFiltros = () => {
    setFiltros({
      busca: '',
      tipo: ''
    });
  };

  // ========================================================
  // 🎯 HANDLERS DO MODAL
  // ========================================================

  /**
   * Abre modal para CRIAR produto novo
   */
  const abrirModalCriar = () => {
    setModoEdicao(false);
    setProdutoEditando(null);
    setFormData({
      nome: '',
      id_tipo_produto: '',
      unidade_medida: 'unidade',
      preco_base: '',
      estoque_atual: ''
    });
    setModalAberto(true);
  };

  /**
   * Abre modal para EDITAR produto existente
   */
  const abrirModalEditar = (produto) => {
    setModoEdicao(true);
    setProdutoEditando(produto);
    setFormData({
      nome: produto.Nome,
      id_tipo_produto: produto.ID_Tipo_Produto,
      unidade_medida: produto.Unidade_Medida,
      preco_base: produto.Preco_Base,
      estoque_atual: produto.Estoque_Atual
    });
    setModalAberto(true);
  };

  /**
   * Fecha modal e limpa dados
   */
  const fecharModal = () => {
    setModalAberto(false);
    setModoEdicao(false);
    setProdutoEditando(null);
    setFormData({
      nome: '',
      id_tipo_produto: '',
      unidade_medida: 'unidade',
      preco_base: '',
      estoque_atual: ''
    });
  };

  // ========================================================
  // 🎯 HANDLERS DO FORMULÁRIO
  // ========================================================

  /**
   * Atualiza campos do formulário
   * Função GENÉRICA para todos os inputs
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Valida dados antes de enviar
   */
  const validarFormulario = () => {
    const erros = [];

    if (!formData.nome || formData.nome.trim() === '') {
      erros.push('Nome é obrigatório');
    }

    if (!formData.id_tipo_produto) {
      erros.push('Tipo de produto é obrigatório');
    }

    if (!formData.preco_base || parseFloat(formData.preco_base) <= 0) {
      erros.push('Preço deve ser maior que zero');
    }

    if (formData.estoque_atual === '' || parseFloat(formData.estoque_atual) < 0) {
      erros.push('Estoque não pode ser negativo');
    }

    return erros;
  };

  /**
   * Submete o formulário (criar ou editar)
   */
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
      nome: formData.nome.trim(),
      id_tipo_produto: parseInt(formData.id_tipo_produto),
      unidade_medida: formData.unidade_medida,
      preco_base: parseFloat(formData.preco_base),
      estoque_atual: parseFloat(formData.estoque_atual)
    };

    // 3. Enviar para API
    try {
      setSalvando(true);

      if (modoEdicao) {
        // EDITAR produto existente
        await atualizarProduto(produtoEditando.ID_Produto, dados);
        alert('✅ Produto atualizado com sucesso!');
      } else {
        // CRIAR produto novo
        await criarProduto(dados);
        alert('✅ Produto criado com sucesso!');
      }

      // 4. Atualizar lista e fechar modal
      await buscarProdutos();
      fecharModal();

    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('❌ Erro ao salvar produto: ' + error.message);
    } finally {
      setSalvando(false);
    }
  };

  // ========================================================
  // 🗑️ DELETAR PRODUTO
  // ========================================================

  const handleDeletar = async (produto) => {
    // Confirmação
    const confirmar = window.confirm(
      `⚠️ Tem certeza que deseja excluir o produto "${produto.Nome}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmar) return;

    try {
      await deletarProduto(produto.ID_Produto);
      alert('✅ Produto excluído com sucesso!');
      await buscarProdutos();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      alert('❌ Erro ao deletar produto: ' + error.message);
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
            Produtos
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie o catálogo de produtos da padaria
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus size={20} />}
          onClick={abrirModalCriar}
        >
          Novo Produto
        </Button>
      </div>

      {/* ===== CARD DE FILTROS ===== */}
      <Card>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                type="search"
                placeholder="Buscar por nome do produto..."
                value={filtros.busca}
                onChange={handleBuscaChange}
                leftIcon={<Search size={20} />}
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filtros.tipo}
                onChange={handleTipoChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todos os tipos</option>
                {tipos.map(tipo => (
                  <option key={tipo.ID_Tipo_Produto} value={tipo.ID_Tipo_Produto}>
                    {tipo.Nome_Tipo}
                  </option>
                ))}
              </select>

              {(filtros.busca || filtros.tipo) && (
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

      {/* ===== TABELA DE PRODUTOS ===== */}
      <Card>
        <Card.Body noPadding>
          {produtos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600">
                {filtros.busca || filtros.tipo
                  ? 'Tente ajustar os filtros de busca'
                  : 'Cadastre o primeiro produto para começar'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidade</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Preço</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Estoque</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {produtos.map(produto => (
                    <tr key={produto.ID_Produto} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">#{produto.ID_Produto}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{produto.Nome}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{produto.Tipo || produto.Nome_Tipo}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{produto.Unidade_Medida}</td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                        {formatarMoeda(produto.Preco_Base)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <span className={`font-medium ${parseFloat(produto.Estoque_Atual) < 50 ? 'text-danger-600' : 'text-gray-900'}`}>
                          {formatarQuantidade(produto.Estoque_Atual, produto.Unidade_Medida)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            leftIcon={<Pencil size={16} />}
                            onClick={() => abrirModalEditar(produto)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            leftIcon={<Trash2 size={16} />}
                            onClick={() => handleDeletar(produto)}
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

      {produtos.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Mostrando {produtos.length} produto{produtos.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* ===== MODAL DE CRIAR/EDITAR ===== */}
      <Modal
        isOpen={modalAberto}
        onClose={fecharModal}
        title={modoEdicao ? 'Editar Produto' : 'Novo Produto'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Produto *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: Pão Francês"
              required
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Produto *
            </label>
            <select
              name="id_tipo_produto"
              value={formData.id_tipo_produto}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Selecione o tipo</option>
              {tipos.map(tipo => (
                <option key={tipo.ID_Tipo_Produto} value={tipo.ID_Tipo_Produto}>
                  {tipo.Nome_Tipo}
                </option>
              ))}
            </select>
          </div>

          {/* Unidade de Medida */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidade de Medida *
            </label>
            <select
              name="unidade_medida"
              value={formData.unidade_medida}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="unidade">Unidade</option>
              <option value="kg">Quilograma (kg)</option>
              <option value="fatia">Fatia</option>
            </select>
          </div>

          {/* Grid: Preço e Estoque */}
          <div className="grid grid-cols-2 gap-4">
            {/* Preço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$) *
              </label>
              <input
                type="number"
                name="preco_base"
                value={formData.preco_base}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0,00"
                required
              />
            </div>

            {/* Estoque */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estoque Atual *
              </label>
              <input
                type="number"
                name="estoque_atual"
                value={formData.estoque_atual}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0"
                required
              />
            </div>
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
              {salvando ? 'Salvando...' : modoEdicao ? 'Atualizar' : 'Criar Produto'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Produtos;