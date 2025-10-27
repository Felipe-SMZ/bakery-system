// src/components/common/Input.jsx

/**
 * 📝 COMPONENTE INPUT
 * 
 * Campo de entrada de dados reutilizável.
 * Suporta: texto, número, email, telefone, CEP, etc.
 * 
 * Conceito: Controlled Components
 * - React controla o valor do input
 * - Valor vem de um state
 * - Mudanças atualizam o state
 */

import React from 'react';

/**
 * Componente Input
 * 
 * @param {Object} props
 * @param {String} props.label - Texto do label
 * @param {String} props.type - Tipo do input (text, number, email, etc)
 * @param {String} props.value - Valor atual
 * @param {Function} props.onChange - Função ao mudar valor
 * @param {String} props.placeholder - Texto placeholder
 * @param {String} props.error - Mensagem de erro
 * @param {Boolean} props.required - Campo obrigatório
 * @param {Boolean} props.disabled - Campo desabilitado
 * @param {String} props.className - Classes extras
 * 
 * Exemplo de uso:
 * <Input
 *   label="Nome do Produto"
 *   value={nome}
 *   onChange={(e) => setNome(e.target.value)}
 *   required
 * />
 */
const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    error = '',
    required = false,
    disabled = false,
    className = '',
    id,
    name,
    ...rest
}) => {

    // ============================================================
    // 🎨 GERAR ID AUTOMÁTICO
    // ============================================================

    /**
     * Se não passar ID, gera um baseado no name ou label
     * Necessário para conectar label com input (acessibilidade)
     */
    const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

    // ============================================================
    // 🎨 CLASSES CSS
    // ============================================================

    /**
     * Classes base do input
     */
    const baseClasses = `
    w-full px-4 py-2 
    border rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-all duration-200
  `;

    /**
     * Classes baseadas no estado
     */
    const stateClasses = error
        ? 'border-red-500 focus:ring-red-500'  // Com erro
        : 'border-gray-300 focus:border-blue-500';  // Normal

    /**
     * Classes quando desabilitado
     */
    const disabledClasses = disabled
        ? 'bg-gray-100 cursor-not-allowed opacity-60'
        : 'bg-white';

    /**
     * Junta todas as classes
     */
    const inputClasses = `
    ${baseClasses}
    ${stateClasses}
    ${disabledClasses}
    ${className}
  `.trim();

    // ============================================================
    // 🎯 RENDERIZAÇÃO
    // ============================================================

    return (
        <div className="w-full">
            {/* Label (se existir) */}
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                    {required && (
                        <span className="text-red-500 ml-1">*</span>
                    )}
                </label>
            )}

            {/* Input */}
            <input
                id={inputId}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={inputClasses}
                {...rest}
            />

            {/* Mensagem de erro (se existir) */}
            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

/**
 * ============================================================
 * 📱 COMPONENTE: INPUT COM MÁSCARA DE TELEFONE
 * ============================================================
 */

/**
 * Input específico para telefone com formatação automática
 * 
 * @param {Object} props - Mesmas props do Input normal
 * 
 * Exemplo de uso:
 * <Input.Telefone
 *   label="Telefone"
 *   value={telefone}
 *   onChange={(e) => setTelefone(e.target.value)}
 * />
 */
Input.Telefone = ({ value, onChange, ...rest }) => {
    /**
     * Formata telefone enquanto digita
     * (11) 98765-4321
     */
    const handleChange = (e) => {
        let valor = e.target.value.replace(/\D/g, ''); // Remove não-números

        // Limita a 11 dígitos
        valor = valor.substring(0, 11);

        // Aplica máscara
        if (valor.length <= 10) {
            // Telefone fixo: (11) 1234-5678
            valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            // Celular: (11) 98765-4321
            valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }

        // Cria evento modificado
        const event = {
            ...e,
            target: {
                ...e.target,
                value: valor
            }
        };

        onChange(event);
    };

    return (
        <Input
            type="tel"
            value={value}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
            {...rest}
        />
    );
};

/**
 * ============================================================
 * 🏠 COMPONENTE: INPUT COM MÁSCARA DE CEP
 * ============================================================
 */

/**
 * Input específico para CEP com formatação automática
 * 
 * Exemplo de uso:
 * <Input.CEP
 *   label="CEP"
 *   value={cep}
 *   onChange={(e) => setCep(e.target.value)}
 * />
 */
