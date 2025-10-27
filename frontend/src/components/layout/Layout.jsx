// src/components/layout/Layout.jsx

/**
 * 🏗️ COMPONENTE LAYOUT
 * 
 * Estrutura base que envolve todas as páginas.
 * Contém: Navbar (topo) e Sidebar (lateral)
 * 
 * Conceito: Outlet
 * - Lugar onde o conteúdo da página aparece
 * - Como um "buraco" que muda dependendo da rota
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

/**
 * Componente Layout
 * 
 * Estrutura:
 * ┌─────────────────────────────┐
 * │         Navbar              │ ← Topo fixo
 * ├─────────┬───────────────────┤
 * │ Sidebar │    Conteúdo       │
 * │         │    (Outlet)       │ ← Muda por rota
 * │         │                   │
 * └─────────┴───────────────────┘
 */
const Layout = () => {

    // ============================================================
    // 📊 ESTADO
    // ============================================================

    /**
     * useState: Hook para guardar dados que mudam
     * 
     * const [valor, funcaoParaMudar] = useState(valorInicial)
     * 
     * Aqui guardamos se o sidebar está aberto ou fechado
     */
    const [sidebarAberta, setSidebarAberta] = useState(true);

    // ============================================================
    // 🎯 FUNÇÕES
    // ============================================================

    /**
     * Alterna estado do sidebar (aberto ↔ fechado)
     */
    const toggleSidebar = () => {
        setSidebarAberta(!sidebarAberta);
        // ! = NOT (inverso)
        // Se true vira false, se false vira true
    };

    // ============================================================
    // 🎨 RENDERIZAÇÃO
    // ============================================================

    return (
        <div className="min-h-screen bg-gray-100">
            {/**
       * Navbar: Barra superior
       * - Fixa no topo
       * - Recebe função para abrir/fechar sidebar
       */}
            <Navbar toggleSidebar={toggleSidebar} />

            {/**
       * Container principal: Sidebar + Conteúdo
       * - flex: Coloca um ao lado do outro
       */}
            <div className="flex pt-16">
                {/* pt-16: padding-top para não ficar atrás da navbar */}

                {/**
         * Sidebar: Menu lateral
         * - Recebe estado se está aberta ou não
         */}
                <Sidebar isOpen={sidebarAberta} />

                {/**
         * Área de conteúdo: Onde as páginas aparecem
         * - flex-1: Ocupa todo espaço restante
         * - Outlet: Renderiza o componente da rota atual
         */}
                <main
                    className={`
            flex-1 
            p-6 
            transition-all 
            duration-300
            ${sidebarAberta ? 'ml-64' : 'ml-20'}
          `}
                >
                    {/**
           * Outlet: Componente especial do React Router
           * 
           * Renderiza o componente da rota filho.
           * 
           * Se URL = /dashboard → <Dashboard />
           * Se URL = /produtos  → <Produtos />
           * 
           * É como um "placeholder" que muda!
           */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;


/**
 * ============================================================
 * 📖 EXPLICAÇÃO DOS CONCEITOS
 * ============================================================
 */

/**
 * CONCEITO 1: useState
 * 
 * Hook para criar variáveis que podem mudar.
 * Quando mudam, o componente re-renderiza (atualiza tela).
 * 
 * Sintaxe:
 * const [variavel, setVariavel] = useState(valorInicial);
 * 
 * Exemplo:
 * const [sidebarAberta, setSidebarAberta] = useState(true);
 * 
 * - sidebarAberta: valor atual (true)
 * - setSidebarAberta: função pra mudar
 * - useState(true): começa como true
 * 
 * Como usar:
 * setSidebarAberta(false);  // Muda pra false
 * setSidebarAberta(!sidebarAberta);  // Inverte (true↔false)
 */

/**
 * CONCEITO 2: Outlet
 * 
 * Componente do React Router que renderiza rota filho.
 * 
 * Layout tem:
 * - Navbar (sempre aparece)
 * - Sidebar (sempre aparece)
 * - <Outlet /> (muda baseado na rota)
 * 
 * Fluxo:
 * 1. Usuário acessa /produtos
 * 2. React Router procura rota /produtos
 * 3. Encontra: <Route path="/produtos" element={<Produtos />} />
 * 4. Renderiza <Produtos /> no lugar do <Outlet />
 */

/**
 * CONCEITO 3: Props (Passando Funções)
 * 
 * Podemos passar funções como props!
 * 
 * No Layout:
 * <Navbar toggleSidebar={toggleSidebar} />
 * 
 * No Navbar:
 * const Navbar = ({ toggleSidebar }) => {
 *   return <button onClick={toggleSidebar}>Menu</button>
 * }
 * 
 * Quando clica no botão → executa toggleSidebar → sidebar abre/fecha
 */

/**
 * CONCEITO 4: Classes Condicionais
 * 
 * Aplicar classes CSS baseado em condição.
 * 
 * className={`
 *   classe-sempre
 *   ${condicao ? 'classe-se-true' : 'classe-se-false'}
 * `}
 * 
 * Exemplo:
 * ${sidebarAberta ? 'ml-64' : 'ml-20'}
 * 
 * Se sidebarAberta = true  → ml-64 (margem 256px)
 * Se sidebarAberta = false → ml-20 (margem 80px)
 * 
 * Resultado: Conteúdo se ajusta quando sidebar fecha!
 */

/**
 * CONCEITO 5: Template Literals (``)
 * 
 * Strings com múltiplas linhas e variáveis.
 * 
 * // String normal:
 * const classe = "flex p-6 " + (aberto ? "ml-64" : "ml-20");
 * 
 * // Template literal:
 * const classe = `
 *   flex 
 *   p-6 
 *   ${aberto ? 'ml-64' : 'ml-20'}
 * `;
 * 
 * Vantagens:
 * - Mais legível
 * - Fácil adicionar variáveis ${...}
 * - Quebra de linha natural
 */