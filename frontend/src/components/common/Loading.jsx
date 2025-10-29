// src/components/common/Loading.jsx

/**
 * ⏳ COMPONENTE LOADING
 * 
 * Indicador de carregamento (spinner).
 * Usado enquanto dados estão sendo buscados.
 */

import React from 'react';

/**
 * Componente Loading
 * 
 * @param {String} size - Tamanho: 'sm', 'md', 'lg' (padrão: 'md')
 * @param {String} text - Texto de carregamento (opcional)
 */
const Loading = ({ size = 'md', text = 'Carregando...' }) => {

    // ══════════════════════════════════════════════════════════
    // 🎨 TAMANHOS
    // ══════════════════════════════════════════════════════════

    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    const spinnerSize = sizes[size] || sizes.md;

    // ══════════════════════════════════════════════════════════
    // 🎨 RENDERIZAÇÃO
    // ══════════════════════════════════════════════════════════

    return (
        <div className="flex flex-col items-center justify-center p-8">
            {/**
       * Spinner animado
       * - border-t-primary-500: Borda colorida no topo
       * - animate-spin: Animação de rotação
       */}
            <div
                className={`
          ${spinnerSize}
          border-gray-200
          border-t-primary-500
          rounded-full
          animate-spin
        `}
            />

            {/**
       * Texto de carregamento
       */}
            {text && (
                <p className="mt-4 text-gray-600 text-sm">
                    {text}
                </p>
            )}
        </div>
    );
};

export default Loading;