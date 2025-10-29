// src/pages/Dashboard.jsx

/**
 * 📊 PÁGINA DASHBOARD
 * 
 * Dashboard principal do sistema com estatísticas e alertas.
 * Busca dados reais da API e exibe de forma visual.
 */

import React, { useState, useEffect } from 'react';
import {
    DollarSign,
    Package,
    Users,
    AlertTriangle,
    TrendingUp,
    ShoppingCart
} from 'lucide-react';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { buscarDashboard } from '../services/relatorioService';
import { formatarMoeda } from '../utils/formatters';

/**
 * Componente Dashboard
 */
const Dashboard = () => {

    // ══════════════════════════════════════════════════════════
    // 📊 ESTADO
    // ══════════════════════════════════════════════════════════

    /**
     * useState: Hook para guardar dados
     * 
     * Estados necessários:
     * - dados: dados do dashboard vindos da API
     * - carregando: se está buscando dados
     * - erro: mensagem de erro (se houver)
     */
    const [dados, setDados] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    // ══════════════════════════════════════════════════════════
    // 🔄 BUSCAR DADOS
    // ══════════════════════════════════════════════════════════

    /**
     * useEffect: Hook que executa quando componente carrega
     * 
     * É como um "onLoad" da página.
     * Usamos para buscar dados da API quando página abre.
     * 
     * Sintaxe:
     * useEffect(() => {
     *   // código aqui
     * }, [dependências]);
     * 
     * [] vazio = executa só 1 vez (quando carrega)
     */
    useEffect(() => {
        carregarDados();
    }, []); // Array vazio = executa só ao montar componente

    /**
     * Função para buscar dados da API
     */
    const carregarDados = async () => {
        try {
            setCarregando(true);
            setErro(null);

            // Busca dados do dashboard
            const dadosDashboard = await buscarDashboard();

            // Salva no estado
            setDados(dadosDashboard);

        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
            setErro('Erro ao carregar dados do dashboard');
        } finally {
            // finally = executa sempre (erro ou sucesso)
            setCarregando(false);
        }
    };

    // ══════════════════════════════════════════════════════════
    // 🎨 RENDERIZAÇÃO CONDICIONAL
    // ══════════════════════════════════════════════════════════

    /**
     * Enquanto carrega: mostra Loading
     */
    if (carregando) {
        return <Loading text="Carregando dashboard..." />;
    }

    /**
     * Se deu erro: mostra mensagem
     */
    if (erro) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
                    <p className="text-danger-600 font-semibold">{erro}</p>
                    <button
                        onClick={carregarDados}
                        className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    /**
     * Se não tem dados: mostra mensagem
     */
    if (!dados) {
        return (
            <div className="text-center text-gray-600">
                Nenhum dado disponível
            </div>
        );
    }

    // ══════════════════════════════════════════════════════════
    // 🎨 RENDERIZAÇÃO PRINCIPAL
    // ══════════════════════════════════════════════════════════

    return (
        <div className="space-y-6">

            {/**
       * ═══════════════════════════════════════════════════════
       * HEADER
       * ═══════════════════════════════════════════════════════
       */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Visão geral do sistema
                </p>
            </div>

            {/**
       * ═══════════════════════════════════════════════════════
       * GRID DE CARDS DE ESTATÍSTICAS
       * ═══════════════════════════════════════════════════════
       * 
       * Grid responsivo:
       * - 1 coluna no mobile
       * - 2 colunas no tablet (md:)
       * - 4 colunas no desktop (lg:)
       */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/**
         * Card 1: Vendas Hoje
         */}
                <Card.Stat
                    titulo="Vendas Hoje"
                    valor={formatarMoeda(dados.vendas_hoje.valor_total)}
                    subtitulo={`${dados.vendas_hoje.quantidade} vendas`}
                    icone={<DollarSign size={24} />}
                    cor="primary"
                />

                {/**
         * Card 2: Vendas do Mês
         */}
                <Card.Stat
                    titulo="Vendas do Mês"
                    valor={formatarMoeda(dados.vendas_mes.valor_total)}
                    subtitulo={`${dados.vendas_mes.quantidade} vendas`}
                    icone={<TrendingUp size={24} />}
                    cor="success"
                />

                {/**
         * Card 3: Total de Produtos
         */}
                <Card.Stat
                    titulo="Produtos Cadastrados"
                    valor={dados.produtos.total}
                    subtitulo={`${dados.produtos.estoque_baixo} com estoque baixo`}
                    icone={<Package size={24} />}
                    cor="blue"
                />

                {/**
         * Card 4: Total de Clientes
         */}
                <Card.Stat
                    titulo="Clientes Cadastrados"
                    valor={dados.clientes.total}
                    icone={<Users size={24} />}
                    cor="purple"
                />
            </div>

            {/**
       * ═══════════════════════════════════════════════════════
       * ALERTAS IMPORTANTES
       * ═══════════════════════════════════════════════════════
       */}
            {(dados.alertas.clientes_credito_excedido > 0 ||
                dados.alertas.fiado_em_aberto.quantidade > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/**
           * Alerta: Clientes com Crédito Excedido
           */}
                        {dados.alertas.clientes_credito_excedido > 0 && (
                            <Card className="border-l-4 border-danger-500">
                                <Card.Body>
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="text-danger-500 flex-shrink-0" size={24} />
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                Clientes com Crédito Excedido
                                            </h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                {dados.alertas.clientes_credito_excedido} cliente(s)
                                                ultrapassaram o limite de crédito
                                            </p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        )}

                        {/**
           * Alerta: Vendas a Fiado em Aberto
           */}
                        {dados.alertas.fiado_em_aberto.quantidade > 0 && (
                            <Card className="border-l-4 border-warning-500">
                                <Card.Body>
                                    <div className="flex items-start gap-3">
                                        <ShoppingCart className="text-warning-500 flex-shrink-0" size={24} />
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                Vendas a Fiado em Aberto
                                            </h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                {dados.alertas.fiado_em_aberto.quantidade} venda(s)
                                                totalizando {formatarMoeda(dados.alertas.fiado_em_aberto.valor_total)}
                                            </p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        )}
                    </div>
                )}

            {/**
       * ═══════════════════════════════════════════════════════
       * VENDAS DOS ÚLTIMOS 7 DIAS
       * ═══════════════════════════════════════════════════════
       */}
            {dados.vendas_ultimos_7_dias && dados.vendas_ultimos_7_dias.length > 0 && (
                <Card>
                    <Card.Header>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Vendas dos Últimos 7 Dias
                        </h2>
                    </Card.Header>
                    <Card.Body>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                                            Data
                                        </th>
                                        <th className="text-right py-3 px-4 text-gray-600 font-semibold">
                                            Quantidade
                                        </th>
                                        <th className="text-right py-3 px-4 text-gray-600 font-semibold">
                                            Valor Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dados.vendas_ultimos_7_dias.map((venda, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-4 text-gray-800">
                                                {new Date(venda.data).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="py-3 px-4 text-right text-gray-800">
                                                {venda.quantidade} vendas
                                            </td>
                                            <td className="py-3 px-4 text-right font-semibold text-primary-600">
                                                {formatarMoeda(venda.total)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                </Card>
            )}

        </div>
    );
};

export default Dashboard;


/**
 * ════════════════════════════════════════════════════════════
 * 📖 EXPLICAÇÃO DOS CONCEITOS
 * ════════════════════════════════════════════════════════════
 */

/**
 * CONCEITO 1: useEffect
 * 
 * Hook que executa código quando algo muda.
 * 
 * Sintaxe:
 * useEffect(() => {
 *   // código aqui
 * }, [dependências]);
 * 
 * Quando executa:
 * - [] vazio: só quando componente carrega (mount)
 * - [variavel]: quando variavel muda
 * - sem array: toda vez que componente re-renderiza
 * 
 * Exemplo:
 * useEffect(() => {
 *   buscarDados();
 * }, []); // Busca dados só 1 vez ao carregar
 * 
 * useEffect(() => {
 *   console.log('ID mudou:', id);
 * }, [id]); // Executa quando id muda
 */

/**
 * CONCEITO 2: async/await no useEffect
 * 
 * useEffect não pode ser async diretamente.
 * Solução: criar função async dentro.
 * 
 * ❌ Errado:
 * useEffect(async () => {
 *   const dados = await buscarDados();
 * }, []);
 * 
 * ✅ Certo:
 * useEffect(() => {
 *   const buscar = async () => {
 *     const dados = await buscarDados();
 *   };
 *   buscar();
 * }, []);
 */

/**
 * CONCEITO 3: try/catch/finally
 * 
 * try = tenta executar
 * catch = captura erro
 * finally = executa sempre (erro ou não)
 * 
 * try {
 *   const dados = await buscarDados();  // Tenta buscar
 *   setDados(dados);  // Se deu certo
 * } catch (error) {
 *   setErro(error);  // Se deu erro
 * } finally {
 *   setCarregando(false);  // Sempre executa
 * }
 */

/**
 * CONCEITO 4: Early Return
 * 
 * Retornar antes do final da função.
 * Útil para simplificar lógica.
 * 
 * if (carregando) return <Loading />;
 * if (erro) return <Erro />;
 * 
 * // Se chegou aqui, não está carregando nem tem erro
 * return <Conteudo />;
 * 
 * Sem early return seria:
 * if (carregando) {
 *   return <Loading />
 * } else if (erro) {
 *   return <Erro />
 * } else {
 *   return <Conteudo />
 * }
 */

/**
 * CONCEITO 5: Optional Chaining (?.)
 * 
 * Acessa propriedades sem erro se undefined/null.
 * 
 * // Sem optional chaining:
 * const nome = dados && dados.cliente && dados.cliente.nome;
 * 
 * // Com optional chaining:
 * const nome = dados?.cliente?.nome;
 * 
 * Se dados for null → nome = undefined (sem erro)
 */