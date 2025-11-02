// src/components/common/Modal.jsx

import { X } from 'lucide-react';
import { useEffect } from 'react';

/**
 * 🪟 COMPONENTE MODAL
 * 
 * CONCEITOS IMPORTANTES:
 * 
 * 1. Props (propriedades):
 *    - isOpen: boolean que controla se modal está aberto
 *    - onClose: função que fecha o modal
 *    - title: título do modal
 *    - children: conteúdo interno (formulário, etc)
 * 
 * 2. Overlay:
 *    - Fundo escurecido que cobre a página
 *    - Clique nele = fecha o modal
 * 
 * 3. useEffect + ESC:
 *    - Detecta quando usuário aperta ESC
 *    - Fecha o modal automaticamente
 */

function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    // ========================================================
    // 🎯 FECHAR COM TECLA ESC
    // ========================================================

    useEffect(() => {
        // Função que detecta tecla pressionada
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        // Se modal estiver aberto, adiciona o listener
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }

        // Cleanup: remove o listener quando modal fechar
        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    // ========================================================
    // 🚫 SE NÃO ESTIVER ABERTO, NÃO RENDERIZA NADA
    // ========================================================

    if (!isOpen) return null;

    // ========================================================
    // 📏 TAMANHOS DO MODAL
    // ========================================================

    const sizes = {
        sm: 'max-w-md',   // Pequeno (400px)
        md: 'max-w-2xl',  // Médio (672px) - padrão
        lg: 'max-w-4xl',  // Grande (896px)
        xl: 'max-w-6xl'   // Extra grande (1152px)
    };

    // ========================================================
    // 🎨 RENDERIZAÇÃO
    // ========================================================

    return (
        // OVERLAY: Fundo escuro que cobre tudo
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={onClose} // Clique no fundo = fecha
        >
            {/* CONTAINER DO MODAL */}
            <div
                className={`
                    relative bg-white rounded-lg shadow-xl w-full ${sizes[size]}
                    max-h-[90vh] flex flex-col
                    animate-fade-in
                `}
                onClick={(e) => e.stopPropagation()} // Clique no modal = NÃO fecha
            >
                {/* ===== CABEÇALHO ===== */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                    {/* Título */}
                    <h2 className="text-2xl font-bold text-gray-900">
                        {title}
                    </h2>

                    {/* Botão Fechar (X) */}
                    <button
                        onClick={onClose}
                        className="
                            text-gray-400 hover:text-gray-600 
                            transition-colors p-1 rounded-lg
                            hover:bg-gray-100
                        "
                        title="Fechar (ESC)"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* ===== CONTEÚDO COM SCROLL ===== */}
                <div className="p-6 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;

/**
 * ════════════════════════════════════════════════════════════
 * 📖 COMO USAR ESTE COMPONENTE
 * ════════════════════════════════════════════════════════════
 * 
 * EXEMPLO 1: Modal Simples
 * 
 * import Modal from './components/common/Modal';
 * 
 * function MinhaPagina() {
 *     const [modalAberto, setModalAberto] = useState(false);
 * 
 *     return (
 *         <>
 *             <button onClick={() => setModalAberto(true)}>
 *                 Abrir Modal
 *             </button>
 * 
 *             <Modal
 *                 isOpen={modalAberto}
 *                 onClose={() => setModalAberto(false)}
 *                 title="Meu Modal"
 *             >
 *                 <p>Conteúdo aqui!</p>
 *             </Modal>
 *         </>
 *     );
 * }
 * 
 * ────────────────────────────────────────────────────────────
 * 
 * EXEMPLO 2: Modal com Tamanho
 * 
 * <Modal
 *     isOpen={modalAberto}
 *     onClose={() => setModalAberto(false)}
 *     title="Modal Grande"
 *     size="lg"
 * >
 *     <p>Conteúdo em modal grande!</p>
 * </Modal>
 * 
 * ────────────────────────────────────────────────────────────
 * 
 * EXEMPLO 3: Modal com Formulário
 * 
 * <Modal
 *     isOpen={modalAberto}
 *     onClose={() => setModalAberto(false)}
 *     title="Novo Produto"
 * >
 *     <form onSubmit={handleSubmit}>
 *         <input type="text" name="nome" />
 *         <button type="submit">Salvar</button>
 *     </form>
 * </Modal>
 * 
 * ════════════════════════════════════════════════════════════
 */