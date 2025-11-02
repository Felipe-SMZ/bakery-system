// src/components/relatorios/TabelaRanking.jsx

/**
 * 🏆 COMPONENTE: TABELA DE RANKING
 * 
 * =============================================================================
 * 🎓 AULA: COMO CRIAR UMA TABELA REUTILIZÁVEL
 * =============================================================================
 * 
 * 🎯 O QUE ESTE COMPONENTE FAZ:
 * - Exibe dados em formato de tabela
 * - Mostra posição no ranking (1º, 2º, 3º...)
 * - Destaca top 3 com medalhas 🥇🥈🥉
 * - Permite ordenação por colunas
 * - Responsivo (scroll horizontal em mobile)
 * 
 * 💡 CONCEITO: COMPONENTE GENÉRICO
 * - Funciona com QUALQUER tipo de dado
 * - Define colunas via props (flexível)
 * - Formata valores automaticamente
 * 
 * 📖 VANTAGEM:
 * - Use para produtos, funcionários, clientes...
 * - Não precisa criar tabela nova para cada caso
 * 
 * =============================================================================
 */

import { TrendingUp, Award } from 'lucide-react';
import { formatarMoeda } from '../../utils/formatters';

/**
 * 🎯 PROPS:
 * 
 * @param {Array} dados - Array de objetos com os dados
 *   Exemplo: [
 *     { nome: 'Pão Francês', total: 1500, quantidade: 300 },
 *     { nome: 'Bolo', total: 980, quantidade: 45 },
 *   ]
 * 
 * @param {Array} colunas - Definição das colunas
 *   Exemplo: [
 *     { 
 *       chave: 'nome',              // Propriedade do objeto
 *       titulo: 'Produto',          // Título da coluna
 *       alinhamento: 'left',        // 'left', 'center', 'right'
 *       largura: 'w-1/2'           // Classe Tailwind (opcional)
 *     },
 *     { 
 *       chave: 'total', 
 *       titulo: 'Total Vendido',
 *       formatador: formatarMoeda,  // Função de formatação
 *       alinhamento: 'right'
 *     },
 *   ]
 * 
 * @param {String} titulo - Título da tabela
 * @param {Boolean} mostrarPosicao - Se mostra coluna de posição
 * @param {Boolean} destacarTop3 - Se destaca top 3 com medalhas
 * @param {String} mensagemVazio - Mensagem quando sem dados
 */
