// src/components/relatorios/GraficoLinha.jsx

/**
 * 📈 COMPONENTE: GRÁFICO DE LINHA
 * 
 * =============================================================================
 * 🎓 AULA: COMO CRIAR UM GRÁFICO DE LINHA
 * =============================================================================
 * 
 * 🎯 O QUE ESTE COMPONENTE FAZ:
 * - Mostra evolução de vendas ao longo do tempo
 * - Linha conectando os pontos (como um ECG médico)
 * - Interativo: hover mostra valores exatos
 * 
 * 📊 QUANDO USAR:
 * - Mostrar tendências ao longo do tempo
 * - Vendas diárias, semanais, mensais
 * - Comparar períodos
 * 
 * 🔧 BIBLIOTECA: Recharts
 * - Por que: simples, responsiva, bonita
 * - Alternativas: Chart.js, D3.js (mais complexas)
 * 
 * =============================================================================
 */

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

/**
 * 💡 EXPLICAÇÃO DOS IMPORTS:
 * 
 * - LineChart: Container principal do gráfico
 * - Line: A linha em si (pode ter várias)
 * - XAxis: Eixo horizontal (datas, categorias)
 * - YAxis: Eixo vertical (valores, R$)
 * - CartesianGrid: Grade de fundo (linhas tracejadas)
 * - Tooltip: Caixa que aparece ao passar mouse
 * - Legend: Legenda (cores = o que significa)
 * - ResponsiveContainer: Faz gráfico crescer/diminuir com tela
 */

/**
 * 🎯 PROPS (parâmetros que o componente recebe):
 * 
 * @param {Array} dados - Array de objetos com os dados
 *   Exemplo: [
 *     { data: '01/11', vendas: 450.00, quantidade: 15 },
 *     { data: '02/11', vendas: 520.00, quantidade: 18 },
 *   ]
 * 
 * @param {String} chaveX - Nome da propriedade para eixo X (ex: 'data')
 * @param {String} chaveY - Nome da propriedade para eixo Y (ex: 'vendas')
 * @param {String} titulo - Título do gráfico
 * @param {String} cor - Cor da linha (hex, ex: '#3b82f6')
 * @param {Number} altura - Altura do gráfico em pixels (padrão: 300)
 */
function GraficoLinha({ 
    dados, 
    chaveX, 
    chaveY, 
    titulo, 
    cor = '#3b82f6',
    altura = 300 
}) {
    
    /**
     * 💡 VALIDAÇÃO:
     * - Sempre valide se tem dados antes de renderizar
     * - Evita crashes se API não retornar nada
     */
    if (!dados || dados.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Sem dados para exibir</p>
            </div>
        );
    }
    
    /**
     * 🔧 TRANSFORMAR DADOS:
     * - Garantir que valores Y são numéricos
     */
    const dadosFormatados = dados.map(item => ({
        ...item,
        [chaveY]: parseFloat(item[chaveY]) || 0
    }));
    
    /**
     * 💡 FORMATADOR CUSTOMIZADO:
     * - Formata valores no tooltip (R$ 1.234,56)
     * - Tooltip padrão mostra só números feios
     */
    const formatarValor = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };
    
    return (
        <div className="w-full">
            {/* Título do gráfico */}
            {titulo && (
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {titulo}
                </h3>
            )}
            
            {/**
             * 💡 ResponsiveContainer:
             * - width="100%": ocupa toda largura disponível
             * - height={altura}: altura fixa em pixels
             * - Sem isso, gráfico não aparece (bug do Recharts)
             */}
            <ResponsiveContainer width="100%" height={altura}>
                <LineChart
                    data={dadosFormatados}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    {/**
                     * 💡 CartesianGrid:
                     * - strokeDasharray="3 3": linha tracejada (3px linha, 3px espaço)
                     * - Opcional, mas deixa bonito
                     */}
                    <CartesianGrid strokeDasharray="3 3" />
                    
                    {/**
                     * 💡 XAxis (eixo horizontal):
                     * - dataKey: qual propriedade usar (ex: 'data')
                     * - stroke: cor do texto
                     * - style: estilo do texto
                     */}
                    <XAxis 
                        dataKey={chaveX}
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                    />
                    
                    {/**
                     * 💡 YAxis (eixo vertical):
                     * - tickFormatter: função para formatar valores
                     * - Sem isso mostra: 450, 520, 600
                     * - Com isso mostra: R$ 450,00, R$ 520,00
                     */}
                    <YAxis 
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => formatarValor(value)}
                    />
                    
                    {/**
                     * 💡 Tooltip (caixa ao passar mouse):
                     * - formatter: formata valores
                     * - labelStyle: estilo do label (data)
                     * - contentStyle: estilo da caixa
                     */}
                    <Tooltip 
                        formatter={(value) => formatarValor(value)}
                        labelStyle={{ color: '#111827' }}
                        contentStyle={{ 
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                        }}
                    />
                    
                    {/**
                     * 💡 Legend (legenda):
                     * - Mostra o que cada cor significa
                     * - Opcional se só tem uma linha
                     */}
                    <Legend />
                    
                    {/**
                     * 💡 Line (a linha em si):
                     * - type: tipo de curva
                     *   - "monotone": suave, curvada
                     *   - "linear": reta, sem curvas
                     *   - "step": escada
                     * - dataKey: qual propriedade plotar
                     * - stroke: cor da linha
                     * - strokeWidth: espessura
                     * - dot: bolinhas nos pontos
                     * - activeDot: bolinha maior ao passar mouse
                     */}
                    <Line 
                        type="monotone"
                        dataKey={chaveY}
                        stroke={cor}
                        strokeWidth={2}
                        dot={{ fill: cor, r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Valor Total"
                    />
                </LineChart>
            </ResponsiveContainer>
            
            {/* Informação adicional */}
            <div className="mt-2 text-sm text-gray-500 text-center">
                📊 {dados.length} ponto{dados.length !== 1 ? 's' : ''} no período
            </div>
        </div>
    );
}

/**
 * =============================================================================
 * 📖 EXEMPLO DE USO:
 * =============================================================================
 * 
 * import GraficoLinha from '../components/relatorios/GraficoLinha';
 * 
 * const dadosVendas = [
 *   { data: '01/11', total: 450.00 },
 *   { data: '02/11', total: 520.00 },
 *   { data: '03/11', total: 380.00 },
 * ];
 * 
 * <GraficoLinha
 *   dados={dadosVendas}
 *   chaveX="data"
 *   chaveY="total"
 *   titulo="Vendas nos Últimos 7 Dias"
 *   cor="#10b981"
 *   altura={350}
 * />
 * 
 * =============================================================================
 */

export default GraficoLinha;
