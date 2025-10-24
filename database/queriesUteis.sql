-- ============================================================
-- Sistema de Gestão de Padaria
-- Queries SQL Úteis para o Backend
-- Versão: 1.0
-- Data: 23/10/2025
-- ============================================================

USE padaria_db;

-- ============================================================
-- PRODUTOS
-- ============================================================

-- 1. Listar todos os produtos com tipo
SELECT 
    p.ID_Produto,
    p.Nome,
    p.Unidade_Medida,
    p.Preco_Base,
    p.Estoque_Atual,
    tp.ID_Tipo_Produto,
    tp.Nome_Tipo AS Tipo
FROM Produto p
INNER JOIN Tipo_Produto tp ON p.ID_Tipo_Produto = tp.ID_Tipo_Produto
ORDER BY p.Nome;

-- 2. Buscar produto por nome (parcial)
SELECT * FROM vw_produtos_completo 
WHERE Nome LIKE '%pao%' 
ORDER BY Nome;

-- 3. Filtrar produtos por tipo
SELECT * FROM vw_produtos_completo 
WHERE Tipo_Produto = 'paes'
ORDER BY Nome;

-- 4. Buscar produto por ID
SELECT 
    p.*,
    tp.Nome_Tipo AS Tipo
FROM Produto p
INNER JOIN Tipo_Produto tp ON p.ID_Tipo_Produto = tp.ID_Tipo_Produto
WHERE p.ID_Produto = ?;

-- 5. Produtos com estoque baixo (< 50)
SELECT * FROM vw_produtos_completo
WHERE Estoque_Atual < 50
ORDER BY Estoque_Atual ASC;

-- 6. Inserir novo produto
INSERT INTO Produto (Nome, Unidade_Medida, Preco_Base, Estoque_Atual, ID_Tipo_Produto)
VALUES (?, ?, ?, ?, ?);

-- 7. Atualizar produto
UPDATE Produto 
SET Nome = ?, 
    Unidade_Medida = ?, 
    Preco_Base = ?, 
    Estoque_Atual = ?,
    ID_Tipo_Produto = ?
WHERE ID_Produto = ?;

-- 8. Deletar produto (verificar se tem vendas antes)
DELETE FROM Produto WHERE ID_Produto = ?;

-- 9. Verificar se produto tem vendas
SELECT COUNT(*) AS Total_Vendas
FROM Item_Venda
WHERE ID_Produto = ?;

-- 10. Atualizar estoque após venda
UPDATE Produto 
SET Estoque_Atual = Estoque_Atual - ?
WHERE ID_Produto = ?;

-- ============================================================
-- CLIENTES
-- ============================================================

-- 11. Listar todos os clientes
SELECT * FROM Cliente ORDER BY Nome;

-- 12. Buscar cliente por nome ou telefone
SELECT * FROM Cliente 
WHERE Nome LIKE ? OR Telefone LIKE ?
ORDER BY Nome;

-- 13. Filtrar clientes por status
SELECT * FROM Cliente 
WHERE Status = ?
ORDER BY Nome;

-- 14. Buscar cliente por ID
SELECT * FROM Cliente WHERE ID_Cliente = ?;

-- 15. Obter crédito disponível do cliente
SELECT * FROM vw_credito_cliente 
WHERE ID_Cliente = ?;

-- 16. Inserir novo cliente
INSERT INTO Cliente (Nome, Telefone, Status, Limite_Fiado, Rua, Numero, Bairro, Cidade, CEP)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

-- 17. Atualizar cliente
UPDATE Cliente 
SET Nome = ?,
    Telefone = ?,
    Status = ?,
    Limite_Fiado = ?,
    Rua = ?,
    Numero = ?,
    Bairro = ?,
    Cidade = ?,
    CEP = ?
WHERE ID_Cliente = ?;

-- 18. Deletar cliente (verificar vendas antes)
DELETE FROM Cliente WHERE ID_Cliente = ?;

-- 19. Verificar se cliente tem vendas
SELECT COUNT(*) AS Total_Vendas
FROM Venda
WHERE ID_Cliente = ?;

-- 20. Histórico de compras do cliente
SELECT 
    v.ID_Venda,
    v.Data_Hora,
    v.Tipo_Pagamento,
    v.Valor_Total,
    f.Nome AS Funcionario,
    CASE 
        WHEN v.Tipo_Pagamento = 'fiado' AND v.Data_Pagamento_Fiado IS NULL 
        THEN 'Em Aberto'
        WHEN v.Tipo_Pagamento = 'fiado' AND v.Data_Pagamento_Fiado IS NOT NULL 
        THEN 'Quitado'
        ELSE 'Pago'
    END AS Status_Pagamento
