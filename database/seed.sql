-- ============================================================
-- Sistema de Gestão de Padaria
-- Script de Dados de Teste (Seed)
-- Versão: 1.0
-- Data: 23/10/2025
-- ============================================================

USE padaria_db;

-- Desabilitar checagem de foreign keys temporariamente
SET FOREIGN_KEY_CHECKS = 0;

-- Limpar dados existentes (se houver)
TRUNCATE TABLE Item_Venda;
TRUNCATE TABLE Venda;
TRUNCATE TABLE Produto;
TRUNCATE TABLE Tipo_Produto;
TRUNCATE TABLE Funcionario;
TRUNCATE TABLE Cargo;
TRUNCATE TABLE Cliente;

-- Habilitar checagem de foreign keys novamente
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- INSERIR CARGOS
-- ============================================================
INSERT INTO Cargo (Nome_Cargo) VALUES
('atendente'),
('caixa'),
('padeiro'),
('gerente');

-- ============================================================
-- INSERIR TIPOS DE PRODUTO
-- ============================================================
INSERT INTO Tipo_Produto (Nome_Tipo) VALUES
('paes'),
('salgados'),
('doces'),
('bebidas'),
('confeitaria');

-- ============================================================
-- INSERIR CLIENTES
-- ============================================================
INSERT INTO Cliente (Nome, Telefone, Status, Limite_Fiado, Rua, Numero, Bairro, Cidade, CEP) VALUES
-- Clientes com bom status
('Maria Silva Santos', '(11) 98765-4321', 'bom', 500.00, 'Rua das Flores', '123', 'Centro', 'São Paulo', '01234-567'),
('João Pedro Oliveira', '(11) 97654-3210', 'bom', 300.00, 'Av. Paulista', '1500', 'Bela Vista', 'São Paulo', '01310-100'),
('Ana Carolina Lima', '(11) 96543-2109', 'bom', 400.00, 'Rua Augusta', '789', 'Consolação', 'São Paulo', '01305-000'),

-- Clientes com status médio
('Carlos Eduardo Costa', '(11) 95432-1098', 'medio', 200.00, 'Rua Vergueiro', '456', 'Liberdade', 'São Paulo', '01504-000'),
('Fernanda Alves Souza', '(11) 94321-0987', 'medio', 150.00, 'Av. Ipiranga', '900', 'República', 'São Paulo', '01046-010'),

-- Clientes com status ruim
('Roberto Martins', '(11) 93210-9876', 'ruim', 100.00, 'Rua da Consolação', '1200', 'Consolação', 'São Paulo', '01301-100'),
('Patrícia Rocha', '(11) 92109-8765', 'ruim', 50.00, 'Rua Haddock Lobo', '595', 'Cerqueira César', 'São Paulo', '01414-001'),

-- Cliente sem limite de fiado
('José Antonio Pereira', '(11) 91098-7654', 'bom', 0.00, 'Rua Oscar Freire', '250', 'Jardins', 'São Paulo', '01426-000'),

-- Clientes sem endereço completo
('Luciana Mendes', '(11) 90987-6543', 'bom', 250.00, NULL, NULL, NULL, 'São Paulo', NULL),
('Ricardo Ferreira', '(11) 98876-5432', 'medio', 180.00, NULL, NULL, NULL, 'São Paulo', NULL);

-- ============================================================
-- INSERIR FUNCIONÁRIOS
-- ============================================================
INSERT INTO Funcionario (Nome, ID_Cargo) VALUES
-- Gerente
('Amanda Souza Silva', 4),

-- Caixas
('Bruno Henrique Dias', 2),
('Carla Oliveira Santos', 2),

-- Atendentes
('Daniel Costa Lima', 1),
('Eduarda Martins Rocha', 1),
('Felipe Alves Pereira', 1),

-- Padeiros
('Gabriel Santos Oliveira', 3),
('Helena Lima Costa', 3);

-- ============================================================
-- INSERIR PRODUTOS
-- ============================================================

-- PÃES (ID_Tipo_Produto = 1)
INSERT INTO Produto (Nome, Unidade_Medida, Preco_Base, Estoque_Atual, ID_Tipo_Produto) VALUES
('Pão Francês', 'unidade', 0.80, 500.000, 1),
('Pão de Forma Integral', 'unidade', 8.50, 45.000, 1),
('Pão de Queijo', 'unidade', 2.50, 200.000, 1),
('Pão Italiano', 'unidade', 12.00, 30.000, 1),
('Pão de Batata', 'unidade', 3.50, 80.000, 1),
('Pão de Centeio', 'unidade', 9.00, 25.000, 1),
('Bisnaga', 'unidade', 1.20, 150.000, 1);