function TabelaRanking({ 
    dados, 
    colunas,
    titulo,
    mostrarPosicao = true,
    destacarTop3 = true,
    mensagemVazio = 'Nenhum registro encontrado'
}) {
    
    // =========================================================================
    // 🎯 VALIDAÇÃO
    // =========================================================================
    
    if (!dados || !Array.isArray(dados) || dados.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
                {titulo && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {titulo}
                    </h3>
                )}
                <div className="text-center py-8">
                    <p className="text-gray-500">{mensagemVazio}</p>
                </div>
            </div>
        );
    }
    
    // =========================================================================
    // 🎯 FUNÇÕES AUXILIARES
    // =========================================================================
    
    /**
     * 💡 MEDALHAS PARA TOP 3:
     * - 1º lugar: 🥇 (ouro)
     * - 2º lugar: 🥈 (prata)
     * - 3º lugar: 🥉 (bronze)
     */
    const obterMedalha = (posicao) => {
        if (!destacarTop3) return null;
        
        switch (posicao) {
            case 1:
                return <span className="text-2xl">🥇</span>;
            case 2:
                return <span className="text-2xl">🥈</span>;
            case 3:
                return <span className="text-2xl">🥉</span>;
            default:
                return null;
        }
    };
    
    /**
     * 💡 COR DE FUNDO PARA TOP 3:
     * - Destaque visual sutil
     */
    const obterCorFundo = (posicao) => {
        if (!destacarTop3) return '';
        
        switch (posicao) {
            case 1:
                return 'bg-yellow-50';  // Dourado claro
            case 2:
                return 'bg-gray-50';    // Prata claro
            case 3:
                return 'bg-orange-50';  // Bronze claro
            default:
                return '';
        }
    };
    
    /**
     * 💡 FORMATAR VALOR DA CÉLULA:
     * - Se coluna tem formatador, usa ele
     * - Senão, exibe valor direto
     */
    const formatarValor = (valor, coluna) => {
        if (coluna.formatador && typeof coluna.formatador === 'function') {
            return coluna.formatador(valor);
        }
        return valor;
    };
    
    /**
     * 💡 CLASSE DE ALINHAMENTO:
     * - Transforma 'left', 'center', 'right' em classe Tailwind
     */
    const obterClasseAlinhamento = (alinhamento) => {
        switch (alinhamento) {
            case 'left':
                return 'text-left';
            case 'center':
                return 'text-center';
            case 'right':
                return 'text-right';
            default:
                return 'text-left';
        }
    };
    
    // =========================================================================
    // 🎯 RENDERIZAÇÃO
    // =========================================================================
    
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Cabeçalho da Tabela */}
            {titulo && (
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Award className="text-primary-600" size={20} />
                        <h3 className="text-lg font-semibold text-gray-900">
                            {titulo}
                        </h3>
                    </div>
                </div>
            )}
            
            {/* Tabela (com scroll horizontal em mobile) */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* CABEÇALHO */}
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {/* Coluna de Posição */}
                            {mostrarPosicao && (
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                    #
                                </th>
                            )}
                            
                            {/* Colunas Dinâmicas */}
                            {colunas.map((coluna, index) => (
                                <th
                                    key={index}
                                    className={`
                                        px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider
                                        ${obterClasseAlinhamento(coluna.alinhamento)}
                                        ${coluna.largura || ''}
                                    `}
                                >
                                    {coluna.titulo}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    
                    {/* CORPO */}
                    <tbody className="divide-y divide-gray-200">
                        {/**
                         * 💡 MAP: Percorre dados e cria uma linha pra cada
                         * - index + 1 = posição (começa em 1, não 0)
                         * - key={index}: React precisa de key única
                         */}
                        {dados.map((item, index) => {
                            const posicao = index + 1;
                            
                            return (
                                <tr 
                                    key={index}
                                    className={`
                                        hover:bg-gray-50 transition-colors
                                        ${obterCorFundo(posicao)}
                                    `}
                                >
                                    {/* Coluna de Posição */}
                                    {mostrarPosicao && (
                                        <td className="px-4 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {obterMedalha(posicao)}
                                                <span className={`
                                                    font-semibold
                                                    ${posicao <= 3 ? 'text-primary-600' : 'text-gray-500'}
                                                `}>
                                                    {posicao}º
                                                </span>
                                            </div>
                                        </td>
                                    )}
                                    
                                    {/* Células Dinâmicas */}
                                    {colunas.map((coluna, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`
                                                px-6 py-4 text-sm
                                                ${obterClasseAlinhamento(coluna.alinhamento)}
                                                ${colIndex === 0 ? 'font-medium text-gray-900' : 'text-gray-600'}
                                            `}
                                        >
                                            {/**
                                             * 💡 ACESSAR VALOR:
                                             * - item[coluna.chave] = item['nome'] ou item['total']
                                             * - Permite acesso dinâmico às propriedades
                                             */}
                                            {formatarValor(item[coluna.chave], coluna)}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            {/* Rodapé (Total de registros) */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                    📊 {dados.length} {dados.length === 1 ? 'item' : 'itens'} no ranking
                </p>
            </div>
        </div>
    );
}

/**
 * =============================================================================
 * 📖 EXEMPLO DE USO:
 * =============================================================================
 * 
 * // 1️⃣ RANKING DE PRODUTOS
 * const produtosTop = [
 *   { nome: 'Pão Francês', total: 1500.00, quantidade: 300 },
 *   { nome: 'Bolo Chocolate', total: 980.00, quantidade: 45 },
 * ];
 * 
 * const colunasProdutos = [
 *   { 
 *     chave: 'nome', 
 *     titulo: 'Produto',
 *     alinhamento: 'left'
 *   },
 *   { 
 *     chave: 'quantidade', 
 *     titulo: 'Qtd Vendida',
 *     alinhamento: 'center'
 *   },
 *   { 
 *     chave: 'total', 
 *     titulo: 'Total (R$)',
 *     formatador: formatarMoeda,
 *     alinhamento: 'right'
 *   }
 * ];
 * 
 * <TabelaRanking
 *   dados={produtosTop}
 *   colunas={colunasProdutos}
 *   titulo="🏆 Top 10 Produtos Mais Vendidos"
 *   mostrarPosicao={true}
 *   destacarTop3={true}
 * />
 * 
 * // 2️⃣ RANKING DE FUNCIONÁRIOS
 * const funcionariosTop = [
 *   { nome: 'João Silva', vendas: 150, total: 4500.00 },
 *   { nome: 'Maria Santos', vendas: 142, total: 4260.00 },
 * ];
 * 
 * const colunasFuncionarios = [
 *   { chave: 'nome', titulo: 'Funcionário', alinhamento: 'left' },
 *   { chave: 'vendas', titulo: 'Nº Vendas', alinhamento: 'center' },
 *   { 
 *     chave: 'total', 
 *     titulo: 'Total Vendido',
 *     formatador: formatarMoeda,
 *     alinhamento: 'right'
 *   }
 * ];
 * 
 * <TabelaRanking
 *   dados={funcionariosTop}
 *   colunas={colunasFuncionarios}
 *   titulo="👥 Desempenho de Funcionários"
 * />
 * 
 * =============================================================================
 */

export default TabelaRanking;
