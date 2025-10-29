// frontend/tailwind.config.js

/**
 * 🎨 CONFIGURAÇÃO DE TEMA - SISTEMA DE PADARIA
 * 
 * Paleta de cores personalizada para o sistema.
 * Baseada em tons quentes (padaria/alimentos) com toques modernos.
 */

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // ═══════════════════════════════════════════════════════════
            // 🎨 PALETA DE CORES PERSONALIZADA
            // ═══════════════════════════════════════════════════════════
            colors: {
                // ───────────────────────────────────────────────────────
                // 🟠 COR PRIMÁRIA - Laranja Quente (Pão Assado)
                // Usada em: Botões principais, destaques, links
                // ───────────────────────────────────────────────────────
                primary: {
                    50: '#fff7ed',   // Mais claro
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',   // ← Base (laranja)
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',   // Mais escuro
                    950: '#431407',
                },

                // ───────────────────────────────────────────────────────
                // 🟤 COR SECUNDÁRIA - Marrom Chocolate
                // Usada em: Textos importantes, sidebar ativa
                // ───────────────────────────────────────────────────────
                secondary: {
                    50: '#fdf8f6',
                    100: '#f2e8e5',
                    200: '#eaddd7',
                    300: '#e0cec7',
                    400: '#d2bab0',
                    500: '#bfa094',
                    600: '#a18072',
                    700: '#977669',   // ← Base (marrom)
                    800: '#846358',
                    900: '#43302b',
                },

                // ───────────────────────────────────────────────────────
                // 🟢 SUCESSO - Verde
                // Usada em: Mensagens de sucesso, status positivo
                // ───────────────────────────────────────────────────────
                success: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',   // ← Base
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },

                // ───────────────────────────────────────────────────────
                // 🔴 PERIGO - Vermelho
                // Usada em: Deletar, erros, alertas críticos
                // ───────────────────────────────────────────────────────
                danger: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',   // ← Base
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                },

                // ───────────────────────────────────────────────────────
                // 🟡 AVISO - Amarelo
                // Usada em: Alertas, pendências
                // ───────────────────────────────────────────────────────
                warning: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',   // ← Base
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },

                // ───────────────────────────────────────────────────────
                // ⚪ CINZAS - Neutros
                // Usada em: Textos, fundos, bordas
                // ───────────────────────────────────────────────────────
                gray: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                    950: '#030712',
                },
            },

            // ═══════════════════════════════════════════════════════════
            // 📏 ESPAÇAMENTOS PERSONALIZADOS
            // ═══════════════════════════════════════════════════════════
            spacing: {
                '128': '32rem',
                '144': '36rem',
            },

            // ═══════════════════════════════════════════════════════════
            // 🔤 FONTES PERSONALIZADAS
            // ═══════════════════════════════════════════════════════════
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Poppins', 'system-ui', 'sans-serif'],
            },

            // ═══════════════════════════════════════════════════════════
            // 🎭 SOMBRAS PERSONALIZADAS
            // ═══════════════════════════════════════════════════════════
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },

            // ═══════════════════════════════════════════════════════════
            // 🎬 ANIMAÇÕES PERSONALIZADAS
            // ═══════════════════════════════════════════════════════════
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'bounce-soft': 'bounceSoft 0.5s ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                bounceSoft: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
            },
        },
    },
    plugins: [],
}


/**
 * ════════════════════════════════════════════════════════════
 * 📖 GUIA DE USO DAS CORES
 * ════════════════════════════════════════════════════════════
 */

/**
 * 🟠 PRIMARY (Laranja) - Ações Principais
 * 
 * bg-primary-500     → Fundo de botões principais
 * text-primary-600   → Textos de destaque
 * border-primary-300 → Bordas suaves
 * hover:bg-primary-600 → Hover em botões
 * 
 * Exemplo:
 * <button className="bg-primary-500 hover:bg-primary-600 text-white">
 *   Salvar
 * </button>
 */

/**
 * 🟤 SECONDARY (Marrom) - Elementos Secundários
 * 
 * bg-secondary-100   → Fundos suaves
 * text-secondary-700 → Textos importantes
 * 
 * Exemplo:
 * <div className="bg-secondary-50 text-secondary-700">
 *   Informação secundária
 * </div>
 */

/**
 * 🟢 SUCCESS (Verde) - Feedback Positivo
 * 
 * bg-success-100 text-success-700 → Badge de sucesso
 * 
 * Exemplo:
 * <span className="bg-success-100 text-success-700 px-2 py-1 rounded">
 *   Pago
 * </span>
 */

/**
 * 🔴 DANGER (Vermelho) - Ações Destrutivas
 * 
 * bg-danger-500 hover:bg-danger-600 → Botão deletar
 * 
 * Exemplo:
 * <button className="bg-danger-500 hover:bg-danger-600 text-white">
 *   Excluir
 * </button>
 */

/**
 * 🟡 WARNING (Amarelo) - Alertas
 * 
 * bg-warning-100 text-warning-700 → Badge de aviso
 * 
 * Exemplo:
 * <div className="bg-warning-100 text-warning-700 p-4 rounded">
 *   ⚠️ Estoque baixo!
 * </div>
 */

/**
 * ⚪ GRAY (Cinza) - Elementos Neutros
 * 
 * bg-gray-100 → Fundo de página
 * text-gray-600 → Textos secundários
 * border-gray-300 → Bordas
 * 
 * Exemplo:
 * <div className="bg-gray-100 border border-gray-300 p-4">
 *   Conteúdo
 * </div>
 */