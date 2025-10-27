// src/components/layout/Sidebar.jsx

/**
 * 📱 COMPONENTE SIDEBAR
 * 
 * Menu lateral de navegação.
 * Contém links para todas as páginas do sistema.
 * 
 * Props:
 * - isOpen: boolean (true = aberta, false = fechada)
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Users,
    UserCog,
    ShoppingCart,
    FileText,
    BarChart3
} from 'lucide-react';
import { ROTAS } from '../../utils/constants';

/**
 * Componente Sidebar
 * 
 * @param {Boolean} isOpen - Se está aberta ou fechada
 */
const Sidebar = ({ isOpen }) => {

    // ══════════════════════════════════════════════════════════
    // 📋 ITENS DO MENU
    // ══════════════════════════════════════════════════════════

    /**
     * Array com todos os itens do menu
     * Cada item tem: nome, rota, ícone
     */
    const menuItems = [
        {
            nome: 'Dashboard',
            rota: ROTAS.DASHBOARD,
            icone: LayoutDashboard,
        },
        {
            nome: 'Produtos',
            rota: ROTAS.PRODUTOS,
            icone: Package,
        },
        {
            nome: 'Clientes',
            rota: ROTAS.CLIENTES,
            icone: Users,
        },
        {
            nome: 'Funcionários',
            rota: ROTAS.FUNCIONARIOS,
            icone: UserCog,
        },
        {
            nome: 'Nova Venda',
            rota: ROTAS.NOVA_VENDA,
            icone: ShoppingCart,
        },
        {
            nome: 'Vendas',
            rota: ROTAS.VENDAS,
            icone: FileText,
        },
        {
            nome: 'Relatórios',
            rota: ROTAS.RELATORIOS,
            icone: BarChart3,
        },
    ];

    // ══════════════════════════════════════════════════════════
    // 🎨 RENDERIZAÇÃO
    // ══════════════════════════════════════════════════════════

    return (
        /**
         * Container do Sidebar
         * - fixed: Fixa na lateral
         * - top-16: Começa abaixo da navbar (64px)
         * - left-0: Encostado na esquerda
         * - h-[calc(100vh-4rem)]: Altura = tela inteira - navbar
         * - Largura muda: w-64 (aberto) ou w-20 (fechado)
         */
        <aside
            className={`
        fixed
        top-16
        left-0
        h-[calc(100vh-4rem)]
        bg-white
        shadow-lg
        transition-all
        duration-300
        overflow-y-auto
        ${isOpen ? 'w-64' : 'w-20'}
      `}
        >
            {/**
       * Lista de navegação
       */}
            <nav className="p-4">
                <ul className="space-y-2">
                    {/**
           * ═══════════════════════════════════════════════
           * LOOP PELOS ITENS DO MENU
           * ═══════════════════════════════════════════════
           * 
           * .map() percorre cada item do array
           * Para cada item, cria um <li> com link
           */}
                    {menuItems.map((item) => {
                        // Pega o componente de ícone
                        const IconeComponente = item.icone;

                        return (
                            <li key={item.rota}>
                                {/**
                 * NavLink: Link especial do React Router
                 * 
                 * Diferença de <Link>:
                 * - Sabe quando está ativo
                 * - Permite estilizar link ativo
                 * 
                 * Props:
                 * - to: rota de destino
                 * - className: pode ser função!
                 */}
                                <NavLink
                                    to={item.rota}
                                    className={({ isActive }) => `
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-lg
                    transition-colors
                    ${isActive
                                            ? 'bg-blue-100 text-blue-700 font-semibold'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }
                  `}
                                >
                                    {/**
                   * Ícone do item
                   */}
                                    <IconeComponente size={20} />

                                    {/**
                   * Nome do item
                   * - Só aparece se sidebar estiver aberta
                   */}
                                    {isOpen && (
                                        <span>{item.nome}</span>
                                    )}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;


/**
 * ════════════════════════════════════════════════════════════
 * 📖 EXPLICAÇÃO DOS CONCEITOS
 * ════════════════════════════════════════════════════════════
 */

/**
 * CONCEITO 1: Array de Objetos
 * 
 * Array = lista [ ]
 * Objeto = conjunto de dados { }
 * 
 * Array de Objetos = lista de conjuntos:
 * 
 * const menuItems = [
 *   { nome: 'Dashboard', rota: '/dashboard' },  ← Objeto 1
 *   { nome: 'Produtos', rota: '/produtos' },    ← Objeto 2
 *   { nome: 'Clientes', rota: '/clientes' },    ← Objeto 3
 * ];
 * 
 * Acessar:
 * menuItems[0].nome  → 'Dashboard'
 * menuItems[1].rota  → '/produtos'
 */

/**
 * CONCEITO 2: .map() - Percorrer Array
 * 
 * .map() percorre cada item do array e retorna algo novo.
 * 
 * Sintaxe:
 * array.map((item) => {
 *   return <div>{item.nome}</div>
 * })
 * 
 * Exemplo prático:
 * 
 * const nomes = ['João', 'Maria', 'Pedro'];
 * 
 * nomes.map((nome) => {
 *   return <p>{nome}</p>
 * });
 * 
 * Resultado:
 * <p>João</p>
 * <p>Maria</p>
 * <p>Pedro</p>
 * 
 * No nosso código:
 * menuItems.map((item) => {
 *   return <li><NavLink to={item.rota}>{item.nome}</NavLink></li>
 * });
 * 
 * Cria um <li> para cada item do menu!
 */

/**
 * CONCEITO 3: NavLink vs Link
 * 
 * Link: Link simples
 * <Link to="/produtos">Produtos</Link>
 * 
 * NavLink: Link que sabe se está ativo
 * <NavLink 
 *   to="/produtos"
 *   className={({ isActive }) => isActive ? 'azul' : 'cinza'}
 * >
 *   Produtos
 * </NavLink>
 * 
 * Por que NavLink?
 * - Destaca qual página você está
 * - UX melhor (usuário sabe onde está)
 * 
 * className pode ser:
 * 1. String normal: className="azul"
 * 2. Função: className={({ isActive }) => ...}
 * 
 * A função recebe:
 * - isActive: true se estiver na página
 * - isPending: true se carregando
 */

/**
 * CONCEITO 4: Renderização Condicional
 * 
 * Mostrar algo baseado em condição.
 * 
 * Sintaxe:
 * {condicao && <Componente />}
 * 
 * Se condicao = true  → mostra <Componente />
 * Se condicao = false → não mostra nada
 * 
 * Exemplo:
 * {isOpen && <span>Dashboard</span>}
 * 
 * Se isOpen = true  → mostra texto
 * Se isOpen = false → não mostra texto
 * 
 * Outros jeitos:
 * 
 * 1. Operador ternário:
 * {isOpen ? <span>Aberto</span> : <span>Fechado</span>}
 * 
 * 2. If/else (fora do JSX):
 * let texto;
 * if (isOpen) {
 *   texto = <span>Aberto</span>;
 * } else {
 *   texto = <span>Fechado</span>;
 * }
 * return <div>{texto}</div>;
 */

/**
 * CONCEITO 5: key em Listas
 * 
 * Quando usa .map(), precisa de key única.
 * 
 * <li key={item.id}>...</li>
 * 
 * Por que?
 * - React precisa identificar cada item
 * - Otimiza re-renderização
 * - Evita bugs em listas dinâmicas
 * 
 * ❌ Ruim:
 * {items.map((item, index) => (
 *   <li key={index}>...</li>  // index muda!
 * ))}
 * 
 * ✅ Bom:
 * {items.map((item) => (
 *   <li key={item.id}>...</li>  // id único!
 * ))}
 * 
 * No nosso código:
 * <li key={item.rota}>  // rota é única!
 */

/**
 * CONCEITO 6: Componente como Variável
 * 
 * Podemos guardar componente em variável!
 * 
 * const IconeComponente = item.icone;
 * 
 * Depois usar:
 * <IconeComponente size={20} />
 * 
 * É o mesmo que:
 * <Package size={20} />
 * 
 * Por que fazer isso?
 * - Ícone muda baseado no item
 * - Código mais dinâmico
 * 
 * Exemplo:
 * item 1: icone = Package   → <Package />
 * item 2: icone = Users     → <Users />
 * item 3: icone = ShoppingCart → <ShoppingCart />
 */