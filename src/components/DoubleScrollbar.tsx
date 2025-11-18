import React, { useEffect, useRef } from 'react';

interface DoubleScrollbarProps {
  children: React.ReactNode;
}

export const DoubleScrollbar: React.FC<DoubleScrollbarProps> = ({ children }) => {
  const topScrollRef = useRef<HTMLDivElement>(null);
  const bottomScrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const topScroll = topScrollRef.current;
    const bottomScroll = bottomScrollRef.current;
    const content = contentRef.current;

    if (!topScroll || !bottomScroll || !content) return;

    // Atualizar largura do scroll superior
    const updateTopScrollWidth = () => {
      if (topScroll && content) {
        const scrollContent = topScroll.querySelector('div');
        if (scrollContent) {
          scrollContent.style.width = `${content.scrollWidth}px`;
        }
      }
    };

    // Sincronizar scroll: top -> bottom
    const handleTopScroll = () => {
      if (bottomScroll && topScroll) {
        bottomScroll.scrollLeft = topScroll.scrollLeft;
      }
    };

    // Sincronizar scroll: bottom -> top
    const handleBottomScroll = () => {
      if (topScroll && bottomScroll) {
        topScroll.scrollLeft = bottomScroll.scrollLeft;
      }
    };

    // Atualizar largura inicial
    updateTopScrollWidth();

    // Observar mudanças de tamanho
    const resizeObserver = new ResizeObserver(updateTopScrollWidth);
    resizeObserver.observe(content);

    // Adicionar event listeners
    topScroll.addEventListener('scroll', handleTopScroll);
    bottomScroll.addEventListener('scroll', handleBottomScroll);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      topScroll.removeEventListener('scroll', handleTopScroll);
      bottomScroll.removeEventListener('scroll', handleBottomScroll);
    };
  }, []);

  return (
    <div className="w-full">
      {/* Barra de scroll superior */}
      <div 
        ref={topScrollRef}
        className="overflow-x-auto overflow-y-hidden mb-2"
        style={{ height: '17px' }}
      >
        <div style={{ height: '1px' }}></div>
      </div>

      {/* Conteúdo com scroll */}
      <div 
        ref={bottomScrollRef}
        className="overflow-x-auto overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 350px)' }}
      >
        <div ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  );
};
