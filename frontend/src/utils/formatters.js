// src/utils/formatters.js

/**
 * 🎨 FUNÇÕES DE FORMATAÇÃO
 * 
 * Essas funções transformam dados "crus" em formatos bonitos pra mostrar na tela.
 * Exemplo: 1500 vira "R$ 1.500,00"
 */

// ============================================================
// 💰 FORMATAR MOEDA
// ============================================================

/**
 * Formata um número para formato de moeda brasileira
 * 
 * @param {Number} valor - Valor a ser formatado
 * @returns {String} - Valor formatado (ex: "R$ 1.500,00")
 * 
 * Exemplo de uso:
 * formatarMoeda(1500) => "R$ 1.500,00"
 * formatarMoeda(0.5) => "R$ 0,50"
 */
export const formatarMoeda = (valor) => {
    // Se não tiver valor ou for inválido, retorna R$ 0,00
    if (!valor && valor !== 0) return 'R$ 0,00';

    // Converte o valor para número (remove possíveis strings)
    const numero = Number(valor);

    // Formata usando padrão brasileiro (pt-BR)
    return numero.toLocaleString('pt-BR', {
        style: 'currency',    // Formato de moeda
        currency: 'BRL'       // Real Brasileiro
    });
};

// ============================================================
// 📅 FORMATAR DATA
// ============================================================

/**
 * Formata uma data para formato brasileiro
 * 
 * @param {String} data - Data no formato ISO (2025-10-27)
 * @returns {String} - Data formatada (27/10/2025)
 * 
 * Exemplo de uso:
 * formatarData('2025-10-27') => "27/10/2025"
 */
export const formatarData = (data) => {
    if (!data) return '-';

    // Cria objeto Date a partir da string
    const dataObj = new Date(data);

    // Formata para padrão brasileiro
    return dataObj.toLocaleDateString('pt-BR');
};

// ============================================================
// 🕐 FORMATAR DATA E HORA
// ============================================================

/**
 * Formata data e hora completas
 * 
 * @param {String} dataHora - Data/hora ISO (2025-10-27T14:30:00)
 * @returns {String} - Formatado (27/10/2025 14:30)
 * 
 * Exemplo de uso:
 * formatarDataHora('2025-10-27T14:30:00') => "27/10/2025 14:30"
 */
export const formatarDataHora = (dataHora) => {
    if (!dataHora) return '-';

    const dataObj = new Date(dataHora);

    const data = dataObj.toLocaleDateString('pt-BR');
    const hora = dataObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return `${data} ${hora}`;
};

// ============================================================
// 📱 FORMATAR TELEFONE
// ============================================================

/**
 * Formata telefone para (XX) XXXXX-XXXX
 * 
 * @param {String} telefone - Telefone sem formatação
 * @returns {String} - Telefone formatado
 * 
 * Exemplo de uso:
 * formatarTelefone('11987654321') => "(11) 98765-4321"
 */
export const formatarTelefone = (telefone) => {
    if (!telefone) return '-';

    // Remove tudo que não é número
    const numeros = telefone.replace(/\D/g, '');

    // Aplica máscara (XX) XXXXX-XXXX
    if (numeros.length === 11) {
        return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    // Telefone fixo (XX) XXXX-XXXX
    if (numeros.length === 10) {
        return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return telefone;
};

// ============================================================
// 🔢 FORMATAR CEP
// ============================================================

/**
 * Formata CEP para XXXXX-XXX
 * 
 * @param {String} cep - CEP sem formatação
 * @returns {String} - CEP formatado
 * 
 * Exemplo de uso:
 * formatarCEP('01310100') => "01310-100"
 */
export const formatarCEP = (cep) => {
    if (!cep) return '-';

    // Remove tudo que não é número
    const numeros = cep.replace(/\D/g, '');

    // Aplica máscara XXXXX-XXX
    if (numeros.length === 8) {
        return numeros.replace(/(\d{5})(\d{3})/, '$1-$3');
    }

    return cep;
};

// ============================================================
// 🎨 FORMATAR STATUS (BADGE COLORIDO)
// ============================================================

/**
 * Retorna classe CSS baseada no status
 * 
 * @param {String} status - Status do cliente/venda
 * @returns {String} - Classe Tailwind CSS
 * 
 * Exemplo de uso:
 * getStatusColor('bom') => "bg-green-100 text-green-800"
 */
export const getStatusColor = (status) => {
    const cores = {
        'bom': 'bg-green-100 text-green-800',
        'medio': 'bg-yellow-100 text-yellow-800',
        'ruim': 'bg-red-100 text-red-800',
        'finalizada': 'bg-blue-100 text-blue-800',
        'pendente': 'bg-gray-100 text-gray-800',
        'cancelada': 'bg-red-100 text-red-800'
    };

    return cores[status] || 'bg-gray-100 text-gray-800';
};

// ============================================================
// 🔢 FORMATAR QUANTIDADE
// ============================================================

/**
 * Formata quantidade com unidade de medida
 * 
 * @param {Number} quantidade - Quantidade
 * @param {String} unidade - Unidade de medida
 * @returns {String} - Quantidade formatada
 * 
 * Exemplo de uso:
 * formatarQuantidade(10, 'unidade') => "10 un"
 * formatarQuantidade(2.5, 'kg') => "2,5 kg"
 */
export const formatarQuantidade = (quantidade, unidade) => {
    if (!quantidade && quantidade !== 0) return '-';

    const unidadeAbrev = {
        'unidade': 'un',
        'kg': 'kg',
        'fatia': 'fatias'
    };

    const qtd = Number(quantidade).toLocaleString('pt-BR');
    const un = unidadeAbrev[unidade] || unidade;

    return `${qtd} ${un}`;
};

// ============================================================
// 📊 FORMATAR PERCENTUAL
// ============================================================

/**
 * Formata número como percentual
 * 
 * @param {Number} valor - Valor decimal
 * @returns {String} - Percentual formatado
 * 
 * Exemplo de uso:
 * formatarPercentual(0.25) => "25%"
 * formatarPercentual(37.5) => "37,5%"
 */
export const formatarPercentual = (valor) => {
    if (!valor && valor !== 0) return '0%';

    return `${Number(valor).toFixed(1)}%`;
};

// ============================================================
// 🔤 CAPITALIZAR TEXTO
// ============================================================

/**
 * Deixa a primeira letra maiúscula
 * 
 * @param {String} texto - Texto para capitalizar
 * @returns {String} - Texto capitalizado
 * 
 * Exemplo de uso:
 * capitalizar('joão silva') => "João silva"
 */
export const capitalizar = (texto) => {
    if (!texto) return '';

    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};