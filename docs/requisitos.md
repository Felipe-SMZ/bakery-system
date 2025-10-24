📋 Documento de Requisitos Funcionais
Sistema de Gestão de Padaria
Versão: 1.0
Data: 23/10/2025
Autor: Felipe
Projeto: Trabalho de Faculdade - Sistema de Gestão de Padaria
________________________________________
1. VISÃO GERAL DO SISTEMA
1.1 Objetivo
Desenvolver um sistema web para gerenciar operações de uma padaria, incluindo controle de produtos, clientes, funcionários e vendas, com ênfase no controle de crédito (fiado) e estoque.
1.2 Escopo
O sistema permitirá:
•	Cadastro e gestão de produtos, clientes e funcionários
•	Registro de vendas com múltiplas formas de pagamento
•	Controle de estoque automático
•	Validação de limite de crédito para vendas a fiado
•	Geração de relatórios gerenciais
•	Dashboard com indicadores principais
1.3 Usuários do Sistema
•	Atendentes: Registram vendas
•	Caixas: Processam pagamentos e registram vendas
•	Gerentes: Acesso completo ao sistema e relatórios
•	Padeiros: Consulta de produtos e estoque (futuro)
________________________________________
2. REQUISITOS FUNCIONAIS
RF01 - Gestão de Tipos de Produto
Descrição: O sistema deve permitir o cadastro de tipos/categorias de produtos.
Prioridade: Alta
Funcionalidades:
•	RF01.1 - Cadastrar novo tipo de produto 
o	Campos obrigatórios: Nome do tipo
o	Validação: Nome único (sem duplicatas)
•	RF01.2 - Listar todos os tipos de produto 
o	Ordenação: alfabética
•	RF01.3 - Editar tipo de produto 
o	Permite alterar o nome
•	RF01.4 - Excluir tipo de produto 
o	Restrição: Não permitir exclusão se houver produtos vinculados
Regras de Negócio:
•	RN01.1: Tipos padrão sugeridos: pães, salgados, doces, bebidas, confeitaria
________________________________________
RF02 - Gestão de Produtos
Descrição: O sistema deve permitir o cadastro e controle completo de produtos.
Prioridade: Alta
Funcionalidades:
•	RF02.1 - Cadastrar novo produto 
o	Campos obrigatórios: Nome, Tipo, Unidade de Medida, Preço Base, Estoque Inicial
o	Validação: Preço > 0, Estoque >= 0
•	RF02.2 - Listar produtos 
o	Filtros: Por tipo de produto
o	Busca: Por nome (parcial)
o	Exibir: Código, nome, tipo, unidade, preço, estoque atual
•	RF02.3 - Editar produto 
o	Permite alterar: nome, tipo, unidade, preço, estoque
•	RF02.4 - Excluir produto 
o	Restrição: Não permitir exclusão se houver vendas históricas
o	Sugestão: Marcar como "inativo" ao invés de deletar
•	RF02.5 - Ajustar estoque manualmente 
o	Permite adicionar ou remover quantidade
o	Registra motivo do ajuste (entrada de mercadoria, perda, etc.)
•	RF02.6 - Consultar histórico de movimentação de estoque 
o	Exibir: vendas, ajustes manuais, datas
Regras de Negócio:
•	RN02.1: Unidades de medida permitidas: unidade, kg, fatia
•	RN02.2: Estoque é atualizado automaticamente a cada venda
•	RN02.3: Alerta quando estoque < 10 unidades (ou valor configurável)
________________________________________
RF03 - Gestão de Cargos
Descrição: O sistema deve permitir o cadastro de cargos para funcionários.
Prioridade: Média
Funcionalidades:
•	RF03.1 - Cadastrar cargo
o	Campos obrigatórios: Nome do cargo
•	RF03.2 - Listar cargos
•	RF03.3 - Editar cargo
•	RF03.4 - Excluir cargo
o	Restrição: Não permitir se houver funcionários vinculados
Regras de Negócio:
•	RN03.1: Cargos padrão: atendente, caixa, padeiro, gerente
________________________________________
RF04 - Gestão de Funcionários
Descrição: O sistema deve permitir o cadastro de funcionários.
Prioridade: Alta
Funcionalidades:
•	RF04.1 - Cadastrar funcionário 
o	Campos obrigatórios: Nome, Cargo
•	RF04.2 - Listar funcionários 
o	Filtros: Por cargo
o	Exibir: Código, nome, cargo
•	RF04.3 - Editar funcionário 
o	Permite alterar: nome, cargo
•	RF04.4 - Excluir funcionário 
o	Restrição: Não permitir se houver vendas registradas
•	RF04.5 - Consultar vendas por funcionário 
o	Exibir: quantidade de vendas, valor total vendido, período
Regras de Negócio:
•	RN04.1: Todo funcionário deve ter um cargo definido
________________________________________
RF05 - Gestão de Clientes
Descrição: O sistema deve permitir o cadastro completo de clientes com controle de crédito.
Prioridade: Alta
Funcionalidades:
•	RF05.1 - Cadastrar cliente 
o	Campos obrigatórios: Nome, Telefone, Status, Limite de Fiado
o	Campos opcionais: Endereço completo (Rua, Número, Bairro, Cidade, CEP)
o	Validação: Telefone formato válido, CEP formato válido
•	RF05.2 - Listar clientes 
o	Filtros: Por status (bom, médio, ruim)
o	Busca: Por nome ou telefone (parcial)
o	Exibir: Código, nome, telefone, status, limite de fiado, crédito disponível
•	RF05.3 - Visualizar detalhes do cliente 
o	Exibir: Dados cadastrais completos
o	Exibir: Crédito disponível calculado em tempo real
o	Exibir: Total em aberto (vendas a fiado não quitadas)
o	Listar: Histórico de compras
•	RF05.4 - Editar cliente 
o	Permite alterar: todos os dados cadastrais e limite de fiado
•	RF05.5 - Excluir cliente 
o	Restrição: Não permitir se houver vendas registradas
•	RF05.6 - Consultar histórico de compras do cliente 
o	Filtros: Por período
o	Exibir: Número da venda, data, valor, forma de pagamento, status
Regras de Negócio:
•	RN05.1: Status permitidos: 'bom', 'médio', 'ruim'
•	RN05.2: Limite de fiado deve ser >= 0
•	RN05.3: Crédito disponível = Limite de fiado - Total de vendas a fiado em aberto
•	RN05.4: Cliente com status 'ruim' pode ter limite reduzido ou bloqueado
________________________________________
RF06 - Processamento de Vendas ⭐ (PRINCIPAL)
Descrição: O sistema deve permitir o registro completo de vendas com validações de crédito e estoque.
Prioridade: Crítica
Funcionalidades:
RF06.1 - Iniciar Nova Venda
•	Selecionar cliente (obrigatório)
•	Selecionar funcionário responsável (obrigatório)
•	Escolher forma de pagamento: dinheiro, cartão, pix, fiado
•	Sistema registra data/hora automaticamente
RF06.2 - Adicionar Produtos à Venda
•	Buscar produto por nome ou código
•	Informar quantidade
•	Sistema exibe preço unitário atual
•	Sistema calcula subtotal automaticamente
•	Validar estoque disponível antes de adicionar
•	Permitir adicionar múltiplos produtos
RF06.3 - Gerenciar Carrinho de Compras
•	Listar produtos adicionados
•	Exibir: produto, quantidade, preço unitário, subtotal
•	Permitir editar quantidade de item
•	Permitir remover item
•	Exibir valor total da venda em tempo real
RF06.4 - Validar Limite de Crédito (se fiado)
•	Automático ao selecionar "fiado": 
o	Calcular crédito disponível do cliente
o	Exibir limite total e disponível
o	Alertar se venda ultrapassa limite
•	Antes de finalizar: 
o	Validar novamente se valor total não excede crédito
o	Bloquear finalização se exceder
o	Exibir mensagem clara com valor disponível
RF06.5 - Finalizar Venda
•	Calcular valor total final
•	Validar todas as regras de negócio
•	Registrar venda no banco de dados
•	Atualizar estoque de todos os produtos
•	Gerar número único da venda
•	Exibir confirmação de sucesso
•	Opção: Imprimir comprovante (futuro)
RF06.6 - Cancelar Venda
•	Permitir cancelamento antes de finalizar
•	Limpar carrinho
•	Não afetar estoque ou crédito
Regras de Negócio:
•	RN06.1: Uma venda deve ter no mínimo 1 produto
•	RN06.2: Não permitir adicionar o mesmo produto duas vezes (somar quantidade)
•	RN06.3: Venda a fiado só é permitida se não ultrapassar crédito disponível
•	RN06.4: Preço unitário capturado é o preço atual do produto no momento da venda
•	RN06.5: Estoque é decrementado automaticamente ao finalizar venda
•	RN06.6: Não permitir venda se estoque insuficiente para qualquer produto
•	RN06.7: Valor total da venda é a soma de todos os subtotais dos itens
Validações Críticas:
ANTES de finalizar venda:
1. Validar estoque de TODOS os produtos
2. SE fiado: validar crédito disponível
3. Validar quantidade > 0 para cada item
4. Validar preço unitário > 0 para cada item
5. Calcular valor total corretamente
________________________________________
RF07 - Consulta de Vendas
Descrição: O sistema deve permitir consultar e filtrar vendas realizadas.
Prioridade: Alta
Funcionalidades:
•	RF07.1 - Listar todas as vendas 
o	Exibir: Número, data/hora, cliente, funcionário, valor total, forma pagamento
o	Ordenação: Por data (mais recente primeiro)
o	Paginação: 20 vendas por página
•	RF07.2 - Filtrar vendas 
o	Por período (data início e fim)
o	Por cliente
o	Por funcionário
o	Por forma de pagamento
o	Por status (quitado/em aberto - se fiado)
•	RF07.3 - Visualizar detalhes da venda 
o	Exibir: Dados do cabeçalho (cliente, funcionário, data, forma pagamento)
o	Exibir: Tabela de itens (produto, quantidade, preço unit., subtotal)
o	Exibir: Valor total
o	Exibir: Status de pagamento (se fiado)
•	RF07.4 - Buscar venda por número 
o	Campo de busca rápida
Regras de Negócio:
•	RN07.1: Vendas não podem ser editadas após finalização
•	RN07.2: Vendas não podem ser excluídas (integridade histórica)
________________________________________
RF08 - Quitação de Fiado (OPCIONAL - Versão 2)
Descrição: O sistema deve permitir registrar a quitação de vendas a fiado.
Prioridade: Baixa (Implementar se sobrar tempo)
Funcionalidades:
•	RF08.1 - Listar vendas a fiado em aberto 
o	Filtro por cliente
o	Exibir: Número, data, valor, dias em aberto
•	RF08.2 - Registrar pagamento 
o	Informar forma de pagamento da quitação
o	Registrar data do pagamento
o	Atualizar status da venda para "quitado"
o	Liberar crédito do cliente
Regras de Negócio:
•	RN08.1: Crédito é liberado apenas após quitação
•	RN08.2: Data de quitação não pode ser anterior à data da venda
________________________________________
RF09 - Relatórios Gerenciais
Descrição: O sistema deve gerar relatórios para análise de desempenho.
Prioridade: Média
Funcionalidades:
•	RF09.1 - Total Vendido por Período 
o	Filtros: data início e fim
o	Exibir: Valor total, quantidade de vendas, ticket médio
o	Agrupar por: dia, semana, mês
•	RF09.2 - Produtos Mais Vendidos 
o	Filtros: período
o	Exibir: Top 10 produtos
o	Ordenar por: quantidade ou valor total
•	RF09.3 - Vendas por Forma de Pagamento 
o	Filtros: período
o	Exibir: Distribuição percentual e valores
o	Gráfico: Pizza ou barras
•	RF09.4 - Desempenho de Funcionários 
o	Filtros: período
o	Exibir: Ranking por quantidade de vendas e valor total
•	RF09.5 - Clientes Devedores 
o	Listar clientes com vendas a fiado em aberto
o	Exibir: Nome, total em aberto, dias em atraso, crédito disponível
•	RF09.6 - Produtos com Estoque Baixo 
o	Exibir produtos com estoque < limite configurável
o	Ordenar por quantidade disponível
Regras de Negócio:
•	RN09.1: Relatórios consideram apenas vendas finalizadas
•	RN09.2: Datas devem estar no formato DD/MM/AAAA
________________________________________
RF10 - Dashboard
Descrição: O sistema deve exibir uma tela inicial com indicadores principais.
Prioridade: Média
Funcionalidades:
•	RF10.1 - Cards de Indicadores 
o	Total de vendas (hoje)
o	Total de vendas (mês atual)
o	Total de clientes cadastrados
o	Total de produtos cadastrados
o	Clientes com crédito excedido
•	RF10.2 - Gráficos 
o	Vendas dos últimos 7 dias (linha)
o	Top 5 produtos mais vendidos (barras)
•	RF10.3 - Últimas Vendas 
o	Listar 5 vendas mais recentes
o	Link para detalhes
Regras de Negócio:
•	RN10.1: Dashboard atualiza em tempo real
•	RN10.2: Valores monetários com 2 casas decimais
________________________________________
3. REQUISITOS NÃO FUNCIONAIS
RNF01 - Performance
•	O sistema deve responder em menos de 2 segundos para operações comuns
•	Listagens devem usar paginação para grandes volumes
RNF02 - Usabilidade
•	Interface intuitiva e responsiva (desktop e mobile)
•	Feedback visual para todas as ações (loading, sucesso, erro)
•	Mensagens de erro claras e orientativas
RNF03 - Segurança
•	Validação de dados no frontend e backend
•	Proteção contra SQL Injection
•	Tratamento de erros sem expor dados sensíveis
RNF04 - Compatibilidade
•	Funcionar em navegadores modernos (Chrome, Firefox, Edge)
•	Responsivo para tablets e smartphones
RNF05 - Manutenibilidade
•	Código limpo e comentado
•	Separação de responsabilidades (MVC)
•	Documentação completa
________________________________________
4. REGRAS DE NEGÓCIO CONSOLIDADAS
ID	Descrição	Prioridade
RN01	Venda a fiado só permitida se não exceder crédito disponível	Crítica
RN02	Estoque atualizado automaticamente após venda	Crítica
RN03	Não permitir venda sem estoque suficiente	Crítica
RN04	Preço de venda captura preço atual do produto	Alta
RN05	Crédito disponível = Limite - Total em aberto	Alta
RN06	Não permitir deletar registros com dependências	Alta
RN07	Vendas finalizadas não podem ser editadas	Alta
RN08	Cliente deve ter status: bom, médio ou ruim	Média
RN09	Unidades de medida: unidade, kg, fatia	Média
RN10	Formas de pagamento: dinheiro, cartão, pix, fiado	Média
________________________________________
5. CASOS DE USO PRIORITÁRIOS
Caso de Uso 1: Realizar Venda a Fiado ⭐
Ator: Atendente/Caixa
Fluxo Principal:
1.	Atendente inicia nova venda
2.	Seleciona cliente
3.	Sistema exibe crédito disponível
4.	Atendente escolhe "fiado" como forma de pagamento
5.	Adiciona produtos ao carrinho
6.	Sistema valida estoque de cada produto
7.	Sistema calcula total em tempo real
8.	Atendente finaliza venda
9.	Sistema valida se total não excede crédito
10.	Sistema registra venda e atualiza estoque
11.	Sistema exibe confirmação
Fluxo Alternativo (Crédito Insuficiente): 5a. Sistema detecta que total excede crédito
5b. Sistema bloqueia finalização
5c. Sistema exibe mensagem: "Crédito insuficiente. Disponível: R$ X,XX"
5d. Atendente remove itens ou cancela venda
________________________________________
Caso de Uso 2: Consultar Situação do Cliente
Ator: Gerente
Fluxo Principal:
1.	Gerente acessa listagem de clientes
2.	Busca cliente por nome
3.	Visualiza detalhes do cliente
4.	Sistema exibe crédito disponível calculado
5.	Sistema lista vendas em aberto (se houver)
6.	Gerente pode editar limite de crédito
________________________________________
6. PRIORIZAÇÃO DE FUNCIONALIDADES (MVP)
🔴 Crítico (Deve estar no MVP)
•	RF02: Gestão de Produtos
•	RF05: Gestão de Clientes
•	RF06: Processamento de Vendas
•	RF07: Consulta de Vendas
🟡 Importante (Implementar se possível)
•	RF01: Gestão de Tipos de Produto
•	RF04: Gestão de Funcionários
•	RF09: Relatórios (pelo menos 3)
•	RF10: Dashboard
🟢 Desejável (Versão 2)
•	RF03: Gestão de Cargos (pode usar valores fixos)
•	RF08: Quitação de Fiado
•	RF09: Relatórios avançados
________________________________________
7. GLOSSÁRIO
Termo	Definição
Fiado	Modalidade de pagamento a prazo, sem juros, com limite de crédito
Crédito Disponível	Valor que o cliente ainda pode comprar a fiado
Ticket Médio	Valor médio por venda (Total vendido / Quantidade de vendas)
MVP	Minimum Viable Product - versão mínima funcional
Estoque Atual	Quantidade disponível do produto no momento
________________________________________
8. CRONOGRAMA DE DESENVOLVIMENTO
Fase	Funcionalidades	Prazo
Setup	Ambiente configurado	24/10
Backend	RF01, RF02, RF04, RF05, RF06	25/10 - 31/10
Frontend	Telas de cadastro e venda	01/11 - 08/11
Integração	Testes e ajustes	09/11 - 11/11
Entrega	Documentação e apresentação	12/11 - 14/11
________________________________________
Aprovação:
•	[ ] Requisitos validados
•	[ ] Escopo definido
•	[ ] Prioridades estabelecidas
Data: //____
Responsável: ________________________

