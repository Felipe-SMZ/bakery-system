-- ============================================================
-- Sistema de Gestão de Padaria
-- Script de Criação do Banco de Dados
-- Versão: 1.0
-- Data: 23/10/2025
-- ============================================================

-- Criar banco de dados
DROP DATABASE IF EXISTS padaria_db;
CREATE DATABASE padaria_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE padaria_db;

-- ============================================================
-- TABELA: Cargo
-- Descrição: Armazena os cargos dos funcionários
-- ============================================================
CREATE TABLE Cargo (
    ID_Cargo INT AUTO_INCREMENT PRIMARY KEY,
    Nome_Cargo VARCHAR(50) NOT NULL UNIQUE,
    
    -- Metadados
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_nome_cargo (Nome_Cargo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABELA: Tipo_Produto
-- Descrição: Armazena as categorias/tipos de produtos
-- ============================================================
CREATE TABLE Tipo_Produto (
    ID_Tipo_Produto INT AUTO_INCREMENT PRIMARY KEY,
    Nome_Tipo VARCHAR(50) NOT NULL UNIQUE,
    
    -- Metadados
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_nome_tipo (Nome_Tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABELA: Cliente
-- Descrição: Armazena dados dos clientes da padaria
-- ============================================================
CREATE TABLE Cliente (
    ID_Cliente INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Telefone VARCHAR(15),
    Status ENUM('bom', 'medio', 'ruim') NOT NULL DEFAULT 'bom',
    Limite_Fiado DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    
    -- Endereço (desmembrado para normalização)
    Rua VARCHAR(100),
    Numero VARCHAR(10),
    Bairro VARCHAR(50),
    Cidade VARCHAR(50),
    CEP VARCHAR(9),
    
    -- Metadados
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_limite_fiado CHECK (Limite_Fiado >= 0),
    
    -- Índices
    INDEX idx_nome_cliente (Nome),
    INDEX idx_telefone (Telefone),
    INDEX idx_status (Status),
    INDEX idx_cidade (Cidade)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABELA: Funcionario
-- Descrição: Armazena dados dos funcionários
-- ============================================================
CREATE TABLE Funcionario (
    ID_Funcionario INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    ID_Cargo INT NOT NULL,
    
    -- Metadados
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_funcionario_cargo 
        FOREIGN KEY (ID_Cargo) 
        REFERENCES Cargo(ID_Cargo)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    -- Índices
    INDEX idx_nome_funcionario (Nome),
    INDEX idx_cargo (ID_Cargo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABELA: Produto
-- Descrição: Armazena o catálogo de produtos
-- ============================================================
CREATE TABLE Produto (
    ID_Produto INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Unidade_Medida ENUM('unidade', 'kg', 'fatia') NOT NULL,
    Preco_Base DECIMAL(10, 2) NOT NULL,
    Estoque_Atual DECIMAL(10, 3) NOT NULL DEFAULT 0.000,
    ID_Tipo_Produto INT NOT NULL,
    
    -- Metadados
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_preco_base CHECK (Preco_Base > 0),
    CONSTRAINT chk_estoque_atual CHECK (Estoque_Atual >= 0),
    
    -- Foreign Keys
    CONSTRAINT fk_produto_tipo 
        FOREIGN KEY (ID_Tipo_Produto) 
        REFERENCES Tipo_Produto(ID_Tipo_Produto)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    -- Índices
    INDEX idx_nome_produto (Nome),
    INDEX idx_tipo_produto (ID_Tipo_Produto),
    INDEX idx_estoque (Estoque_Atual)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABELA: Venda
-- Descrição: Armazena o cabeçalho das vendas
-- ============================================================
CREATE TABLE Venda (
    ID_Venda INT AUTO_INCREMENT PRIMARY KEY,
    Data_Hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Tipo_Pagamento ENUM('dinheiro', 'cartao', 'pix', 'fiado') NOT NULL,
    Valor_Total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ID_Cliente INT NOT NULL,
    ID_Funcionario INT NOT NULL,
    Data_Pagamento_Fiado DATETIME NULL,
    
    -- Status da venda (útil para controle)
    Status ENUM('finalizada', 'cancelada') NOT NULL DEFAULT 'finalizada',
    
    -- Metadados
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_valor_total CHECK (Valor_Total >= 0),
    CONSTRAINT chk_data_pagamento_fiado 
        CHECK (Data_Pagamento_Fiado IS NULL OR Data_Pagamento_Fiado >= Data_Hora),
    
    -- Foreign Keys
    CONSTRAINT fk_venda_cliente 
        FOREIGN KEY (ID_Cliente) 
        REFERENCES Cliente(ID_Cliente)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_venda_funcionario 
        FOREIGN KEY (ID_Funcionario) 
        REFERENCES Funcionario(ID_Funcionario)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    -- Índices
    INDEX idx_data_hora (Data_Hora),
    INDEX idx_tipo_pagamento (Tipo_Pagamento),
    INDEX idx_cliente (ID_Cliente),
    INDEX idx_funcionario (ID_Funcionario),
    INDEX idx_status (Status),
    INDEX idx_data_pagamento_fiado (Data_Pagamento_Fiado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABELA: Item_Venda
-- Descrição: Armazena os itens/produtos de cada venda (N:N)
-- ============================================================
CREATE TABLE Item_Venda (
    ID_Item INT AUTO_INCREMENT PRIMARY KEY,
    ID_Venda INT NOT NULL,
    ID_Produto INT NOT NULL,
    Quantidade DECIMAL(10, 3) NOT NULL,
    Preco_Unitario DECIMAL(10, 2) NOT NULL,
    
    -- Metadados
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_quantidade CHECK (Quantidade > 0),
    CONSTRAINT chk_preco_unitario CHECK (Preco_Unitario > 0),
    
    -- Foreign Keys
    CONSTRAINT fk_item_venda 
        FOREIGN KEY (ID_Venda) 
        REFERENCES Venda(ID_Venda)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_item_produto 
        FOREIGN KEY (ID_Produto) 
        REFERENCES Produto(ID_Produto)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    -- Garantir que o mesmo produto não seja adicionado duas vezes na mesma venda
    CONSTRAINT uk_venda_produto UNIQUE (ID_Venda, ID_Produto),
    
    -- Índices
    INDEX idx_venda (ID_Venda),
    INDEX idx_produto (ID_Produto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- VIEWS ÚTEIS
-- ============================================================

-- View: Credito disponível por cliente
CREATE VIEW vw_credito_cliente AS
SELECT 
    c.ID_Cliente,
    c.Nome,
    c.Limite_Fiado,
    COALESCE(SUM(CASE 
        WHEN v.Tipo_Pagamento = 'fiado' 
        AND v.Data_Pagamento_Fiado IS NULL 
        AND v.Status = 'finalizada'
        THEN v.Valor_Total 
        ELSE 0 
    END), 0) AS Total_Em_Aberto,
    (c.Limite_Fiado - COALESCE(SUM(CASE 
        WHEN v.Tipo_Pagamento = 'fiado' 
        AND v.Data_Pagamento_Fiado IS NULL 
        AND v.Status = 'finalizada'
        THEN v.Valor_Total 
        ELSE 0 
    END), 0)) AS Credito_Disponivel
FROM Cliente c
LEFT JOIN Venda v ON c.ID_Cliente = v.ID_Cliente
GROUP BY c.ID_Cliente, c.Nome, c.Limite_Fiado;

-- View: Produtos com detalhes do tipo
CREATE VIEW vw_produtos_completo AS
SELECT 
    p.ID_Produto,
    p.Nome,
    p.Unidade_Medida,
    p.Preco_Base,
    p.Estoque_Atual,
    tp.Nome_Tipo AS Tipo_Produto
FROM Produto p
INNER JOIN Tipo_Produto tp ON p.ID_Tipo_Produto = tp.ID_Tipo_Produto;

-- View: Vendas com detalhes completos
CREATE VIEW vw_vendas_completo AS
SELECT 
    v.ID_Venda,
    v.Data_Hora,
    v.Tipo_Pagamento,
    v.Valor_Total,
    v.Status,
    c.Nome AS Nome_Cliente,
    f.Nome AS Nome_Funcionario,
    cg.Nome_Cargo AS Cargo_Funcionario,
    v.Data_Pagamento_Fiado,
    CASE 
        WHEN v.Tipo_Pagamento = 'fiado' AND v.Data_Pagamento_Fiado IS NULL 
        THEN 'Em Aberto'
        WHEN v.Tipo_Pagamento = 'fiado' AND v.Data_Pagamento_Fiado IS NOT NULL 
        THEN 'Quitado'
        ELSE 'Pago'
    END AS Status_Pagamento
FROM Venda v
INNER JOIN Cliente c ON v.ID_Cliente = c.ID_Cliente
INNER JOIN Funcionario f ON v.ID_Funcionario = f.ID_Funcionario
INNER JOIN Cargo cg ON f.ID_Cargo = cg.ID_Cargo;

-- ============================================================
-- COMENTÁRIOS DAS TABELAS
-- ============================================================
ALTER TABLE Cargo COMMENT = 'Cargos dos funcionários da padaria';
ALTER TABLE Tipo_Produto COMMENT = 'Categorias/tipos de produtos';
ALTER TABLE Cliente COMMENT = 'Cadastro de clientes com controle de crédito';
ALTER TABLE Funcionario COMMENT = 'Cadastro de funcionários';
ALTER TABLE Produto COMMENT = 'Catálogo de produtos com estoque';
ALTER TABLE Venda COMMENT = 'Cabeçalho das vendas realizadas';
ALTER TABLE Item_Venda COMMENT = 'Itens/produtos de cada venda (relação N:N)';

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================

-- Verificar criação das tabelas
SHOW TABLES;

-- Exibir estrutura de cada tabela
SHOW CREATE TABLE Cargo;
SHOW CREATE TABLE Tipo_Produto;
SHOW CREATE TABLE Cliente;
SHOW CREATE TABLE Funcionario;
SHOW CREATE TABLE Produto;
SHOW CREATE TABLE Venda;
SHOW CREATE TABLE Item_Venda;