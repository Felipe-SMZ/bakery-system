// src/components/relatorios/GraficoBarra.jsx

/**
 * 📊 COMPONENTE: GRÁFICO DE BARRAS
 * 
 * =============================================================================
 * 🎓 AULA: COMO CRIAR UM GRÁFICO DE BARRAS (BAR CHART)
 * =============================================================================
 * 
 * 🎯 O QUE ESTE COMPONENTE FAZ:
 * - Compara valores entre categorias
 * - Barras verticais ou horizontais
 * - Fácil de ver qual é maior/menor
 * 
 * 📊 QUANDO USAR:
 * - Rankings (top 10 produtos, funcionários)
 * - Comparar categorias (vendas por tipo de produto)
 * - Mostrar diferenças absolutas (não porcentagem)
 * 
 * 💡 HORIZONTAL vs VERTICAL:
 * - Horizontal: melhor para nomes longos (produtos, clientes)
 * - Vertical: melhor para datas, números curtos
 * 
 * =============================================================================
 */

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';

/**
 * 🎨 CORES PARA BARRAS:
 * - Gradient de azul (claro → escuro)
 * - Primeiro lugar mais escuro, último mais claro
 */
const CORES_RANKING = [
    '#1e3a8a', // blue-900 (1º lugar)
    '#1e40af', // blue-800
    '#1d4ed8', // blue-700
    '#2563eb', // blue-600
    '#3b82f6', // blue-500
    '#60a5fa', // blue-400
    '#93c5fd', // blue-300
    '#bfdbfe', // blue-200
];

/**
 * 🎯 PROPS:
 * 
 * @param {Array} dados - Array de objetos
 * @param {String} chaveX - Propriedade para eixo X (categoria)
 * @param {String} chaveY - Propriedade para eixo Y (valor)
 * @param {String} titulo - Título do gráfico
 * @param {String} orientacao - 'horizontal' ou 'vertical'
 * @param {Boolean} mostrarRanking - Se true, colore por ranking
 * @param {Number} altura - Altura em pixels
 */
function GraficoBarra({ 
    dados, 
    chaveX, 
    chaveY, 
    titulo,
    orientacao = 'vertical',
    mostrarRanking = false,
    altura = 300 
}) {
    
    if (!dados || dados.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Sem dados para exibir</p>
            </div>
        );
    }
    
    /**
     * 🔧 TRANSFORMAR DADOS:
     * - Garantir que valores são numéricos (não strings)
     * - Backend pode enviar "2.00" (string) em vez de 2.00 (número)
     */
    const dadosFormatados = dados.map(item => ({
        ...item,
        [chaveY]: parseFloat(item[chaveY]) || 0
    }));
    
    /**
     * 💡 FORMATADOR DE MOEDA:
     */
    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(valor);
    };
    
    /**
     * 💡 TOOLTIP CUSTOMIZADO:
     * - Mais bonito que o padrão
     * - Mostra nome e valor formatado
     */
    const TooltipCustomizado = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const item = payload[0];
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-900 mb-1">
                        {item.payload[chaveX]}
                    </p>
                    <p className="text-sm text-gray-600">
                        {formatarMoeda(item.value)}
                    </p>
                </div>
            );
        }
        return null;
    };
    
    /**
     * 💡 RENDERIZAÇÃO CONDICIONAL:
     * - Horizontal: BarChart com layout="vertical"
     * - Vertical: BarChart normal
     * 
     * Por que separar:
     * - Eixos invertem (X vira Y e vice-versa)
     * - Barras horizontais melhor para textos longos
     */
    
    if (orientacao === 'horizontal') {
        return (
            <div className="w-full">
                {titulo && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {titulo}
                    </h3>
                )}
                
                <ResponsiveContainer width="100%" height={altura}>
                    <BarChart
                        data={dadosFormatados}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        
                        {/**
                         * 💡 HORIZONTAL: X é o valor, Y é a categoria
                         */}
                        <XAxis 
                            type="number"
                            tickFormatter={(value) => formatarMoeda(value)}
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                            dataKey={chaveX}
                            type="category"
                            width={150}
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        
                        <Tooltip content={<TooltipCustomizado />} />
                        
                        <Bar dataKey={chaveY} fill="#3b82f6" radius={[0, 8, 8, 0]}>
                            {/**
                             * 💡 SE mostrarRanking = true:
                             * - Cada barra tem cor diferente
                             * - Top 1 mais escuro, demais mais claros
                             */}
                            {mostrarRanking && dados.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`}
                                    fill={CORES_RANKING[index % CORES_RANKING.length]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                
                <div className="mt-2 text-sm text-gray-500 text-center">
                    📊 {dados.length} {dados.length === 1 ? 'item' : 'itens'}
                </div>
            </div>
        );
    }
    
    // VERTICAL (padrão)
    return (
        <div className="w-full">
            {titulo && (
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {titulo}
                </h3>
            )}
            
            <ResponsiveContainer width="100%" height={altura}>
                <BarChart
                    data={dadosFormatados}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    
                    {/**
                     * 💡 VERTICAL: X é a categoria, Y é o valor
                     */}
                    <XAxis 
                        dataKey={chaveX}
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                    />
                    <YAxis 
                        tickFormatter={(value) => formatarMoeda(value)}
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                    />
                    
                    <Tooltip content={<TooltipCustomizado />} />
                    
                    {/**
                     * 💡 BAR:
                     * - radius: bordas arredondadas [topLeft, topRight, bottomRight, bottomLeft]
                     * - [8, 8, 0, 0]: arredonda só o topo
                     */}
                    <Bar dataKey={chaveY} fill="#3b82f6" radius={[8, 8, 0, 0]}>
                        {mostrarRanking && dadosFormatados.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`}
                                fill={CORES_RANKING[index % CORES_RANKING.length]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-2 text-sm text-gray-500 text-center">
                📊 {dados.length} {dados.length === 1 ? 'item' : 'itens'}
            </div>
        </div>
    );
}

/**
 * =============================================================================
 * 📖 EXEMPLOS DE USO:
 * =============================================================================
 * 
 * // 1️⃣ RANKING DE PRODUTOS (HORIZONTAL)
 * const topProdutos = [
 *   { nome: 'Pão Francês', valor: 1500.00 },
 *   { nome: 'Bolo de Chocolate', valor: 980.00 },
 *   { nome: 'Sonho', valor: 750.00 },
 * ];
 * 
 * <GraficoBarra
 *   dados={topProdutos}
 *   chaveX="nome"
 *   chaveY="valor"
 *   titulo="Top 10 Produtos Mais Vendidos"
 *   orientacao="horizontal"
 *   mostrarRanking={true}
 *   altura={400}
 * />
 * 
 * // 2️⃣ VENDAS POR DIA (VERTICAL)
 * const vendasDia = [
 *   { dia: 'Seg', total: 450.00 },
 *   { dia: 'Ter', total: 520.00 },
 *   { dia: 'Qua', total: 380.00 },
 * ];
 * 
 * <GraficoBarra
 *   dados={vendasDia}
 *   chaveX="dia"
 *   chaveY="total"
 *   titulo="Vendas por Dia da Semana"
 *   orientacao="vertical"
 * />
 * 
 * =============================================================================
 */

export default GraficoBarra;
