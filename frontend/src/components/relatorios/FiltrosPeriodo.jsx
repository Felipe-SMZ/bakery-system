// src/components/relatorios/FiltrosPeriodo.jsx

/**
 * 📅 COMPONENTE: FILTROS DE PERÍODO
 * 
 * =============================================================================
 * 🎓 AULA: COMO CRIAR UM COMPONENTE DE FILTROS
 * =============================================================================
 * 
 * 🎯 O QUE ESTE COMPONENTE FAZ:
 * - Permite usuário escolher data início e data fim
 * - Botões de atalho (hoje, últimos 7 dias, este mês)
 * - Validação (data fim > data início)
 * - Emite evento quando filtro muda
 * 
 * 💡 CONCEITO: CONTROLLED COMPONENT
 * - Estado (valores) vive no componente PAI
 * - Este componente só renderiza e avisa quando muda
 * - Por que: múltiplos componentes podem precisar dos mesmos filtros
 * 
 * 📖 PADRÃO:
 * - Recebe: valores atuais via props
 * - Retorna: novos valores via callback (onChange)
 * - Pai decide o que fazer com os valores
 * 
 * =============================================================================
 */

import { useState, useEffect } from 'react';
import { Calendar, Filter, X } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

/**
 * 🎯 PROPS:
 * 
 * @param {Object} filtros - Objeto com valores atuais
 *   { dataInicio: '2025-11-01', dataFim: '2025-11-30' }
 * 
 * @param {Function} onChange - Callback quando filtro muda
 *   onChange({ dataInicio: '...', dataFim: '...' })
 * 
 * @param {Boolean} mostrarAtalhos - Se mostra botões de atalho
 * @param {Boolean} compacto - Layout menor (sem card)
 */