FROM Venda v
INNER JOIN Funcionario f ON v.ID_Funcionario = f.ID_Funcionario
WHERE v.ID_Cliente = ?
ORDER BY v.Data_Hora DESC;

-- ============================================================
-- FUNCIONÁRIOS
-- ============================================================

-- 21. Listar todos os funcionários
SELECT 
    f.ID_Funcionario,
    f.Nome,
    f.ID_Cargo,
    c.Nome_Cargo AS Cargo
FROM Funcionario f
INNER JOIN Cargo c ON f.ID_Cargo = c.ID_Cargo
ORDER BY f.Nome;

-- 22. Filtrar funcionários por cargo
SELECT 
    f.*,
    c.Nome_Cargo AS Cargo
FROM Funcionario f
INNER JOIN Cargo c ON f.ID_Cargo = c.ID_Cargo
WHERE f.ID_Cargo = ?
ORDER BY f.Nome;

-- 23. Buscar funcionário por ID
SELECT 
    f.*,
    c.Nome_Cargo AS Cargo
FROM Funcionario f
INNER JOIN Cargo c ON f.ID_Cargo = c.ID_Cargo
WHERE f.ID_Funcionario = ?;

-- 24. Inserir novo funcionário
INSERT INTO Funcionario (Nome, ID_Cargo)
VALUES (?, ?);

-- 25. Atualizar funcionário
UPDATE Funcionario 
SET Nome = ?, ID_Cargo = ?
WHERE ID_Funcionario = ?;

-- 26. Deletar funcionário
DELETE FROM Funcionario WHERE ID_Funcionario = ?;

-- 27. Listar vendas por funcionário
SELECT COUNT(*) AS Total_Vendas, SUM(Valor_Total) AS Total_Vendido
FROM Venda
WHERE ID_Funcionario = ? AND Status = 'finalizada';

-- ============================================================
-- VENDAS - CRIAR E PROCESSAR
-- ============================================================

-- 28. Criar nova venda (cabeçalho)
INSERT INTO Venda (Data_Hora, Tipo_Pagamento, Valor_Total, ID_Cliente, ID_Funcionario, Status)
VALUES (NOW(), ?, ?, ?, ?, 'finalizada');
-- Obter ID: SELECT LAST_INSERT_ID();

-- 29. Adicionar item à venda
INSERT INTO Item_Venda (ID_Venda, ID_Produto, Quantidade, Preco_Unitario)
VALUES (?, ?, ?, ?);

-- 30. Validar crédito antes de finalizar venda fiado
SELECT 
    Credito_Disponivel,
    CASE 
        WHEN Credito_Disponivel >= ? THEN 'APROVADO'
        ELSE 'NEGADO'
    END AS Status_Validacao
FROM vw_credito_cliente
WHERE ID_Cliente = ?;

-- 31. Validar estoque antes de adicionar item
SELECT 
    ID_Produto,
    Nome,
    Estoque_Atual,
    CASE 
        WHEN Estoque_Atual >= ? THEN 'DISPONIVEL'
        ELSE 'INSUFICIENTE'
    END AS Status_Estoque
FROM Produto
WHERE ID_Produto = ?;

-- 32. Calcular total da venda (após adicionar todos os itens)
SELECT SUM(Quantidade * Preco_Unitario) AS Total
FROM Item_Venda
WHERE ID_Venda = ?;

-- 33. Atualizar valor total da venda
UPDATE Venda 
SET Valor_Total = ?
WHERE ID_Venda = ?;

-- 34. Cancelar venda (se necessário antes de finalizar)
UPDATE Venda 
SET Status = 'cancelada'
WHERE ID_Venda = ?;

-- ============================================================
-- VENDAS - CONSULTAS
-- ============================================================

-- 35. Listar todas as vendas (paginado)
SELECT * FROM vw_vendas_completo
ORDER BY Data_Hora DESC
LIMIT ? OFFSET ?;

-- 36. Buscar venda por ID com itens
SELECT 
    v.*,
    c.Nome AS Cliente,
    f.Nome AS Funcionario
FROM Venda v
INNER JOIN Cliente c ON v.ID_Cliente = c.ID_Cliente
INNER JOIN Funcionario f ON v.ID_Funcionario = f.ID_Funcionario
WHERE v.ID_Venda = ?;

-- 37. Itens de uma venda específica
SELECT 
    iv.*,
    p.Nome AS Produto,
    p.Unidade_Medida,
    (iv.Quantidade * iv.Preco_Unitario) AS Subtotal
FROM Item_Venda iv
INNER JOIN Produto p ON iv.ID_Produto = p.ID_Produto
WHERE iv.ID_Venda = ?;

