// src/components/common/Card.jsx

/**
 * 🃏 COMPONENTE CARD
 * 
 * Um cartão/container para agrupar conteúdo relacionado.
 * Usado para exibir produtos, clientes, estatísticas, etc.
 * 
 * Conceito: Composição de Componentes
 * - Card pode ter: título, corpo, rodapé
 * - Cada parte é opcional
 * - Você monta como LEGO
 */

import React from 'react';

/**
 * ============================================================
 * 📦 COMPONENTE PRINCIPAL: CARD
 * ============================================================
 */

/**
 * Container principal do Card
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Conteúdo do card
 * @param {String} props.className - Classes CSS extras
 * @param {Function} props.onClick - Função ao clicar (card clicável)
 * @param {Boolean} props.hover - Efeito hover
 * 
 * Exemplo de uso:
 * <Card>
 *   <Card.Header>Título</Card.Header>
 *   <Card.Body>Conteúdo</Card.Body>
 * </Card>
 */
const Card = ({ 
  children, 
  className = '', 
  onClick,
  hover = false,
  ...rest 
}) => {
  // Classes base do card
  const baseClasses = 'bg-white rounded-lg shadow-md overflow-hidden';
  
  // Classes se for clicável
  const clickableClasses = onClick 
    ? 'cursor-pointer transition-transform hover:scale-105' 
    : '';
  
  // Classes de hover
  const hoverClasses = hover 
    ? 'hover:shadow-lg transition-shadow' 
    : '';
  
  // Junta todas as classes
  const cardClasses = `
    ${baseClasses}
    ${clickableClasses}
    ${hoverClasses}
    ${className}
  `.trim();
  
  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
};

/**
 * ============================================================
 * 📋 COMPONENTE: CARD HEADER
 * ============================================================
 */

/**
 * Cabeçalho do Card (parte superior)
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Conteúdo do header
 * @param {String} props.className - Classes extras
 * 
 * Exemplo de uso:
 * <Card.Header>
 *   <h2>Título do Card</h2>
 * </Card.Header>
 */
Card.Header = ({ children, className = '', ...rest }) => {
  return (
    <div 
      className={`px-6 py-4 border-b border-gray-200 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

/**
 * ============================================================
 * 📄 COMPONENTE: CARD BODY
 * ============================================================
 */

/**
 * Corpo do Card (conteúdo principal)
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Conteúdo do body
 * @param {String} props.className - Classes extras
 * 
 * Exemplo de uso:
 * <Card.Body>
 *   <p>Conteúdo aqui...</p>
 * </Card.Body>
 */
Card.Body = ({ children, className = '', ...rest }) => {
  return (
    <div 
      className={`px-6 py-4 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

/**
 * ============================================================
 * 🦶 COMPONENTE: CARD FOOTER
 * ============================================================
 */

/**
 * Rodapé do Card (parte inferior)
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Conteúdo do footer
 * @param {String} props.className - Classes extras
 * 
 * Exemplo de uso:
 * <Card.Footer>
 *   <Button>Ação</Button>
 * </Card.Footer>
 */
Card.Footer = ({ children, className = '', ...rest }) => {
  return (
    <div 
      className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

/**
 * ============================================================
 * 📊 COMPONENTE: CARD STAT (ESTATÍSTICA)
 * ============================================================
 */

/**
 * Card especial para mostrar estatísticas (Dashboard)
 * 
 * @param {Object} props
 * @param {String} props.titulo - Título da estatística
 * @param {String|Number} props.valor - Valor principal
 * @param {ReactNode} props.icone - Ícone (opcional)
 * @param {String} props.cor - Cor do ícone
 * @param {String} props.subtitulo - Texto adicional
 * 
 * Exemplo de uso:
 * <Card.Stat
 *   titulo="Total de Vendas"
 *   valor="R$ 1.500,00"
 *   icone={<ShoppingCart />}
 *   cor="blue"
 * />
 */
Card.Stat = ({ 
  titulo, 
  valor, 
  icone, 
  cor = 'blue',
  subtitulo,
  className = '',
  ...rest 
}) => {
  // Classes de cor do ícone
  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  };
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 ${className}`}
      {...rest}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">
            {titulo}
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {valor}
          </p>
          {subtitulo && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitulo}
            </p>
          )}
        </div>
        
        {icone && (
          <div className={`
            p-3 rounded-full 
            ${iconColorClasses[cor] || iconColorClasses.blue}
          `}>
            {icone}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ============================================================
 * 📤 EXPORTAR COMPONENTE
 * ============================================================
 */

export default Card;


/**
 * ============================================================
 * 📖 EXEMPLOS DE USO
 * ============================================================
 */

/**
 * EXEMPLO 1: Card Simples
 * 
 * <Card>
 *   <Card.Header>
 *     <h3 className="text-lg font-semibold">Produto</h3>
 *   </Card.Header>
 *   <Card.Body>
 *     <p>Pão Francês - R$ 0,50</p>
 *   </Card.Body>
 * </Card>
 */

/**
 * EXEMPLO 2: Card com Footer
 * 
 * <Card>
 *   <Card.Header>
 *     <h3>Cliente: José Silva</h3>
 *   </Card.Header>
 *   <Card.Body>
 *     <p>Telefone: (11) 98765-4321</p>
 *     <p>Crédito: R$ 150,00</p>
 *   </Card.Body>
 *   <Card.Footer>
 *     <Button variant="primary">Editar</Button>
 *     <Button variant="danger">Excluir</Button>
 *   </Card.Footer>
 * </Card>
 */

/**
 * EXEMPLO 3: Card Clicável
 * 
 * <Card 
 *   hover 
 *   onClick={() => abrirDetalhes(produto.id)}
 * >
 *   <Card.Body>
 *     <h4>{produto.nome}</h4>
 *     <p>{produto.preco}</p>
 *   </Card.Body>
 * </Card>
 */

/**
 * EXEMPLO 4: Card de Estatística (Dashboard)
 * 
 * import { DollarSign } from 'lucide-react';
 * 
 * <Card.Stat
 *   titulo="Vendas Hoje"
 *   valor="R$ 1.250,00"
 *   icone={<DollarSign size={24} />}
 *   cor="green"
 *   subtitulo="15 vendas realizadas"
 * />
 */

/**
 * EXEMPLO 5: Grid de Cards
 * 
 * <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 *   <Card.Stat titulo="Produtos" valor="120" cor="blue" />
 *   <Card.Stat titulo="Clientes" valor="45" cor="green" />
 *   <Card.Stat titulo="Vendas" valor="R$ 5.000" cor="purple" />
 * </div>
 */