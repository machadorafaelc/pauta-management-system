import React, { useEffect, useRef } from 'react';

interface StickyScrollbarProps {
  targetRef: React.RefObject<HTMLDivElement>;
}

export const StickyScrollbar: React.FC<StickyScrollbarProps> = ({ targetRef }) => {
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    const scrollbar = scrollbarRef.current;
    const content = contentRef.current;

    if (!target || !scrollbar || !content) return;

    // Sincronizar largura do conteúdo com a largura scrollável do target
    const updateScrollbarWidth = () => {
      content.style.width = `${target.scrollWidth}px`;
    };

    // Sincronizar scroll: scrollbar -> target
    const handleScrollbarScroll = () => {
      if (target && scrollbar) {
        target.scrollLeft = scrollbar.scrollLeft;
      }
    };

    // Sincronizar scroll: target -> scrollbar
    const handleTargetScroll = () => {
      if (target && scrollbar) {
        scrollbar.scrollLeft = target.scrollLeft;
      }
    };

    // Atualizar largura inicial
    updateScrollbarWidth();

    // Observar mudanças de tamanho no target
    const resizeObserver = new ResizeObserver(updateScrollbarWidth);
    resizeObserver.observe(target);

    // Adicionar event listeners
    scrollbar.addEventListener('scroll', handleScrollbarScroll);
    target.addEventListener('scroll', handleTargetScroll);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      scrollbar.removeEventListener('scroll', handleScrollbarScroll);
      target.removeEventListener('scroll', handleTargetScroll);
    };
  }, [targetRef]);

  return (
    <div 
      ref={scrollbarRef}
      className="fixed bottom-0 left-0 right-0 overflow-x-auto overflow-y-hidden h-4 bg-gray-100 border-t border-gray-300 z-50"
      style={{ scrollbarWidth: 'thin' }}
    >
      <div ref={contentRef} className="h-1"></div>
    </div>
  );
};