-- 38. Filtrar vendas por período
SELECT * FROM vw_vendas_completo
WHERE DATE(Data_Hora) BETWEEN ? AND ?
ORDER BY Data_Hora DESC;

-- 39. Filtrar vendas por cliente
SELECT * FROM vw_vendas_completo
WHERE Nome_Cliente LIKE ?
ORDER BY Data_Hora DESC;

-- 40. Filtrar vendas por funcionário
SELECT * FROM vw_vendas_completo
WHERE Nome_Funcionario LIKE ?
ORDER BY Data_Hora DESC;

-- 41. Filtrar vendas por forma de pagamento
SELECT * FROM vw_vendas_completo
WHERE Tipo_Pagamento = ?
ORDER BY Data_Hora DESC;

-- 42. Vendas a fiado em aberto
SELECT * FROM vw_vendas_completo
WHERE Tipo_Pagamento = 'fiado' 
  AND Status_Pagamento = 'Em Aberto'
ORDER BY Data_Hora ASC;

-- ============================================================
-- RELATÓRIOS
-- ============================================================

-- 43. Total vendido por período
SELECT 
    DATE(Data_Hora) AS Data,
    COUNT(*) AS Quantidade_Vendas,
    SUM(Valor_Total) AS Total_Vendido,
    AVG(Valor_Total) AS Ticket_Medio
FROM Venda
WHERE DATE(Data_Hora) BETWEEN ? AND ?
  AND Status = 'finalizada'
GROUP BY DATE(Data_Hora)
ORDER BY Data DESC;

-- 44. Produtos mais vendidos (top 10)
SELECT 
    p.ID_Produto,
    p.Nome AS Produto,
    tp.Nome_Tipo AS Tipo,
    SUM(iv.Quantidade) AS Total_Vendido,
    p.Unidade_Medida,
    SUM(iv.Quantidade * iv.Preco_Unitario) AS Faturamento_Total
FROM Item_Venda iv
INNER JOIN Produto p ON iv.ID_Produto = p.ID_Produto
INNER JOIN Tipo_Produto tp ON p.ID_Tipo_Produto = tp.ID_Tipo_Produto
INNER JOIN Venda v ON iv.ID_Venda = v.ID_Venda
WHERE v.Status = 'finalizada'
  AND DATE(v.Data_Hora) BETWEEN ? AND ?
GROUP BY p.ID_Produto, p.Nome, tp.Nome_Tipo, p.Unidade_Medida
ORDER BY Faturamento_Total DESC
LIMIT 10;

-- 45. Vendas por forma de pagamento
SELECT 
    Tipo_Pagamento,
    COUNT(*) AS Quantidade_Vendas,
    SUM(Valor_Total) AS Total_Vendido,
    ROUND((SUM(Valor_Total) / (SELECT SUM(Valor_Total) FROM Venda WHERE Status = 'finalizada')) * 100, 2) AS Percentual
FROM Venda
WHERE Status = 'finalizada'
  AND DATE(Data_Hora) BETWEEN ? AND ?
GROUP BY Tipo_Pagamento
ORDER BY Total_Vendido DESC;

-- 46. Clientes devedores (fiado em aberto)
SELECT 
    c.ID_Cliente,
    c.Nome,
    c.Telefone,
    c.Limite_Fiado,
    SUM(v.Valor_Total) AS Total_Em_Aberto,
    (c.Limite_Fiado - SUM(v.Valor_Total)) AS Credito_Disponivel,
    COUNT(v.ID_Venda) AS Quantidade_Vendas_Abertas,
    MIN(DATEDIFF(NOW(), v.Data_Hora)) AS Dias_Mais_Antigo
FROM Cliente c
INNER JOIN Venda v ON c.ID_Cliente = v.ID_Cliente
WHERE v.Tipo_Pagamento = 'fiado'
  AND v.Data_Pagamento_Fiado IS NULL
  AND v.Status = 'finalizada'
GROUP BY c.ID_Cliente, c.Nome, c.Telefone, c.Limite_Fiado
ORDER BY Total_Em_Aberto DESC;

-- 47. Desempenho de funcionários
SELECT 
    f.ID_Funcionario,
    f.Nome AS Funcionario,
    c.Nome_Cargo AS Cargo,
    COUNT(v.ID_Venda) AS Total_Vendas,
    SUM(v.Valor_Total) AS Total_Vendido,
    AVG(v.Valor_Total) AS Ticket_Medio
FROM Funcionario f
INNER JOIN Cargo c ON f.ID_Cargo = c.ID_Cargo
LEFT JOIN Venda v ON f.ID_Funcionario = v.ID_Funcionario 
    AND v.Status = 'finalizada'
    AND DATE(v.Data_Hora) BETWEEN ? AND ?
