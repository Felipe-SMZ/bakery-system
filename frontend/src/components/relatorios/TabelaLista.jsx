// src/components/relatorios/TabelaLista.jsx

/**
 * 📋 COMPONENTE: TABELA DE LISTAGEM
 * 
 * =============================================================================
 * 🎓 AULA: DIFERENÇA ENTRE RANKING E LISTAGEM
 * =============================================================================
 * 
 * 🏆 TabelaRanking:
 * - Exibe TOP items (melhores, maiores...)
 * - Tem posição (#1, #2, #3...)
 * - Destaca TOP 3 com medalhas
 * 
 * 📋 TabelaLista (esta):
 * - Exibe TODOS os items
 * - Sem ranking/posição
 * - Pode ter badges de status (⚠️ crítico, 🔴 urgente...)
 * - Útil para: devedores, estoque baixo, alertas...
 * 
 * =============================================================================
 */

import { AlertTriangle, Package, User, TrendingDown, PackageX, BarChart3 } from 'lucide-react';
import { formatarMoeda, formatarData } from '../../utils/formatters';

/**
 * 🎯 PROPS:
 * 
 * @param {Array} dados - Array de objetos
 * @param {Array} colunas - Definição das colunas (igual TabelaRanking)
 * @param {String} titulo - Título da tabela
 * @param {String} icone - Qual ícone mostrar ('alerta', 'pacote', 'usuario')
 * @param {Function} renderBadge - Função pra renderizar badge customizado
 *   Exemplo: (item) => item.divida > 100 ? <Badge cor="vermelho" /> : null
 * @param {String} corDestaque - Cor do cabeçalho ('amarelo', 'vermelho', 'azul')
 * @param {String} mensagemVazio - Mensagem quando sem dados
 */
