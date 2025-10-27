// src/models/relatorioModel.js
const db = require('../config/db');

class RelatorioModel {

    // ============================================================
    // RELATÓRIO: VENDAS POR PERÍODO
    // ============================================================

    /**
     * Total vendido por período com agrupamento (dia, semana, mês)
     * 
     * @param {String} dataInicio - Data início (YYYY-MM-DD)
     * @param {String} dataFim - Data fim (YYYY-MM-DD)
     * @param {String} agrupamento - 'dia', 'semana' ou 'mes'
     */
    static async vendasPorPeriodo(dataInicio, dataFim, agrupamento = 'dia') {
        let groupBy;
        let selectData;

        switch (agrupamento) {
            case 'dia':
                selectData = 'DATE(Data_Hora) AS Periodo';
                groupBy = 'DATE(Data_Hora)';
                break;
            case 'semana':
                selectData = 'YEARWEEK(Data_Hora, 1) AS Periodo';
                groupBy = 'YEARWEEK(Data_Hora, 1)';
                break;
            case 'mes':
                selectData = 'DATE_FORMAT(Data_Hora, "%Y-%m") AS Periodo';
                groupBy = 'DATE_FORMAT(Data_Hora, "%Y-%m")';
                break;
            default:
                selectData = 'DATE(Data_Hora) AS Periodo';
                groupBy = 'DATE(Data_Hora)';
        }

        const [rows] = await db.query(`
      SELECT 
        ${selectData},
        COUNT(*) AS Total_Vendas,
        SUM(Valor_Total) AS Valor_Total,
        AVG(Valor_Total) AS Ticket_Medio,
        MIN(Valor_Total) AS Menor_Venda,
        MAX(Valor_Total) AS Maior_Venda
      FROM Venda
      WHERE DATE(Data_Hora) BETWEEN ? AND ?
        AND Status = 'finalizada'
      GROUP BY ${groupBy}
      ORDER BY Periodo ASC
    `, [dataInicio, dataFim]);

        return rows;
    }

    // ============================================================
    // RELATÓRIO: PRODUTOS MAIS VENDIDOS
    // ============================================================

    /**
     * Ranking dos produtos mais vendidos
     * 
     * @param {String} dataInicio - Data início (opcional)
     * @param {String} dataFim - Data fim (opcional)
     * @param {Number} limite - Quantidade de produtos (padrão: 10)
     */
    static async produtosMaisVendidos(dataInicio = null, dataFim = null, limite = 10) {
        let query = `
      SELECT 
        p.ID_Produto,
        p.Nome AS Produto,
        tp.Nome_Tipo AS Tipo,
        p.Unidade_Medida,
        SUM(iv.Quantidade) AS Total_Vendido,
        COUNT(DISTINCT iv.ID_Venda) AS Quantidade_Vendas,
        SUM(iv.Quantidade * iv.Preco_Unitario) AS Faturamento_Total,
        AVG(iv.Preco_Unitario) AS Preco_Medio
      FROM Item_Venda iv
      INNER JOIN Produto p ON iv.ID_Produto = p.ID_Produto
      INNER JOIN Tipo_Produto tp ON p.ID_Tipo_Produto = tp.ID_Tipo_Produto
      INNER JOIN Venda v ON iv.ID_Venda = v.ID_Venda
      WHERE v.Status = 'finalizada'
    `;

        const params = [];

        if (dataInicio && dataFim) {
            query += ' AND DATE(v.Data_Hora) BETWEEN ? AND ?';
            params.push(dataInicio, dataFim);
        }

        query += `
      GROUP BY p.ID_Produto, p.Nome, tp.Nome_Tipo, p.Unidade_Medida
      ORDER BY Faturamento_Total DESC
      LIMIT ?
    `;

        params.push(limite);

        const [rows] = await db.query(query, params);
        return rows;
    }

    // ============================================================
    // RELATÓRIO: VENDAS POR FORMA DE PAGAMENTO
    // ============================================================

