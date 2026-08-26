import { Search, X } from 'lucide-react';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function ProductSearch({ search, onSearchChange }: Props) {
  return (
    <div className="relative">
      <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar producto (nombre, código, categoría)..."
        className="w-full pl-12 pr-12 py-3.5 md:py-3 bg-surface/50 border border-border rounded-xl text-base text-text-primary placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
      />
      {search && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1"
          aria-label="Limpiar búsqueda"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}