-- SALGADOS (ID_Tipo_Produto = 2)
INSERT INTO Produto (Nome, Unidade_Medida, Preco_Base, Estoque_Atual, ID_Tipo_Produto) VALUES
('Coxinha de Frango', 'unidade', 7.50, 100.000, 2),
('Pastel de Carne', 'unidade', 6.00, 80.000, 2),
('Empada de Palmito', 'unidade', 8.00, 60.000, 2),
('Esfiha de Carne', 'unidade', 5.50, 90.000, 2),
('Quibe Frito', 'unidade', 7.00, 70.000, 2),
('Risole de Queijo', 'unidade', 6.50, 85.000, 2),
('Enroladinho de Salsicha', 'unidade', 5.00, 95.000, 2);

-- DOCES (ID_Tipo_Produto = 3)
INSERT INTO Produto (Nome, Unidade_Medida, Preco_Base, Estoque_Atual, ID_Tipo_Produto) VALUES
('Brigadeiro', 'unidade', 3.50, 150.000, 3),
('Beijinho', 'unidade', 3.50, 140.000, 3),
('Brownie', 'fatia', 9.00, 35.000, 3),
('Torta de Limão', 'fatia', 12.00, 20.000, 3),
('Pudim de Leite', 'fatia', 8.00, 25.000, 3),
('Mil Folhas', 'unidade', 10.00, 30.000, 3),
('Carolina', 'unidade', 7.50, 40.000, 3);

-- BEBIDAS (ID_Tipo_Produto = 4)
INSERT INTO Produto (Nome, Unidade_Medida, Preco_Base, Estoque_Atual, ID_Tipo_Produto) VALUES
('Café Expresso', 'unidade', 4.50, 1000.000, 4),
('Café com Leite', 'unidade', 6.00, 1000.000, 4),
('Cappuccino', 'unidade', 8.00, 500.000, 4),
('Suco de Laranja Natural', 'unidade', 10.00, 200.000, 4),
('Refrigerante Lata', 'unidade', 5.00, 180.000, 4),
('Água Mineral 500ml', 'unidade', 3.00, 300.000, 4),
('Achocolatado', 'unidade', 7.00, 150.000, 4);

-- CONFEITARIA (ID_Tipo_Produto = 5)
INSERT INTO Produto (Nome, Unidade_Medida, Preco_Base, Estoque_Atual, ID_Tipo_Produto) VALUES
('Bolo de Chocolate', 'kg', 65.00, 12.000, 5),
('Bolo de Cenoura com Chocolate', 'kg', 60.00, 10.000, 5),
('Torta de Morango', 'kg', 85.00, 5.000, 5),
('Bolo de Fubá', 'kg', 45.00, 8.000, 5),
('Sonho', 'unidade', 6.00, 50.000, 5),
('Croissant', 'unidade', 8.50, 40.000, 5);

-- ============================================================
-- INSERIR VENDAS
-- ============================================================

-- VENDA 1: Cliente Maria - Pagamento Dinheiro - Funcionário Daniel
INSERT INTO Venda (Data_Hora, Tipo_Pagamento, Valor_Total, ID_Cliente, ID_Funcionario, Status) VALUES
('2025-10-20 08:30:00', 'dinheiro', 25.30, 1, 4, 'finalizada');

SET @venda1 = LAST_INSERT_ID();

INSERT INTO Item_Venda (ID_Venda, ID_Produto, Quantidade, Preco_Unitario) VALUES
(@venda1, 1, 10.000, 0.80),   -- 10 Pães Franceses
(@venda1, 8, 2.000, 7.50),    -- 2 Coxinhas
(@venda1, 22, 1.000, 4.50);   -- 1 Café Expresso

-- VENDA 2: Cliente João - Pagamento Cartão - Funcionário Bruno
INSERT INTO Venda (Data_Hora, Tipo_Pagamento, Valor_Total, ID_Cliente, ID_Funcionario, Status) VALUES
('2025-10-20 09:15:00', 'cartao', 47.50, 2, 2, 'finalizada');

SET @venda2 = LAST_INSERT_ID();

INSERT INTO Item_Venda (ID_Venda, ID_Produto, Quantidade, Preco_Unitario) VALUES
(@venda2, 2, 1.000, 8.50),    -- 1 Pão de Forma Integral
(@venda2, 11, 3.000, 5.50),   -- 3 Esfihas
(@venda2, 17, 2.000, 9.00),   -- 2 Brownies
(@venda2, 24, 1.000, 10.00);  -- 1 Suco de Laranja

