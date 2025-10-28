// src/components/layout/Navbar.jsx

/**
 * 🔝 COMPONENTE NAVBAR
 * 
 * Barra de navegação superior (topo da página).
 * Contém: Logo, botão menu, nome do sistema, etc.
 * 
 * Props:
 * - toggleSidebar: função para abrir/fechar sidebar
 */

import React from 'react';
import { Menu, ShoppingBag } from 'lucide-react';

/**
 * Componente Navbar
 * 
 * @param {Function} toggleSidebar - Função para alternar sidebar
 */
const Navbar = ({ toggleSidebar }) => {

    return (
        <nav 
            style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '64px',
                backgroundColor: 'white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>

                {/**
         * ═══════════════════════════════════════════════
         * LADO ESQUERDO: Botão Menu + Logo
         * ═══════════════════════════════════════════════
         */}
                <div className="flex items-center gap-4">
                    {/**
           * Botão Menu Hamburguer
           * - Clique abre/fecha sidebar
           * - Ícone: 3 linhas horizontais (☰)
           */}
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Abrir menu"
                    >
                        <Menu size={24} className="text-gray-700" />
                    </button>

                    {/**
           * Logo + Nome do Sistema
           */}
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={28} className="text-blue-600" />
                        <h1 className="text-xl font-bold text-gray-800">
                            Padaria System
                        </h1>
                    </div>
                </div>

                {/**
         * ═══════════════════════════════════════════════
         * LADO DIREITO: Informações do usuário (futuro)
         * ═══════════════════════════════════════════════
         */}
                <div className="flex items-center gap-4">
                    {/**
           * Badge de notificações (exemplo)
           * Você pode adicionar depois:
           * - Nome do usuário
           * - Avatar
           * - Botão de logout
           * - Notificações
           */}
                    <div className="hidden md:flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                            Bem-vindo, <span className="font-semibold">Admin</span>
                        </span>
                    </div>

                    {/**
           * Avatar do usuário (futuro)
           */}
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">A</span>
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;


/**
 * ════════════════════════════════════════════════════════════
 * 📖 EXPLICAÇÃO DOS CONCEITOS
 * ════════════════════════════════════════════════════════════
 */

/**
 * CONCEITO 1: Ícones com Lucide React
 * 
 * Lucide React é uma biblioteca de ícones.
 * 
 * Import:
 * import { Menu, ShoppingBag, User } from 'lucide-react';
 * 
 * Uso:
 * <Menu size={24} className="text-gray-700" />
 * 
 * Props:
 * - size: tamanho do ícone (pixels)
 * - className: classes CSS (cores, etc)
 * - color: cor direta (ex: color="red")
 * - strokeWidth: espessura da linha
 * 
 * Ícones disponíveis:
 * - Menu: ☰ (hamburguer)
 * - ShoppingBag: 🛍️ (sacola)
 * - User: 👤 (usuário)
 * - Home: 🏠 (casa)
 * - Package: 📦 (caixa)
 * - Users: 👥 (pessoas)
 * - ... e muitos outros!
 * 
 * Ver todos: https://lucide.dev/icons
 */

/**
 * CONCEITO 2: Event Handlers (onClick)
 * 
 * Event Handler = Função que executa quando algo acontece
 * 
 * Sintaxe:
 * <button onClick={funcao}>Clique</button>
 * 
 * Exemplos:
 * 
 * 1. Chamar função existente:
 * <button onClick={toggleSidebar}>Menu</button>
 * 
 * 2. Função inline:
 * <button onClick={() => console.log('Clicou!')}>
 *   Clique
 * </button>
 * 
 * 3. Função com parâmetro:
 * <button onClick={() => deletarProduto(id)}>
 *   Excluir
 * </button>
 * 
 * ⚠️ ERRO COMUM:
 * <button onClick={toggleSidebar()}>  ❌ Executa imediatamente!
 * <button onClick={toggleSidebar}>    ✅ Executa ao clicar
 */

/**
 * CONCEITO 3: Classes Responsivas (Tailwind)
 * 
 * Prefixos que aplicam classes em tamanhos específicos.
 * 
 * Breakpoints:
 * - sm:  640px  (celular grande)
 * - md:  768px  (tablet)
 * - lg:  1024px (notebook)
 * - xl:  1280px (desktop)
 * - 2xl: 1536px (tela grande)
 * 
 * Exemplo:
 * className="hidden md:flex"
 * 
 * hidden      → esconde em todas as telas
 * md:flex     → mostra (flex) a partir de 768px
 * 
 * Resultado:
 * - Celular (< 768px): escondido
 * - Tablet (≥ 768px): visível
 * 
 * Mais exemplos:
 * text-sm md:text-base lg:text-lg  → Tamanho de texto aumenta
 * grid-cols-1 md:grid-cols-2 lg:grid-cols-3  → 1 col → 2 cols → 3 cols
 */

/**
 * CONCEITO 4: Acessibilidade (aria-label)
 * 
 * aria-label = Descrição para leitores de tela
 * 
 * <button aria-label="Abrir menu">
 *   <Menu />
 * </button>
 * 
 * Por que usar?
 * - Pessoas com deficiência visual usam leitores de tela
 * - Ícones sem texto não são claros
 * - aria-label descreve o que o botão faz
 * 
 * Leitor lê: "Botão, Abrir menu"
 * 
 * Outras tags de acessibilidade:
 * - aria-label: descrição
 * - aria-hidden: esconde de leitores
 * - role: define papel do elemento
 * - alt: texto alternativo (imagens)
 */

/**
 * CONCEITO 5: Gap no Flexbox
 * 
 * gap = espaçamento entre elementos flex/grid
 * 
 * <div className="flex gap-4">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </div>
 * 
 * gap-4 = 16px de espaço entre cada item
 * 
 * Vantagens sobre margin:
 * - Mais simples
 * - Espaçamento consistente
 * - Não precisa margin em cada item
 * 
 * Valores:
 * gap-1  = 4px
 * gap-2  = 8px
 * gap-4  = 16px
 * gap-6  = 24px
 * gap-8  = 32px
 */