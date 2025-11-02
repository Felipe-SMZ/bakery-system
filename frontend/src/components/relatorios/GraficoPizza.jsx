// src/components/relatorios/GraficoPizza.jsx

/**
 * 🥧 COMPONENTE: GRÁFICO DE PIZZA
 * 
 * =============================================================================
 * 🎓 AULA: COMO CRIAR UM GRÁFICO DE PIZZA (PIE CHART)
 * =============================================================================
 * 
 * 🎯 O QUE ESTE COMPONENTE FAZ:
 * - Mostra distribuição em porcentagem (partes de um todo)
 * - Círculo dividido em fatias coloridas
 * - Cada fatia = uma categoria
 * 
 * 📊 QUANDO USAR:
 * - Mostrar proporções (50% dinheiro, 30% cartão, 20% pix)
 * - Comparar partes de um total
 * - Distribuição de vendas, categorias, etc
 * 
 * ⚠️ QUANDO NÃO USAR:
 * - Mais de 5-6 categorias (fica confuso)
 * - Comparar valores absolutos (use barra)
 * - Mostrar tendências no tempo (use linha)
 * 
 * =============================================================================
 */

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

/**
 * 💡 EXPLICAÇÃO DOS IMPORTS:
 * 
 * - PieChart: Container do gráfico de pizza
 * - Pie: A pizza em si (pode ter várias, tipo rosquinha)
 * - Cell: Célula individual (uma fatia) com cor própria
 * - Tooltip: Caixa que aparece ao passar mouse
 * - Legend: Legenda com cores
 * - ResponsiveContainer: Responsivo
 */

/**
 * 🎨 PALETA DE CORES:
 * - Array de cores hexadecimais
 * - Cada fatia pega uma cor diferente
 * - Cores do Tailwind (bonitas e acessíveis)
 */
const CORES = [
    '#3b82f6', // blue-500
    '#10b981', // green-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#f97316', // orange-500
];

/**
 * 🎯 PROPS:
 * 
 * @param {Array} dados - Array de objetos
 *   Exemplo: [
 *     { nome: 'Dinheiro', valor: 1500.00, quantidade: 50 },
 *     { nome: 'Cartão', valor: 2400.00, quantidade: 80 },
 *   ]
 * 
 * @param {String} chaveNome - Propriedade do nome (ex: 'nome')
 * @param {String} chaveValor - Propriedade do valor (ex: 'valor')
 * @param {String} titulo - Título do gráfico
 * @param {Number} altura - Altura em pixels
 */
function GraficoPizza({ 
    dados, 
    chaveNome, 
    chaveValor, 
    titulo,
    altura = 300 
}) {
    
    /**
     * 💡 VALIDAÇÃO:
     */
    if (!dados || dados.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Sem dados para exibir</p>
            </div>
        );
    }
    
    /**
     * � TRANSFORMAR DADOS:
     * - Garantir que valores são numéricos
     */
    const dadosFormatados = dados.map(item => ({
        ...item,
        [chaveValor]: parseFloat(item[chaveValor]) || 0
    }));
    
    /**
     * �💡 FORMATADORES:
     * - formatarMoeda: R$ 1.234,56
     * - formatarPorcentagem: 45.5%
     */
    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };
    
    const formatarPorcentagem = (valor, total) => {
        const percentual = (valor / total) * 100;
        return `${percentual.toFixed(1)}%`;
    };
    
    /**
     * 💡 CALCULAR TOTAL:
     * - Soma todos os valores
     * - Usado para calcular porcentagens
     * - reduce: função que "reduz" array a um valor
     */
    const total = dadosFormatados.reduce((acc, item) => acc + item[chaveValor], 0);
    
    /**
     * 💡 TOOLTIP CUSTOMIZADO:
     * - Recharts permite criar tooltip totalmente customizado
     * - Mostra: nome, valor (R$), porcentagem (%)
     * - active: true quando mouse está em cima
     * - payload: dados da fatia
     */
    const TooltipCustomizado = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const item = payload[0];
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-900">
                        {item.name}
                    </p>
                    <p className="text-sm text-gray-600">
                        Valor: {formatarMoeda(item.value)}
                    </p>
                    <p className="text-sm text-gray-600">
                        Percentual: {formatarPorcentagem(item.value, total)}
                    </p>
                </div>
            );
        }
        return null;
    };
    
    /**
     * 💡 LABEL CUSTOMIZADO:
     * - Texto que aparece nas fatias
     * - Mostra porcentagem
     * - Só aparece se fatia for grande (> 5%)
     */
    const renderLabel = (entry) => {
        const percentual = (entry[chaveValor] / total) * 100;
        // Só mostra label se fatia for > 5%
        if (percentual > 5) {
            return `${percentual.toFixed(0)}%`;
        }
        return '';
    };
    
    return (
        <div className="w-full">
            {/* Título */}
            {titulo && (
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {titulo}
                </h3>
            )}
            
            <ResponsiveContainer width="100%" height={altura}>
                <PieChart>
                    {/**
                     * 💡 Pie (a pizza):
                     * - data: dados
                     * - dataKey: qual valor usar para tamanho
                     * - nameKey: qual valor usar para nome
                     * - cx/cy: centro (50% = meio)
                     * - outerRadius: raio externo
                     * - fill: cor (sobrescrita por Cell)
                     * - label: função para renderizar labels
                     */}
                    <Pie
                        data={dadosFormatados}
                        dataKey={chaveValor}
                        nameKey={chaveNome}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label={renderLabel}
                        labelLine={false}
                    >
                        {/**
                         * 💡 Cell (fatia individual):
                         * - Cada fatia pode ter cor diferente
                         * - map: percorre dados e cria uma Cell pra cada
                         * - CORES[index % CORES.length]: pega cor circular
                         *   (se tiver mais fatias que cores, volta pro início)
                         */}
                        {dadosFormatados.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={CORES[index % CORES.length]}
                            />
                        ))}
                    </Pie>
                    
                    {/* Tooltip customizado */}
                    <Tooltip content={<TooltipCustomizado />} />
                    
                    {/**
                     * 💡 Legend:
                     * - verticalAlign: top/bottom
                     * - height: espaço reservado
                     * - iconType: formato do ícone (circle, square, etc)
                     */}
                    <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                    />
                </PieChart>
            </ResponsiveContainer>
            
            {/* Resumo */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                        {formatarMoeda(total)}
                    </span>
                </div>
            </div>
        </div>
    );
}

/**
 * =============================================================================
 * 📖 EXEMPLO DE USO:
 * =============================================================================
 * 
 * const dadosPagamento = [
 *   { forma: 'Dinheiro', valor: 1500.00 },
 *   { forma: 'Cartão', valor: 2400.00 },
 *   { forma: 'PIX', valor: 800.00 },
 *   { forma: 'Fiado', valor: 300.00 },
 * ];
 * 
 * <GraficoPizza
 *   dados={dadosPagamento}
 *   chaveNome="forma"
 *   chaveValor="valor"
 *   titulo="Distribuição por Forma de Pagamento"
 *   altura={350}
 * />
 * 
 * =============================================================================
 */

export default GraficoPizza;
