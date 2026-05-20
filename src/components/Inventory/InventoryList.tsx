import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Product } from '../../types';
import { useExchangeRate } from '../../context/ExchangeRateContext';

interface Props {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product | null) => void;
  refresh: () => void;
}

export default function InventoryList({ products, selectedProduct, onSelectProduct, refresh }: Props) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'stock' | 'priceUSD'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const { formatUSD } = useExchangeRate();

  const filtered = products
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  return (
    <div className="glass-card p-4 space-y-4">
      {/* Buscador */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full pl-10 pr-4 py-2 bg-surface/50 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-xs md:text-sm">
          <thead className="bg-surface/30 sticky top-0 z-10">
            <tr className="text-text-muted">
              <th className="text-left p-2 font-medium">Producto</th>
              <th
                className="p-2 font-medium cursor-pointer hover:text-text-primary"
                onClick={() => handleSort('stock')}
              >
                <div className="flex items-center gap-1">
                  Stock
                  {sortField === 'stock' && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th
                className="p-2 font-medium cursor-pointer hover:text-text-primary"
                onClick={() => handleSort('priceUSD')}
              >
                <div className="flex items-center gap-1">
                  Precio
                  {sortField === 'priceUSD' && (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th className="p-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr
                key={product.id}
                onClick={() => onSelectProduct(selectedProduct?.id === product.id ? null : product)}
                className={`border-b border-border/30 cursor-pointer transition hover:bg-surface/40 ${
                  selectedProduct?.id === product.id ? 'bg-primary/10' : ''
                }`}
              >
                <td className="p-2">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-text-muted text-[10px]">{product.code} · {product.category}</p>
                  </div>
                </td>
                <td className="p-2 text-center">
                  <span className={product.stock <= product.minStock ? 'text-warning font-bold' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-2 text-right">{formatUSD(product.priceUSD)}</td>
                <td className="p-2 text-center">
                  {product.stock === 0 ? (
                    <AlertTriangle size={16} className="text-danger inline" />
                  ) : product.stock <= product.minStock ? (
                    <AlertTriangle size={16} className="text-warning inline" />
                  ) : (
                    <span className="text-success">●</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-text-muted py-8">No se encontraron productos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}