    /**
     * Distribuição de vendas por forma de pagamento
     */
    static async vendasPorFormaPagamento(dataInicio = null, dataFim = null) {
        let query = `
      SELECT 
        Tipo_Pagamento,
        COUNT(*) AS Quantidade_Vendas,
        SUM(Valor_Total) AS Valor_Total,
        AVG(Valor_Total) AS Ticket_Medio,
        ROUND(
          (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Venda WHERE Status = 'finalizada')), 
          2
        ) AS Percentual_Quantidade,
        ROUND(
          (SUM(Valor_Total) * 100.0 / (SELECT SUM(Valor_Total) FROM Venda WHERE Status = 'finalizada')), 
          2
        ) AS Percentual_Valor
      FROM Venda
      WHERE Status = 'finalizada'
    `;

        const params = [];

        if (dataInicio && dataFim) {
            query += ' AND DATE(Data_Hora) BETWEEN ? AND ?';
            params.push(dataInicio, dataFim);
        }

        query += `
      GROUP BY Tipo_Pagamento
      ORDER BY Valor_Total DESC
    `;

        const [rows] = await db.query(query, params);
        return rows;
    }

    // ============================================================
    // RELATÓRIO: DESEMPENHO DE FUNCIONÁRIOS
    // ============================================================

    /**
     * Ranking de funcionários por vendas
     */
    static async desempenhoFuncionarios(dataInicio = null, dataFim = null) {
        let query = `
      SELECT 
        f.ID_Funcionario,
        f.Nome AS Funcionario,
        c.Nome_Cargo AS Cargo,
        COUNT(v.ID_Venda) AS Total_Vendas,
        SUM(v.Valor_Total) AS Valor_Total_Vendido,
        AVG(v.Valor_Total) AS Ticket_Medio,
        MIN(v.Valor_Total) AS Menor_Venda,
        MAX(v.Valor_Total) AS Maior_Venda
      FROM Funcionario f
      INNER JOIN Cargo c ON f.ID_Cargo = c.ID_Cargo
      LEFT JOIN Venda v ON f.ID_Funcionario = v.ID_Funcionario 
        AND v.Status = 'finalizada'
    `;

        const params = [];

        if (dataInicio && dataFim) {
            query += ' AND DATE(v.Data_Hora) BETWEEN ? AND ?';
            params.push(dataInicio, dataFim);
        }

        query += `
      GROUP BY f.ID_Funcionario, f.Nome, c.Nome_Cargo
      ORDER BY Valor_Total_Vendido DESC
    `;

        const [rows] = await db.query(query, params);
        return rows;
    }

    // ============================================================
    // RELATÓRIO: CLIENTES DEVEDORES
    // ============================================================

    /**
     * Clientes com vendas a fiado em aberto
     */
    static async clientesDevedores() {
        const [rows] = await db.query(`
      SELECT 
        c.ID_Cliente,
        c.Nome AS Cliente,
        c.Telefone,
        c.Status,
        c.Limite_Fiado,
        COUNT(v.ID_Venda) AS Quantidade_Vendas_Abertas,
        SUM(v.Valor_Total) AS Total_Em_Aberto,
        (c.Limite_Fiado - SUM(v.Valor_Total)) AS Credito_Disponivel,
        MIN(v.Data_Hora) AS Venda_Mais_Antiga,
        DATEDIFF(NOW(), MIN(v.Data_Hora)) AS Dias_Mais_Antigo
      FROM Cliente c
      INNER JOIN Venda v ON c.ID_Cliente = v.ID_Cliente
      WHERE v.Tipo_Pagamento = 'fiado'
        AND v.Data_Pagamento_Fiado IS NULL
        AND v.Status = 'finalizada'
      GROUP BY c.ID_Cliente, c.Nome, c.Telefone, c.Status, c.Limite_Fiado
      ORDER BY Total_Em_Aberto DESC
    `);
        return rows;
    }

    // ============================================================
    // RELATÓRIO: PRODUTOS COM ESTOQUE BAIXO
    // ============================================================

    /**
     * Produtos com estoque abaixo do limite
     * 
     * @param {Number} limite - Estoque mínimo (padrão: 50)
     */
    static async produtosEstoqueBaixo(limite = 50) {
        const [rows] = await db.query(`
      SELECT 
        p.ID_Produto,
        p.Nome AS Produto,
        tp.Nome_Tipo AS Tipo,
        p.Unidade_Medida,
        p.Estoque_Atual,
        p.Preco_Base,
        (p.Estoque_Atual * p.Preco_Base) AS Valor_Estoque
      FROM Produto p
      INNER JOIN Tipo_Produto tp ON p.ID_Tipo_Produto = tp.ID_Tipo_Produto
      WHERE p.Estoque_Atual < ?
      ORDER BY p.Estoque_Atual ASC
    `, [limite]);
        return rows;
    }

