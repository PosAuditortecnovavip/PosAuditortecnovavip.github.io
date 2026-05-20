import { Search, X } from 'lucide-react';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function ProductSearch({ search, onSearchChange }: Props) {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar producto (nombre, código, categoría)..."
        className="w-full pl-10 pr-10 py-3 bg-surface/50 border border-border rounded-xl text-text-primary placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-sm"
      />
      {search && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}