GROUP BY f.ID_Funcionario, f.Nome, c.Nome_Cargo
ORDER BY Total_Vendido DESC;

-- 48. Dashboard - Estatísticas do dia
SELECT 
    COUNT(*) AS Vendas_Hoje,
    SUM(Valor_Total) AS Total_Hoje,
    AVG(Valor_Total) AS Ticket_Medio_Hoje
FROM Venda
WHERE DATE(Data_Hora) = CURDATE()
  AND Status = 'finalizada';

-- 49. Dashboard - Estatísticas do mês
SELECT 
    COUNT(*) AS Vendas_Mes,
    SUM(Valor_Total) AS Total_Mes,
    AVG(Valor_Total) AS Ticket_Medio_Mes
FROM Venda
WHERE YEAR(Data_Hora) = YEAR(CURDATE())
  AND MONTH(Data_Hora) = MONTH(CURDATE())
  AND Status = 'finalizada';

-- 50. Dashboard - Vendas dos últimos 7 dias
SELECT 
    DATE(Data_Hora) AS Data,
    COUNT(*) AS Quantidade,
    SUM(Valor_Total) AS Total
FROM Venda
WHERE Data_Hora >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
  AND Status = 'finalizada'
GROUP BY DATE(Data_Hora)
ORDER BY Data ASC;

-- ============================================================
-- QUITAÇÃO DE FIADO (OPCIONAL - VERSÃO 2)
-- ============================================================

-- 51. Registrar quitação de venda fiado
UPDATE Venda 
SET Data_Pagamento_Fiado = NOW()
WHERE ID_Venda = ? 
  AND Tipo_Pagamento = 'fiado'
  AND Data_Pagamento_Fiado IS NULL;

-- 52. Listar vendas a fiado de um cliente
SELECT 
    ID_Venda,
    Data_Hora,
    Valor_Total,
    DATEDIFF(NOW(), Data_Hora) AS Dias_Em_Aberto,
    Data_Pagamento_Fiado
FROM Venda
WHERE ID_Cliente = ?
  AND Tipo_Pagamento = 'fiado'
ORDER BY Data_Hora DESC;

-- ============================================================
-- TIPOS E CARGOS (AUXILIARES)
-- ============================================================

-- 53. Listar todos os tipos de produto
SELECT * FROM Tipo_Produto ORDER BY Nome_Tipo;

-- 54. Listar todos os cargos
SELECT * FROM Cargo ORDER BY Nome_Cargo;

-- 55. Inserir novo tipo de produto
INSERT INTO Tipo_Produto (Nome_Tipo) VALUES (?);

-- 56. Inserir novo cargo
INSERT INTO Cargo (Nome_Cargo) VALUES (?);

-- ============================================================
-- QUERIES DE VALIDAÇÃO E SEGURANÇA
-- ============================================================

-- 57. Verificar se produto existe
SELECT EXISTS(SELECT 1 FROM Produto WHERE ID_Produto = ?) AS Existe;

-- 58. Verificar se cliente existe
SELECT EXISTS(SELECT 1 FROM Cliente WHERE ID_Cliente = ?) AS Existe;

-- 59. Verificar se funcionário existe
SELECT EXISTS(SELECT 1 FROM Funcionario WHERE ID_Funcionario = ?) AS Existe;

-- 60. Verificar se venda existe
SELECT EXISTS(SELECT 1 FROM Venda WHERE ID_Venda = ?) AS Existe;

-- ============================================================
-- NOTAS DE USO
-- ============================================================

/*
IMPORTANTE:
- Substitua "?" pelos valores reais quando usar no código
- Use prepared statements para evitar SQL Injection
- Sempre valide no backend antes de executar queries
- Lembre-se de usar transações para operações complexas

EXEMPLO DE TRANSAÇÃO (Criar Venda Completa):

START TRANSACTION;

-- 1. Criar venda
INSERT INTO Venda (...) VALUES (...);
SET @venda_id = LAST_INSERT_ID();

-- 2. Adicionar itens
INSERT INTO Item_Venda (ID_Venda, ...) VALUES (@venda_id, ...);
INSERT INTO Item_Venda (ID_Venda, ...) VALUES (@venda_id, ...);

-- 3. Atualizar estoque
UPDATE Produto SET Estoque_Atual = Estoque_Atual - ? WHERE ID_Produto = ?;

-- 4. Calcular e atualizar total
UPDATE Venda SET Valor_Total = (
    SELECT SUM(Quantidade * Preco_Unitario) FROM Item_Venda WHERE ID_Venda = @venda_id
) WHERE ID_Venda = @venda_id;

COMMIT;
-- Se houver erro: ROLLBACK;

*/