-- VENDA 3: Cliente Ana - Pagamento Fiado (EM ABERTO) - Funcionário Carla
INSERT INTO Venda (Data_Hora, Tipo_Pagamento, Valor_Total, ID_Cliente, ID_Funcionario, Status, Data_Pagamento_Fiado) VALUES
('2025-10-21 10:00:00', 'fiado', 156.00, 3, 3, 'finalizada', NULL);

SET @venda3 = LAST_INSERT_ID();

INSERT INTO Item_Venda (ID_Venda, ID_Produto, Quantidade, Preco_Unitario) VALUES
(@venda3, 29, 2.000, 65.00),  -- 2kg Bolo de Chocolate
(@venda3, 15, 2.000, 8.00),   -- 2 Risoles
(@venda3, 23, 2.000, 8.00);   -- 2 Cappuccinos

-- VENDA 4: Cliente Carlos - Pagamento Pix - Funcionário Eduarda
INSERT INTO Venda (Data_Hora, Tipo_Pagamento, Valor_Total, ID_Cliente, ID_Funcionario, Status) VALUES
('2025-10-21 14:30:00', 'pix', 33.00, 4, 5, 'finalizada');

SET @venda4 = LAST_INSERT_ID();

INSERT INTO Item_Venda (ID_Venda, ID_Produto, Quantidade, Preco_Unitario) VALUES
(@venda4, 1, 5.000, 0.80),    -- 5 Pães Franceses
(@venda4, 3, 4.000, 2.50),    -- 4 Pães de Queijo
(@venda4, 22, 3.000, 4.50),   -- 3 Cafés Expressos
(@venda4, 15, 1.000, 8.00);   -- 1 Brigadeiro

-- VENDA 5: Cliente Fernanda - Pagamento Fiado (EM ABERTO) - Funcionário Daniel
INSERT INTO Venda (Data_Hora, Tipo_Pagamento, Valor_Total, ID_Cliente, ID_Funcionario, Status, Data_Pagamento_Fiado) VALUES
('2025-10-22 08:45:00', 'fiado', 87.50, 5, 4, 'finalizada', NULL);

SET @venda5 = LAST_INSERT_ID();

INSERT INTO Item_Venda (ID_Venda, ID_Produto, Quantidade, Preco_Unitario) VALUES
(@venda5, 30, 1.000, 60.00),  -- 1kg Bolo de Cenoura
(@venda5, 9, 2.000, 6.00),    -- 2 Pasteis
(@venda5, 15, 2.000, 3.50),   -- 2 Brigadeiros
(@venda5, 23, 2.000, 8.00);   -- 2 Cappuccinos

-- VENDA 6: Cliente Roberto - Pagamento Fiado (QUITADO) - Funcionário Bruno
INSERT INTO Venda (Data_Hora, Tipo_Pagamento, Valor_Total, ID_Cliente, ID_Funcionario, Status, Data_Pagamento_Fiado) VALUES
('2025-10-22 11:00:00', 'fiado', 45.00, 6, 2, 'finalizada', '2025-10-23 16:00:00');

SET @venda6 = LAST_INSERT_ID();

INSERT INTO Item_Venda (ID_Venda, ID_Produto, Quantidade, Preco_Unitario) VALUES
(@venda6, 1, 20.000, 0.80),   -- 20 Pães Franceses
(@venda6, 8, 3.000, 7.50),    -- 3 Coxinhas
(@venda6, 26, 2.000, 5.00);   -- 2 Refrigerantes

-- VENDA 7: Cliente Luciana - Pagamento Dinheiro - Funcionário Felipe
INSERT INTO Venda (Data_Hora, Tipo_Pagamento, Valor_Total, ID_Cliente, ID_Funcionario, Status) VALUES
('2025-10-23 07:30:00', 'dinheiro', 72.50, 9, 6, 'finalizada');

SET @venda7 = LAST_INSERT_ID();

INSERT INTO Item_Venda (ID_Venda, ID_Produto, Quantidade, Preco_Unitario) VALUES
(@venda7, 4, 2.000, 12.00),   -- 2 Pães Italianos
(@venda7, 10, 3.000, 8.00),   -- 3 Empadas
(@venda7, 18, 2.000, 12.00),  -- 2 Tortas de Limão
(@venda7, 24, 2.000, 10.00);  -- 2 Sucos de Laranja