function TabelaLista({ 
    dados, 
    colunas,
    titulo,
    icone = 'alerta',
    renderBadge = null,
    corDestaque = 'amarelo',
    mensagemVazio = 'Nenhum registro encontrado'
}) {
    
    // =========================================================================
    // 🎯 ÍCONES DISPONÍVEIS
    // =========================================================================
    
    const icones = {
        alerta: AlertTriangle,
        pacote: Package,
        usuario: User,
        tendencia: TrendingDown,
        estoque: PackageX,
        grafico: BarChart3
    };
    
    const IconeEscolhido = icones[icone] || AlertTriangle;
    
    // =========================================================================
    // 🎯 CORES DE DESTAQUE
    // =========================================================================
    
    /**
     * 💡 MAPA DE CORES:
     * - Amarelo: avisos, estoque baixo
     * - Vermelho: crítico, dívidas altas
     * - Azul: informativo
     * - Verde: positivo
     */
    const cores = {
        amarelo: {
            bg: 'bg-yellow-50',
            borda: 'border-yellow-200',
            texto: 'text-yellow-700',
            icone: 'text-yellow-600'
        },
        vermelho: {
            bg: 'bg-red-50',
            borda: 'border-red-200',
            texto: 'text-red-700',
            icone: 'text-red-600'
        },
        azul: {
            bg: 'bg-blue-50',
            borda: 'border-blue-200',
            texto: 'text-blue-700',
            icone: 'text-blue-600'
        },
        verde: {
            bg: 'bg-green-50',
            borda: 'border-green-200',
            texto: 'text-green-700',
            icone: 'text-green-600'
        }
    };
    
    const corSelecionada = cores[corDestaque] || cores.amarelo;
    
    // =========================================================================
    // 🎯 FUNÇÕES AUXILIARES
    // =========================================================================
    
    const formatarValor = (valor, coluna) => {
        if (coluna.formatador && typeof coluna.formatador === 'function') {
            return coluna.formatador(valor);
        }
        return valor;
    };
    
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
    // 🎯 VALIDAÇÃO
    // =========================================================================
    
    /**
     * 💡 VALIDAÇÃO ROBUSTA:
     * - Verifica se dados existe
     * - Verifica se é array
     * - Verifica se tem itens
     */
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
    // 🎯 RENDERIZAÇÃO
    // =========================================================================
    
    return (
        <div className={`
            bg-white rounded-lg border-2 overflow-hidden
            ${corSelecionada.borda}
        `}>
            {/* Cabeçalho com Cor de Destaque */}
            {titulo && (
                <div className={`
                    px-6 py-4 border-b-2
                    ${corSelecionada.bg} ${corSelecionada.borda}
                `}>
                    <div className="flex items-center gap-3">
                        <IconeEscolhido 
                            className={corSelecionada.icone} 
                            size={24} 
                        />
                        <h3 className={`
                            text-lg font-semibold
                            ${corSelecionada.texto}
                        `}>
                            {titulo}
                        </h3>
                        {/* Badge com Total */}
                        <span className={`
                            ml-auto px-3 py-1 rounded-full text-sm font-semibold
                            ${corSelecionada.bg} ${corSelecionada.texto}
                            border ${corSelecionada.borda}
                        `}>
                            {dados.length}
                        </span>
                    </div>
                </div>
            )}
            
            {/* Tabela */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* CABEÇALHO */}
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
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
                            
                            {/* Coluna de Badge (se existir função render) */}
                            {renderBadge && (
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center w-24">
                                    Status
                                </th>
                            )}
                        </tr>
                    </thead>
                    
                    {/* CORPO */}
                    <tbody className="divide-y divide-gray-200">
                        {dados.map((item, index) => (
                            <tr 
                                key={index}
                                className="hover:bg-gray-50 transition-colors"
                            >
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
                                        {formatarValor(item[coluna.chave], coluna)}
                                    </td>
                                ))}
                                
                                {/* Célula de Badge */}
                                {renderBadge && (
                                    <td className="px-6 py-4 text-center">
                                        {/**
                                         * 💡 RENDER BADGE:
                                         * - Função que recebe o item completo
                                         * - Retorna JSX customizado (badge, ícone...)
                                         * - Permite lógica condicional (if dívida > 100...)
                                         */}
                                        {renderBadge(item)}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/**
 * =============================================================================
 * 📖 EXEMPLO DE USO:
 * =============================================================================
 * 
 * // 1️⃣ CLIENTES DEVEDORES
 * const devedores = [
 *   { nome: 'João Silva', divida: 150.00, telefone: '11 99999-9999' },
 *   { nome: 'Maria Santos', divida: 320.50, telefone: '11 88888-8888' },
 * ];
 * 
 * const colunasDevedores = [
 *   { chave: 'nome', titulo: 'Cliente', alinhamento: 'left' },
 *   { chave: 'telefone', titulo: 'Telefone', alinhamento: 'center' },
 *   { 
 *     chave: 'divida', 
 *     titulo: 'Dívida (R$)',
 *     formatador: formatarMoeda,
 *     alinhamento: 'right'
 *   }
 * ];
 * 
 * // Função pra renderizar badge de criticidade
 * const renderBadgeDivida = (cliente) => {
 *   if (cliente.divida > 200) {
 *     return (
 *       <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
 *         🔴 Crítico
 *       </span>
 *     );
 *   }
 *   if (cliente.divida > 100) {
 *     return (
 *       <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
 *         ⚠️ Atenção
 *       </span>
 *     );
 *   }
 *   return (
 *     <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
 *       ℹ️ Normal
 *     </span>
 *   );
 * };
 * 
 * <TabelaLista
 *   dados={devedores}
 *   colunas={colunasDevedores}
 *   titulo="💰 Clientes com Crédito Pendente"
 *   icone="usuario"
 *   corDestaque="vermelho"
 *   renderBadge={renderBadgeDivida}
 * />
 * 
 * // 2️⃣ PRODUTOS COM ESTOQUE BAIXO
 * const estoqueBaixo = [
 *   { nome: 'Pão Francês', estoque: 5, minimo: 20 },
 *   { nome: 'Leite', estoque: 2, minimo: 10 },
 * ];
 * 
 * const colunasEstoque = [
 *   { chave: 'nome', titulo: 'Produto', alinhamento: 'left' },
 *   { chave: 'estoque', titulo: 'Qtd Atual', alinhamento: 'center' },
 *   { chave: 'minimo', titulo: 'Qtd Mínima', alinhamento: 'center' }
 * ];
 * 
 * const renderBadgeEstoque = (produto) => {
 *   const percentual = (produto.estoque / produto.minimo) * 100;
 *   
 *   if (percentual < 25) {
 *     return <span className="text-2xl">🔴</span>;
 *   }
 *   if (percentual < 50) {
 *     return <span className="text-2xl">⚠️</span>;
 *   }
 *   return <span className="text-2xl">⚡</span>;
 * };
 * 
 * <TabelaLista
 *   dados={estoqueBaixo}
 *   colunas={colunasEstoque}
 *   titulo="📦 Produtos com Estoque Baixo"
 *   icone="pacote"
 *   corDestaque="amarelo"
 *   renderBadge={renderBadgeEstoque}
 * />
 * 
 * =============================================================================
 */

export default TabelaLista;
