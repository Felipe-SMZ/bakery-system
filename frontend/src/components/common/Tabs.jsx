// src/components/common/Tabs.jsx

import { createContext, useContext, useState } from 'react';

/**
 * 📑 COMPONENTE DE ABAS (TABS)
 * 
 * Sistema de abas reutilizável e acessível.
 * Usa Context API para comunicação entre componentes.
 * 
 * Exemplo de uso:
 * <Tabs defaultValue="tab1">
 *   <Tabs.List>
 *     <Tabs.Tab value="tab1" icon={<Icon />}>
 *       Aba 1
 *     </Tabs.Tab>
 *     <Tabs.Tab value="tab2">
 *       Aba 2
 *     </Tabs.Tab>
 *   </Tabs.List>
 *   
 *   <Tabs.Content value="tab1">
 *     Conteúdo da aba 1
 *   </Tabs.Content>
 *   
 *   <Tabs.Content value="tab2">
 *     Conteúdo da aba 2
 *   </Tabs.Content>
 * </Tabs>
 */

// ============================================================
// 🗄️ CONTEXT
// ============================================================

const TabsContext = createContext();

const useTabs = () => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within a Tabs component');
    }
    return context;
};

// ============================================================
// 📦 COMPONENTE PRINCIPAL
// ============================================================

function Tabs({ children, defaultValue, value, onChange }) {
    const [activeTab, setActiveTab] = useState(defaultValue);

    // Se controlado externamente, usa value e onChange
    const currentTab = value !== undefined ? value : activeTab;
    const handleChange = onChange || setActiveTab;

    return (
        <TabsContext.Provider value={{ currentTab, setActiveTab: handleChange }}>
            <div className="w-full">
                {children}
            </div>
        </TabsContext.Provider>
    );
}

// ============================================================
// 📋 TABS LIST (Container das abas)
// ============================================================

function TabsList({ children, className = '' }) {
    return (
        <div className={`border-b border-gray-200 ${className}`}>
            <nav className="-mb-px flex space-x-8">
                {children}
            </nav>
        </div>
    );
}

// ============================================================
// 🏷️ TAB (Aba individual)
// ============================================================

function Tab({ children, value, icon, badge, disabled = false, className = '' }) {
    const { currentTab, setActiveTab } = useTabs();
    const isActive = currentTab === value;

    const handleClick = () => {
        if (!disabled) {
            setActiveTab(value);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={`
                py-4 px-1 border-b-2 font-medium text-sm 
                flex items-center gap-2 transition-colors
                ${isActive
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${className}
            `}
            aria-selected={isActive}
            role="tab"
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
            {badge !== undefined && (
                <span className={`
                    ml-2 px-2 py-0.5 rounded-full text-xs font-medium
                    ${isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600'
                    }
                `}>
                    {badge}
                </span>
            )}
        </button>
    );
}

// ============================================================
// 📄 TAB CONTENT (Conteúdo da aba)
// ============================================================

function TabContent({ children, value, className = '' }) {
    const { currentTab } = useTabs();

    if (currentTab !== value) {
        return null;
    }

    return (
        <div className={`pt-6 ${className}`} role="tabpanel">
            {children}
        </div>
    );
}

// ============================================================
// 📤 EXPORTS
// ============================================================

Tabs.List = TabsList;
Tabs.Tab = Tab;
Tabs.Content = TabContent;

export default Tabs;
