// src/App.jsx

/**
 * 🗺️ APP - ARQUIVO PRINCIPAL
 * 
 * Aqui configuramos as rotas (caminhos) do sistema.
 * É como um mapa que diz "quando acessar /produtos, mostra a página X"
 * 
 * Conceito: React Router
 * - BrowserRouter: Container das rotas
 * - Routes: Lista de rotas
 * - Route: Uma rota específica
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Layout from './components/layout/Layout';

// Páginas
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import Clientes from './pages/Clientes';
import Funcionarios from './pages/Funcionarios';
import NovaVenda from './pages/NovaVenda';
import Vendas from './pages/Vendas';
import Relatorios from './pages/Relatorios';

// Importar rotas das constantes
import { ROTAS } from './utils/constants';

/**
 * ============================================================
 * 🎯 COMPONENTE PRINCIPAL
 * ============================================================
 */

function App() {
  return (
    /**
     * BrowserRouter: Habilita navegação por URL
     * - Permite usar URLs amigáveis (sem #)
     * - Exemplo: /produtos ao invés de /#/produtos
     */
    <BrowserRouter>
      {/**
       * Routes: Container para todas as rotas
       * - Só uma rota é renderizada por vez
       * - React Router escolhe qual baseado na URL
       */}
      <Routes>
        {/**
         * Rota Raiz: Redireciona / para /dashboard
         * Navigate é como "redirect"
         */}
        <Route
          path="/"
          element={<Navigate to={ROTAS.DASHBOARD} replace />}
        />

        {/**
         * Rotas com Layout
         * - Todas as rotas principais usam o mesmo Layout
         * - Layout tem Navbar e Sidebar
         */}
        <Route path="/" element={<Layout />}>
          {/**
           * Route: Define uma rota
           * - path: URL (ex: /dashboard)
           * - element: Componente a renderizar
           * - index: Rota padrão do pai
           */}

          {/* Dashboard - Página Inicial */}
          <Route
            path={ROTAS.DASHBOARD}
            element={<Dashboard />}
          />

          {/* Produtos - CRUD de Produtos */}
          <Route
            path={ROTAS.PRODUTOS}
            element={<Produtos />}
          />

          {/* Clientes - CRUD de Clientes */}
          <Route
            path={ROTAS.CLIENTES}
            element={<Clientes />}
          />

          {/* Funcionários - CRUD de Funcionários */}
          <Route
            path="/funcionarios"
            element={<Funcionarios />}
          />

          {/* Nova Venda - Tela de Registro de Venda */}
          <Route
            path={ROTAS.NOVA_VENDA}
            element={<NovaVenda />}
          />

          {/* Vendas - Lista de Vendas */}
          <Route
            path={ROTAS.VENDAS}
            element={<Vendas />}
          />

          {/* Relatórios - Dashboards e Relatórios */}
          <Route
            path={ROTAS.RELATORIOS}
            element={<Relatorios />}
          />
        </Route>

        {/**
         * Rota 404: Página não encontrada
         * - Captura qualquer rota não definida acima
         * - * significa "qualquer coisa"
         */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <p className="text-xl text-gray-600 mt-4">Página não encontrada</p>
                <a
                  href={ROTAS.DASHBOARD}
                  className="text-blue-600 hover:underline mt-4 inline-block"
                >
                  Voltar para o Dashboard
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


/**
 * ============================================================
 * 📖 EXPLICAÇÃO DOS CONCEITOS
 * ============================================================
 */

/**
 * CONCEITO 1: BrowserRouter
 * 
 * Habilita navegação por URL no React.
 * Sem ele, o React não entende mudanças na URL.
 * 
 * Como funciona:
 * 1. Usuário clica em "Produtos"
 * 2. URL muda para /produtos
 * 3. BrowserRouter detecta mudança
 * 4. Routes procura rota correspondente
 * 5. Renderiza componente <Produtos />
 */

/**
 * CONCEITO 2: Routes e Route
 * 
 * Routes = Container de rotas
 * Route = Uma rota específica
 * 
 * Exemplo:
 * <Routes>
 *   <Route path="/produtos" element={<Produtos />} />
 *   <Route path="/clientes" element={<Clientes />} />
 * </Routes>
 * 
 * Se URL = /produtos → mostra <Produtos />
 * Se URL = /clientes → mostra <Clientes />
 */

/**
 * CONCEITO 3: Rotas Aninhadas (Nested Routes)
 * 
 * Permite compartilhar layout entre páginas.
 * 
 * <Route path="/" element={<Layout />}>  ← Layout pai
 *   <Route path="/dashboard" element={<Dashboard />} />  ← Filho
 *   <Route path="/produtos" element={<Produtos />} />    ← Filho
 * </Route>
 * 
 * Resultado:
 * /dashboard → Layout + Dashboard
 * /produtos → Layout + Produtos
 * 
 * Layout sempre aparece, conteúdo muda!
 */

/**
 * CONCEITO 4: Navigate
 * 
 * Redireciona para outra rota.
 * 
 * <Navigate to="/dashboard" replace />
 * 
 * - to: Para onde vai
 * - replace: Substitui histórico (não pode voltar)
 */

/**
 * CONCEITO 5: Rota Curinga (*)
 * 
 * Captura qualquer URL não definida.
 * Útil para página 404.
 * 
 * <Route path="*" element={<PaginaNaoEncontrada />} />
 */