// src/utils/constants.js

/**
 * 🎯 ARQUIVO DE CONSTANTES
 * 
 * Aqui guardamos valores fixos que usamos em vários lugares.
 * Por que fazer isso?
 * - Se precisar mudar, muda só aqui
 * - Evita erros de digitação
 * - Facilita manutenção
 */

// ============================================================
// 🌐 CONFIGURAÇÃO DA API
// ============================================================

// URL base da nossa API backend
export const API_BASE_URL = 'http://localhost:3000/api';

// ============================================================
// 💳 FORMAS DE PAGAMENTO
// ============================================================

export const FORMAS_PAGAMENTO = [
    { value: 'dinheiro', label: 'Dinheiro' },
    { value: 'cartao', label: 'Cartão' },
    { value: 'pix', label: 'PIX' },
    { value: 'fiado', label: 'Fiado' }
];

// ============================================================
// 👤 STATUS DO CLIENTE
// ============================================================

export const STATUS_CLIENTE = [
    { value: 'bom', label: 'Bom', color: 'green' },
    { value: 'medio', label: 'Médio', color: 'yellow' },
    { value: 'ruim', label: 'Ruim', color: 'red' }
];

// ============================================================
// 📏 UNIDADES DE MEDIDA
// ============================================================

export const UNIDADES_MEDIDA = [
    { value: 'unidade', label: 'Unidade' },
    { value: 'kg', label: 'Quilograma (kg)' },
    { value: 'fatia', label: 'Fatia' }
];

// ============================================================
// 📊 STATUS DA VENDA
// ============================================================

export const STATUS_VENDA = {
    PENDENTE: 'pendente',
    FINALIZADA: 'finalizada',
    CANCELADA: 'cancelada'
};

// ============================================================
// ⚙️ CONFIGURAÇÕES GERAIS
// ============================================================

// Estoque mínimo para alertas
export const ESTOQUE_MINIMO = 50;

// Itens por página nas listagens
export const ITENS_POR_PAGINA = 20;

// Tempo de debounce em buscas (ms)
export const DEBOUNCE_TIME = 500;

// ============================================================
// 🎨 CORES DO SISTEMA (Tailwind)
// ============================================================

export const CORES = {
    primary: 'blue',
    success: 'green',
    danger: 'red',
    warning: 'yellow',
    info: 'gray'
};

// ============================================================
// 📱 MENSAGENS PADRÃO
// ============================================================

export const MENSAGENS = {
    ERRO_GENERICO: 'Ocorreu um erro. Tente novamente.',
    SUCESSO_CRIAR: 'Cadastro realizado com sucesso!',
    SUCESSO_ATUALIZAR: 'Atualização realizada com sucesso!',
    SUCESSO_DELETAR: 'Exclusão realizada com sucesso!',
    CONFIRMAR_DELETAR: 'Tem certeza que deseja excluir?',
    SEM_DADOS: 'Nenhum registro encontrado.',
    CARREGANDO: 'Carregando...'
};

// ============================================================
// 🔗 ROTAS DO SISTEMA
// ============================================================

export const ROTAS = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    PRODUTOS: '/produtos',
    CLIENTES: '/clientes',
    FUNCIONARIOS: '/funcionarios',
    VENDAS: '/vendas',
    NOVA_VENDA: '/vendas/nova',
    RELATORIOS: '/relatorios'
};