-- VENDA 8: Cliente Ricardo - Pagamento Cartão - Funcionário Carla
INSERT INTO Venda (Data_Hora, Tipo_Pagamento, Valor_Total, ID_Cliente, ID_Funcionario, Status) VALUES
('2025-10-23 13:20:00', 'cartao', 28.00, 10, 3, 'finalizada');

SET @venda8 = LAST_INSERT_ID();

INSERT INTO Item_Venda (ID_Venda, ID_Produto, Quantidade, Preco_Unitario) VALUES
(@venda8, 7, 5.000, 1.20),    -- 5 Bisnagas
(@venda8, 12, 2.000, 7.00),   -- 2 Quibes
(@venda8, 22, 2.000, 4.50);   -- 2 Cafés Expressos

-- ============================================================
-- ATUALIZAR ESTOQUE APÓS VENDAS
-- ============================================================

-- Atualizar estoque para refletir as vendas (manualmente para dados de teste)
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 35 WHERE ID_Produto = 1;  -- Pão Francês (10+5+20)
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 1 WHERE ID_Produto = 2;   -- Pão de Forma
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 4 WHERE ID_Produto = 3;   -- Pão de Queijo
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 2 WHERE ID_Produto = 4;   -- Pão Italiano
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 5 WHERE ID_Produto = 7;   -- Bisnaga
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 5 WHERE ID_Produto = 8;   -- Coxinha (2+3)
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 2 WHERE ID_Produto = 9;   -- Pastel
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 3 WHERE ID_Produto = 10;  -- Empada
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 3 WHERE ID_Produto = 11;  -- Esfiha
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 2 WHERE ID_Produto = 12;  -- Quibe
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 3 WHERE ID_Produto = 13;  -- Risole (2+1)
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 3 WHERE ID_Produto = 15;  -- Brigadeiro (1+2)
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 2 WHERE ID_Produto = 17;  -- Brownie
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 2 WHERE ID_Produto = 18;  -- Torta de Limão
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 7 WHERE ID_Produto = 22;  -- Café Expresso (1+3+2+2)
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 4 WHERE ID_Produto = 23;  -- Cappuccino (2+2)
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 3 WHERE ID_Produto = 24;  -- Suco de Laranja (1+2)
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 2 WHERE ID_Produto = 26;  -- Refrigerante
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 2.0 WHERE ID_Produto = 29; -- Bolo de Chocolate (2kg)
UPDATE Produto SET Estoque_Atual = Estoque_Atual - 1.0 WHERE ID_Produto = 30; -- Bolo de Cenoura (1kg)

-- ============================================================
-- CONSULTAS DE VERIFICAÇÃO
-- ============================================================

-- Verificar dados inseridos
SELECT '========== RESUMO DOS DADOS INSERIDOS ==========' AS '';

SELECT 'CARGOS' AS Tabela, COUNT(*) AS Total FROM Cargo
UNION ALL
SELECT 'TIPOS DE PRODUTO', COUNT(*) FROM Tipo_Produto
UNION ALL
SELECT 'CLIENTES', COUNT(*) FROM Cliente
UNION ALL
SELECT 'FUNCIONÁRIOS', COUNT(*) FROM Funcionario
UNION ALL
SELECT 'PRODUTOS', COUNT(*) FROM Produto
UNION ALL
SELECT 'VENDAS', COUNT(*) FROM Venda
UNION ALL
SELECT 'ITENS DE VENDA', COUNT(*) FROM Item_Venda;

-- Verificar crédito dos clientes
SELECT '========== CRÉDITO DOS CLIENTES ==========' AS '';
SELECT * FROM vw_credito_cliente;

-- Verificar produtos com estoque atualizado
SELECT '========== PRODUTOS COM ESTOQUE BAIXO (< 50) ==========' AS '';
SELECT 
    ID_Produto,
    Nome,
    Unidade_Medida,
    Preco_Base,
    Estoque_Atual,
    Tipo_Produto
FROM vw_produtos_completo
WHERE Estoque_Atual < 50
ORDER BY Estoque_Atual ASC;

-- Verificar vendas realizadas
SELECT '========== RESUMO DAS VENDAS ==========' AS '';
SELECT 
    ID_Venda,
    DATE_FORMAT(Data_Hora, '%d/%m/%Y %H:%i') AS Data_Hora,
    Nome_Cliente,
    Nome_Funcionario,
    Tipo_Pagamento,
    CONCAT('R$ ', FORMAT(Valor_Total, 2, 'pt_BR')) AS Valor_Total,
    Status_Pagamento
FROM vw_vendas_completo
ORDER BY Data_Hora DESC;

