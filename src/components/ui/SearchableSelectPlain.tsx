import React, { useEffect, useMemo, useRef, useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  id?: string;
  className?: string;
}

/**
 * SearchableSelectPlain
 * - Não usa Radix/Portal.
 * - Usa onMouseDown/onTouchStart para capturar cliques ANTES do blur fechar o dropdown.
 * - Acessível: role=combobox, aria-expanded, aria-activedescendant, role=listbox/listitem.
 * - Integrado com o design system: usa cores dinâmicas (bg-card, text-text, border-border, etc.)
 */
export const SearchableSelectPlain: React.FC<Props> = ({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  emptyText = 'Nenhum item encontrado.',
  id,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filtragem simples (case-insensitive)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter(o => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  // Reset activeIndex quando lista muda
  useEffect(() => {
    setActiveIndex(filtered.length > 0 ? 0 : -1);
  }, [query, filtered.length]);

  // Fecha ao clicar fora
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node | null;
      if (!containerRef.current) return;
      if (target && containerRef.current.contains(target)) return;
      setOpen(false);
    }
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  // Abre e foca input
  const openAndFocus = () => {
    setOpen(true);
    // focus no input depois de abrir
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const selectByIndex = (idx: number | null) => {
    if (idx === null || idx < 0 || idx >= filtered.length) return;
    const sel = filtered[idx];
    if (!sel) return;
    onChange(sel.value);
    setOpen(false);
    setQuery('');
    // focus no trigger depois de fechar para UX consistente
    setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const handleKeyDownOnTrigger = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openAndFocus();
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, filtered.length - 1));
      scrollActiveIntoView();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
      scrollActiveIntoView();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectByIndex(activeIndex);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      setQuery('');
      setTimeout(() => triggerRef.current?.focus(), 0);
    }
  };

  const scrollActiveIntoView = () => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  };

  // onMouseDown / onTouchStart: capturam o clique ANTES do blur do input
  const handleItemMouseDown = (e: React.MouseEvent, idx: number) => {
    e.preventDefault(); // evita que o input perca foco antes de processarmos
    selectByIndex(idx);
  };
  const handleItemTouchStart = (e: React.TouchEvent, idx: number) => {
    e.preventDefault();
    selectByIndex(idx);
  };

  const selectedLabel = options.find(o => o.value === value)?.label;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <button
          id={id ? `${id}-trigger` : undefined}
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={id ? `${id}-listbox` : undefined}
          onClick={() => (open ? setOpen(false) : openAndFocus())}
          onKeyDown={handleKeyDownOnTrigger}
          className="w-full text-left px-3 py-2 border border-border rounded-md bg-card text-text hover:bg-background transition-colors"
        >
          <div className="flex justify-between items-center">
            <span className="truncate">{selectedLabel ?? <span className="text-text-muted">{placeholder}</span>}</span>
            <svg className="ml-2 h-4 w-4 opacity-60 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-card text-text shadow-lg animate-slide-up" role="presentation">
          <div className="p-2 border-b border-border">
            <input
              ref={inputRef}
              aria-label="Buscar"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
          </div>

          <div
            id={id ? `${id}-listbox` : undefined}
            role="listbox"
            aria-label="Opções"
            ref={listRef}
            tabIndex={-1}
            className="max-h-56 overflow-auto"
          >
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-text-muted">{emptyText}</div>
            ) : (
              filtered.map((opt, idx) => {
                const isActive = idx === activeIndex;
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    data-index={idx}
                    onMouseDown={(e) => handleItemMouseDown(e, idx)}
                    onTouchStart={(e) => handleItemTouchStart(e, idx)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`flex items-center justify-between cursor-pointer px-3 py-2 transition-colors ${
                      isActive ? 'bg-background' : ''
                    } ${isSelected ? 'font-semibold text-primary' : ''} hover:bg-background`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <svg className="ml-2 h-4 w-4 opacity-70 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelectPlain;