    // ============================================================
    // RELATÓRIO: DASHBOARD GERAL
    // ============================================================

    /**
     * Estatísticas gerais para dashboard
     */
    static async dashboardGeral() {
        // Total de vendas (hoje)
        const [vendasHoje] = await db.query(`
      SELECT 
        COUNT(*) AS Total_Vendas,
        COALESCE(SUM(Valor_Total), 0) AS Valor_Total
      FROM Venda
      WHERE DATE(Data_Hora) = CURDATE()
        AND Status = 'finalizada'
    `);

        // Total de vendas (mês atual)
        const [vendasMes] = await db.query(`
      SELECT 
        COUNT(*) AS Total_Vendas,
        COALESCE(SUM(Valor_Total), 0) AS Valor_Total
      FROM Venda
      WHERE YEAR(Data_Hora) = YEAR(CURDATE())
        AND MONTH(Data_Hora) = MONTH(CURDATE())
        AND Status = 'finalizada'
    `);

        // Total de clientes
        const [clientes] = await db.query('SELECT COUNT(*) AS Total FROM Cliente');

        // Total de produtos
        const [produtos] = await db.query('SELECT COUNT(*) AS Total FROM Produto');

        // ✅ CORREÇÃO: Clientes com crédito excedido
        const [creditoExcedido] = await db.query(`
      SELECT COUNT(*) AS Total
      FROM (
        SELECT 
          c.ID_Cliente,
          c.Limite_Fiado,
          SUM(v.Valor_Total) AS Total_Devido
        FROM Cliente c
        INNER JOIN Venda v ON c.ID_Cliente = v.ID_Cliente
        WHERE v.Tipo_Pagamento = 'fiado'
          AND v.Data_Pagamento_Fiado IS NULL
          AND v.Status = 'finalizada'
        GROUP BY c.ID_Cliente, c.Limite_Fiado
        HAVING Total_Devido > c.Limite_Fiado
      ) AS clientes_excedidos
    `);

        // Produtos com estoque baixo (< 50)
        const [estoqueBaixo] = await db.query(`
      SELECT COUNT(*) AS Total
      FROM Produto
      WHERE Estoque_Atual < 50
    `);

        // Vendas a fiado em aberto
        const [fiadoAberto] = await db.query(`
      SELECT 
        COUNT(*) AS Quantidade,
        COALESCE(SUM(Valor_Total), 0) AS Valor_Total
      FROM Venda
      WHERE Tipo_Pagamento = 'fiado'
        AND Data_Pagamento_Fiado IS NULL
        AND Status = 'finalizada'
    `);

        return {
            vendas_hoje: {
                quantidade: vendasHoje[0].Total_Vendas,
                valor_total: parseFloat(vendasHoje[0].Valor_Total)
            },
            vendas_mes: {
                quantidade: vendasMes[0].Total_Vendas,
                valor_total: parseFloat(vendasMes[0].Valor_Total)
            },
            clientes: {
                total: clientes[0].Total
            },
            produtos: {
                total: produtos[0].Total,
                estoque_baixo: estoqueBaixo[0].Total
            },
            alertas: {
                clientes_credito_excedido: creditoExcedido[0].Total || 0,
                fiado_em_aberto: {
                    quantidade: fiadoAberto[0].Quantidade,
                    valor_total: parseFloat(fiadoAberto[0].Valor_Total)
                }
            }
        };
    }
    
    // ============================================================
    // RELATÓRIO: VENDAS ÚLTIMOS 7 DIAS (PARA GRÁFICO)
    // ============================================================

    /**
     * Vendas dos últimos 7 dias (para gráfico)
     */
    static async vendasUltimos7Dias() {
        const [rows] = await db.query(`
      SELECT 
        DATE(Data_Hora) AS Data,
        COUNT(*) AS Quantidade,
        SUM(Valor_Total) AS Total
      FROM Venda
      WHERE Data_Hora >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        AND Status = 'finalizada'
      GROUP BY DATE(Data_Hora)
      ORDER BY Data ASC
    `);
        return rows;
    }
}

module.exports = RelatorioModel;