-- Verificar total vendido por forma de pagamento
SELECT '========== VENDAS POR FORMA DE PAGAMENTO ==========' AS '';
SELECT 
    Tipo_Pagamento,
    COUNT(*) AS Quantidade_Vendas,
    CONCAT('R$ ', FORMAT(SUM(Valor_Total), 2, 'pt_BR')) AS Total_Vendido
FROM Venda
WHERE Status = 'finalizada'
GROUP BY Tipo_Pagamento
ORDER BY SUM(Valor_Total) DESC;

-- Verificar produtos mais vendidos
SELECT '========== TOP 10 PRODUTOS MAIS VENDIDOS ==========' AS '';
SELECT 
    p.Nome AS Produto,
    tp.Nome_Tipo AS Tipo,
    SUM(iv.Quantidade) AS Total_Vendido,
    p.Unidade_Medida,
    CONCAT('R$ ', FORMAT(SUM(iv.Quantidade * iv.Preco_Unitario), 2, 'pt_BR')) AS Faturamento
FROM Item_Venda iv
INNER JOIN Produto p ON iv.ID_Produto = p.ID_Produto
INNER JOIN Tipo_Produto tp ON p.ID_Tipo_Produto = tp.ID_Tipo_Produto
GROUP BY p.ID_Produto, p.Nome, tp.Nome_Tipo, p.Unidade_Medida
ORDER BY SUM(iv.Quantidade * iv.Preco_Unitario) DESC
LIMIT 10;

-- Verificar vendas a fiado em aberto
SELECT '========== VENDAS A FIADO EM ABERTO ==========' AS '';
SELECT 
    v.ID_Venda,
    c.Nome AS Cliente,
    DATE_FORMAT(v.Data_Hora, '%d/%m/%Y') AS Data_Venda,
    DATEDIFF(NOW(), v.Data_Hora) AS Dias_Em_Aberto,
    CONCAT('R$ ', FORMAT(v.Valor_Total, 2, 'pt_BR')) AS Valor
FROM Venda v
INNER JOIN Cliente c ON v.ID_Cliente = c.ID_Cliente
WHERE v.Tipo_Pagamento = 'fiado' 
  AND v.Data_Pagamento_Fiado IS NULL
  AND v.Status = 'finalizada'
ORDER BY v.Data_Hora ASC;

-- Verificar desempenho dos funcionários
SELECT '========== DESEMPENHO DOS FUNCIONÁRIOS ==========' AS '';
SELECT 
    f.Nome AS Funcionario,
    cg.Nome_Cargo AS Cargo,
    COUNT(v.ID_Venda) AS Total_Vendas,
    CONCAT('R$ ', FORMAT(SUM(v.Valor_Total), 2, 'pt_BR')) AS Total_Vendido,
    CONCAT('R$ ', FORMAT(AVG(v.Valor_Total), 2, 'pt_BR')) AS Ticket_Medio
FROM Funcionario f
INNER JOIN Cargo cg ON f.ID_Cargo = cg.ID_Cargo
LEFT JOIN Venda v ON f.ID_Funcionario = v.ID_Funcionario AND v.Status = 'finalizada'
GROUP BY f.ID_Funcionario, f.Nome, cg.Nome_Cargo
ORDER BY SUM(v.Valor_Total) DESC;

-- ============================================================
-- QUERIES ÚTEIS PARA O SISTEMA
-- ============================================================

-- Query para validar crédito antes de venda fiado
SELECT '========== EXEMPLO: VALIDAR CRÉDITO DO CLIENTE ==========' AS '';
SELECT 
    ID_Cliente,
    Nome,
    Limite_Fiado,
    Total_Em_Aberto,
    Credito_Disponivel,
    CASE 
        WHEN Credito_Disponivel >= 100 THEN 'APROVADO para venda de R$ 100,00'
        ELSE CONCAT('NEGADO - Disponível apenas R$ ', FORMAT(Credito_Disponivel, 2, 'pt_BR'))
    END AS Status_Validacao
FROM vw_credito_cliente
WHERE ID_Cliente = 3;

-- Query para buscar produtos por tipo
SELECT '========== EXEMPLO: PRODUTOS DO TIPO PÃES ==========' AS '';
SELECT * FROM vw_produtos_completo WHERE Tipo_Produto = 'paes' LIMIT 5;

-- ============================================================
-- FIM DO SCRIPT DE SEED
-- ============================================================

SELECT '========== DADOS DE TESTE INSERIDOS COM SUCESSO! ==========' AS '';