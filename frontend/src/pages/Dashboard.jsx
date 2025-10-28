// ════════════════════════════════════════════════════════════
// src/pages/Dashboard.jsx
// ════════════════════════════════════════════════════════════

import React from 'react';

const Dashboard = () => {
    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
            <p className="text-gray-600 mb-6">Página do Dashboard - Em construção 🚧</p>
            
            {/* Cards de teste */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Vendas Hoje</h3>
                    <p className="text-3xl font-bold text-blue-600">R$ 1.250,00</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Produtos</h3>
                    <p className="text-3xl font-bold text-green-600">145</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Clientes</h3>
                    <p className="text-3xl font-bold text-purple-600">89</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;