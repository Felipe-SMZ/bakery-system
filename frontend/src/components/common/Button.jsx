// src/components/common/Button.jsx

/**
 * 🔘 COMPONENTE BUTTON
 * 
 * Um botão reutilizável com diferentes variantes e tamanhos.
 * 
 * O que são Props?
 * - São parâmetros que você passa pro componente
 * - Como argumentos de função
 * - Exemplo: <Button texto="Salvar" cor="azul" />
 */

import React from 'react';

/**
 * Componente Button
 * 
 * @param {Object} props - Propriedades do componente
 * @param {String} props.children - Texto/conteúdo do botão
 * @param {String} props.variant - Estilo: 'primary', 'secondary', 'danger'
 * @param {String} props.size - Tamanho: 'sm', 'md', 'lg'
 * @param {Boolean} props.disabled - Desabilitar botão
 * @param {Function} props.onClick - Função ao clicar
 * @param {String} props.type - Tipo HTML: 'button', 'submit'
 * @param {String} props.className - Classes CSS extras
 * 
 * Exemplo de uso:
 * <Button variant="primary" onClick={salvar}>
 *   Salvar
 * </Button>
 */
const Button = ({
    children,           // Texto dentro do botão
    variant = 'primary', // Padrão: azul
    size = 'md',        // Padrão: médio
    disabled = false,   // Padrão: habilitado
    onClick,            // Função ao clicar
    type = 'button',    // Padrão: button
    className = '',     // Classes extras
    leftIcon,           // Ícone à esquerda (componente)
    rightIcon,          // Ícone à direita (componente)
    ...rest             // Outras props (spread operator)
}) => {

    // ============================================================
    // 🎨 CLASSES CSS BASEADAS NAS PROPS
    // ============================================================

    /**
     * Classes base (sempre aplicadas)
     */
    const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    /**
     * Classes de variante (cor)
     */
    const variantClasses = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
        success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
        warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    };

    /**
     * Classes de tamanho
     */
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    /**
     * Classes quando desabilitado
     */
    const disabledClasses = disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'cursor-pointer';

    /**
     * Junta todas as classes
     */
    const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${disabledClasses}
    ${className}
  `.trim();

    // ============================================================
    // 🎯 MANIPULADOR DE CLIQUE
    // ============================================================

    /**
     * Função que executa ao clicar
     * Se o botão estiver desabilitado, não faz nada
     */
    const handleClick = (event) => {
        if (disabled) {
            event.preventDefault();
            return;
        }

        // Se foi passada uma função onClick, executa
        if (onClick) {
            onClick(event);
        }
    };

    // ============================================================
    // 🎨 RENDERIZAÇÃO
    // ============================================================

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={handleClick}
            disabled={disabled}
            {...rest} // Passa todas as outras props (id, name, etc)
        >
            <span className="flex items-center justify-center gap-2">
                {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                {children}
                {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
            </span>
        </button>
    );
};

// ============================================================
// 📤 EXPORTAR COMPONENTE
// ============================================================

export default Button;


// ============================================================
// 📖 EXEMPLOS DE USO
// ============================================================

/**
 * EXEMPLO 1: Botão Primário Simples
 * 
 * <Button onClick={() => console.log('Clicou!')}>
 *   Clique Aqui
 * </Button>
 */

/**
 * EXEMPLO 2: Botão de Deletar
 * 
 * <Button 
 *   variant="danger" 
 *   size="sm"
 *   onClick={deletarProduto}
 * >
 *   Excluir
 * </Button>
 */

/**
 * EXEMPLO 3: Botão Desabilitado
 * 
 * <Button disabled>
 *   Salvando...
 * </Button>
 */

/**
 * EXEMPLO 4: Botão de Submit em Form
 * 
 * <Button type="submit" variant="success">
 *   Cadastrar
 * </Button>
 */

/**
 * EXEMPLO 5: Botão com Classes Extras
 * 
 * <Button 
 *   variant="outline" 
 *   className="w-full"
 * >
 *   Botão Largo
 * </Button>
 */