Input.CEP = ({ value, onChange, ...rest }) => {
    /**
     * Formata CEP enquanto digita
     * 01310-100
     */
    const handleChange = (e) => {
        let valor = e.target.value.replace(/\D/g, ''); // Remove não-números

        // Limita a 8 dígitos
        valor = valor.substring(0, 8);

        // Aplica máscara: 01310-100
        valor = valor.replace(/(\d{5})(\d{0,3})/, '$1-$2');

        const event = {
            ...e,
            target: {
                ...e.target,
                value: valor
            }
        };

        onChange(event);
    };

    return (
        <Input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="00000-000"
            maxLength={9}
            {...rest}
        />
    );
};

/**
 * ============================================================
 * 💰 COMPONENTE: INPUT PARA MOEDA
 * ============================================================
 */

/**
 * Input específico para valores monetários
 * 
 * Exemplo de uso:
 * <Input.Moeda
 *   label="Preço"
 *   value={preco}
 *   onChange={(e) => setPreco(e.target.value)}
 * />
 */
Input.Moeda = ({ value, onChange, ...rest }) => {
    /**
     * Formata moeda enquanto digita
     * Aceita: 10,50 ou 10.50
     */
    const handleChange = (e) => {
        let valor = e.target.value;

        // Remove tudo exceto números, vírgula e ponto
        valor = valor.replace(/[^\d,\.]/g, '');

        // Substitui ponto por vírgula
        valor = valor.replace('.', ',');

        // Permite apenas uma vírgula
        const partes = valor.split(',');
        if (partes.length > 2) {
            valor = partes[0] + ',' + partes.slice(1).join('');
        }

        // Limita casas decimais a 2
        if (partes[1] && partes[1].length > 2) {
            valor = partes[0] + ',' + partes[1].substring(0, 2);
        }

        const event = {
            ...e,
            target: {
                ...e.target,
                value: valor
            }
        };

        onChange(event);
    };

    return (
        <Input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="0,00"
            {...rest}
        />
    );
};

/**
 * ============================================================
 * 🔍 COMPONENTE: INPUT DE BUSCA
 * ============================================================
 */

/**
 * Input com ícone de busca
 * 
 * Exemplo de uso:
 * <Input.Busca
 *   placeholder="Buscar produto..."
 *   value={busca}
 *   onChange={(e) => setBusca(e.target.value)}
 * />
 */
Input.Busca = ({ className = '', ...rest }) => {
    return (
        <div className="relative">
            {/* Ícone de busca */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>

            {/* Input */}
            <Input
                type="text"
                className={`pl-10 ${className}`}
                {...rest}
            />
        </div>
    );
};

/**
 * ============================================================
 * 📤 EXPORTAR COMPONENTE
 * ============================================================
 */

export default Input;


/**
 * ============================================================
 * 📖 EXEMPLOS DE USO
 * ============================================================
 */

/**
 * EXEMPLO 1: Input Simples
 * 
 * const [nome, setNome] = useState('');
 * 
 * <Input
 *   label="Nome do Produto"
 *   value={nome}
 *   onChange={(e) => setNome(e.target.value)}
 *   placeholder="Digite o nome..."
 *   required
 * />
 */

/**
 * EXEMPLO 2: Input com Erro
 * 
 * <Input
 *   label="Preço"
 *   type="number"
 *   value={preco}
 *   onChange={(e) => setPreco(e.target.value)}
 *   error="Preço deve ser maior que zero"
 * />
 */

/**
 * EXEMPLO 3: Input de Telefone
 * 
 * <Input.Telefone
 *   label="Telefone"
 *   value={telefone}
 *   onChange={(e) => setTelefone(e.target.value)}
 *   required
 * />
 */

/**
 * EXEMPLO 4: Input de CEP
 * 
 * <Input.CEP
 *   label="CEP"
 *   value={cep}
 *   onChange={(e) => setCep(e.target.value)}
 * />
 */

/**
 * EXEMPLO 5: Input de Moeda
 * 
 * <Input.Moeda
 *   label="Preço Base"
 *   value={preco}
 *   onChange={(e) => setPreco(e.target.value)}
 * />
 */

/**
 * EXEMPLO 6: Input de Busca
 * 
 * <Input.Busca
 *   placeholder="Buscar produtos..."
 *   value={busca}
 *   onChange={(e) => setBusca(e.target.value)}
 * />
 */