function FiltrosPeriodo({ 
    filtros, 
    onChange, 
    mostrarAtalhos = true,
    compacto = false 
}) {
    
    // =========================================================================
    // 🎯 ESTADOS LOCAIS (temporários, antes de aplicar)
    // =========================================================================
    
    /**
     * 💡 POR QUE ESTADO LOCAL:
     * - Usuário pode digitar/mudar sem aplicar ainda
     * - Só chama onChange quando clicar "Aplicar"
     * - Melhora performance (não busca dados a cada tecla)
     */
    const [dataInicio, setDataInicio] = useState(filtros.dataInicio || '');
    const [dataFim, setDataFim] = useState(filtros.dataFim || '');
    const [erro, setErro] = useState('');
    
    // =========================================================================
    // 🎯 SINCRONIZAR COM PROPS (se pai mudar filtros externamente)
    // =========================================================================
    
    /**
     * 💡 useEffect para sincronizar:
     * - Se pai mudar filtros (ex: usuário volta página), atualiza aqui
     * - Dependências: [filtros] = executa quando filtros mudarem
     */
    useEffect(() => {
        setDataInicio(filtros.dataInicio || '');
        setDataFim(filtros.dataFim || '');
    }, [filtros]);
    
    // =========================================================================
    // 🎯 FUNÇÕES DE VALIDAÇÃO
    // =========================================================================
    
    /**
     * Valida se as datas são válidas
     * 
     * REGRAS:
     * 1. Data fim deve ser >= data início
     * 2. Não pode ser data futura (opcional)
     * 3. Se só uma preenchida, preenche a outra automaticamente
     * 
     * @returns {Boolean} true se válido
     */
    const validarDatas = () => {
        // Limpa erro anterior
        setErro('');
        
        // Se nenhuma data, está ok (sem filtro)
        if (!dataInicio && !dataFim) {
            return true;
        }
        
        // Se só uma data, completa automaticamente
        if (dataInicio && !dataFim) {
            setDataFim(obterDataHoje());
            return true;
        }
        
        if (!dataInicio && dataFim) {
            // Define início como 30 dias antes
            const inicio = new Date(dataFim);
            inicio.setDate(inicio.getDate() - 30);
            setDataInicio(formatarData(inicio));
            return true;
        }
        
        // Validação: data fim >= data início
        if (new Date(dataFim) < new Date(dataInicio)) {
            setErro('Data final deve ser maior que a inicial');
            return false;
        }
        
        return true;
    };
    
    // =========================================================================
    // 🎯 FUNÇÕES AUXILIARES DE DATA
    // =========================================================================
    
    /**
     * 💡 FORMATAÇÃO DE DATAS:
     * - JavaScript usa Date objects
     * - HTML input[type="date"] usa formato YYYY-MM-DD
     * - Usuário vê formato brasileiro DD/MM/YYYY (feito pelo input)
     */
    
    /**
     * Retorna data de hoje no formato YYYY-MM-DD
     */
    const obterDataHoje = () => {
        return formatarData(new Date());
    };
    
    /**
     * Formata Date object para YYYY-MM-DD
     */
    const formatarData = (data) => {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    };
    
    /**
     * Retorna data X dias atrás
     */
    const obterDataPassada = (dias) => {
        const data = new Date();
        data.setDate(data.getDate() - dias);
        return formatarData(data);
    };
    
    /**
     * Retorna primeiro dia do mês atual
     */
    const obterPrimeiroDiaMes = () => {
        const data = new Date();
        data.setDate(1);
        return formatarData(data);
    };
    
    /**
     * Retorna último dia do mês atual
     */
    const obterUltimoDiaMes = () => {
        const data = new Date();
        data.setMonth(data.getMonth() + 1);
        data.setDate(0);
        return formatarData(data);
    };
    
    // =========================================================================
    // 🎯 HANDLERS (funções que lidam com eventos)
    // =========================================================================
    
    /**
     * Aplicar filtros (enviar pro pai)
     */
    const handleAplicar = () => {
        if (validarDatas()) {
            onChange({
                dataInicio,
                dataFim
            });
        }
    };
    
    /**
     * Limpar filtros
     */
    const handleLimpar = () => {
        setDataInicio('');
        setDataFim('');
        setErro('');
        onChange({
            dataInicio: '',
            dataFim: ''
        });
    };
    
    /**
     * 💡 ATALHOS: Funções pré-definidas para períodos comuns
     */
    const aplicarAtalho = (tipo) => {
        let inicio, fim;
        
        switch (tipo) {
            case 'hoje':
                inicio = obterDataHoje();
                fim = obterDataHoje();
                break;
            case 'ontem':
                inicio = obterDataPassada(1);
                fim = obterDataPassada(1);
                break;
            case 'ultimos7dias':
                inicio = obterDataPassada(7);
                fim = obterDataHoje();
                break;
            case 'ultimos30dias':
                inicio = obterDataPassada(30);
                fim = obterDataHoje();
                break;
            case 'esteMes':
                inicio = obterPrimeiroDiaMes();
                fim = obterUltimoDiaMes();
                break;
            default:
                return;
        }
        
        setDataInicio(inicio);
        setDataFim(fim);
        
        // Aplica automaticamente
        onChange({ dataInicio: inicio, dataFim: fim });
    };
    
    // =========================================================================
    // 🎯 RENDERIZAÇÃO
    // =========================================================================
    
    /**
     * 💡 LAYOUT COMPACTO vs NORMAL:
     * - Compacto: só os inputs inline (para sidebar, toolbar)
     * - Normal: dentro de um Card com atalhos
     */
    
    const conteudo = (
        <div className="space-y-4">
            {/* Inputs de Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Data Início */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Calendar size={16} className="inline mr-1" />
                        Data Início
                    </label>
                    <input
                        type="date"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                
                {/* Data Fim */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Calendar size={16} className="inline mr-1" />
                        Data Fim
                    </label>
                    <input
                        type="date"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>
            
            {/* Mensagem de Erro */}
            {erro && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">⚠️ {erro}</p>
                </div>
            )}
            
            {/* Atalhos Rápidos */}
            {mostrarAtalhos && (
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        Atalhos rápidos:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => aplicarAtalho('hoje')}
                        >
                            Hoje
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => aplicarAtalho('ontem')}
                        >
                            Ontem
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => aplicarAtalho('ultimos7dias')}
                        >
                            Últimos 7 dias
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => aplicarAtalho('ultimos30dias')}
                        >
                            Últimos 30 dias
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => aplicarAtalho('esteMes')}
                        >
                            Este mês
                        </Button>
                    </div>
                </div>
            )}
            
            {/* Botões de Ação */}
            <div className="flex justify-end gap-3">
                <Button
                    variant="secondary"
                    leftIcon={<X size={16} />}
                    onClick={handleLimpar}
                >
                    Limpar
                </Button>
                <Button
                    variant="primary"
                    leftIcon={<Filter size={16} />}
                    onClick={handleAplicar}
                >
                    Aplicar Filtros
                </Button>
            </div>
        </div>
    );
    
    /**
     * 💡 RENDERIZAÇÃO CONDICIONAL:
     * - Se compacto: retorna só o conteúdo
     * - Se normal: envolve em Card
     */
    if (compacto) {
        return conteudo;
    }
    
    return (
        <Card>
            <Card.Header>
                <div className="flex items-center gap-2">
                    <Filter size={20} className="text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Filtros de Período
                    </h3>
                </div>
            </Card.Header>
            <Card.Body>
                {conteudo}
            </Card.Body>
        </Card>
    );
}

/**
 * =============================================================================
 * 📖 EXEMPLO DE USO:
 * =============================================================================
 * 
 * // No componente pai (ex: Relatorios.jsx)
 * 
 * const [filtros, setFiltros] = useState({
 *   dataInicio: '',
 *   dataFim: ''
 * });
 * 
 * const handleFiltrosChange = (novosFiltros) => {
 *   setFiltros(novosFiltros);
 *   // Buscar dados com novos filtros
 *   buscarVendas(novosFiltros.dataInicio, novosFiltros.dataFim);
 * };
 * 
 * <FiltrosPeriodo
 *   filtros={filtros}
 *   onChange={handleFiltrosChange}
 *   mostrarAtalhos={true}
 * />
 * 
 * =============================================================================
 */

export default FiltrosPeriodo;
