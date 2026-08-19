import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertTriangle, ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react';
import { Product } from '../../types';
import { useExchangeRate } from '../../context/ExchangeRateContext';

interface Props {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product | null) => void;
  refresh: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

export default function InventoryList({
  products,
  selectedProduct,
  onSelectProduct,
  refresh,
  onEditProduct,
  onDeleteProduct,
}: Props) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'stock' | 'priceUSD'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const { formatUSD } = useExchangeRate();

  const filtered = products
    .filter(
      (p) =>
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
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full pl-12 pr-4 py-4 bg-surface/50 border border-border rounded-xl text-base text-text-primary placeholder:text-text-muted outline-none focus:border-primary"
        />
      </div>

      <div className="overflow-x-auto max-h-[500px] overflow-y-auto rounded-xl">
        <table className="w-full min-w-[600px] text-sm md:text-base">
          <thead className="bg-surface/30 sticky top-0 z-10">
            <tr className="text-text-muted">
              <th className="text-left p-3 font-medium">Producto</th>
              <th
                className="p-3 font-medium cursor-pointer hover:text-text-primary"
                onClick={() => handleSort('stock')}
              >
                <div className="flex items-center gap-1">
                  Stock
                  {sortField === 'stock' && (sortAsc ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                </div>
              </th>
              <th
                className="p-3 font-medium cursor-pointer hover:text-text-primary"
                onClick={() => handleSort('priceUSD')}
              >
                <div className="flex items-center gap-1">
                  Precio
                  {sortField === 'priceUSD' && (sortAsc ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                </div>
              </th>
              <th className="p-3 font-medium">Estado</th>
              <th className="p-3 font-medium text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr
                key={product.id}
                onClick={() => onSelectProduct(selectedProduct?.id === product.id ? null : product)}
                className={`border-b border-border/30 cursor-pointer transition hover:bg-surface/40 ${
                  selectedProduct?.id === product.id ? 'bg-primary/10' : ''
                }`}
              >
                <td className="p-3">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-text-muted text-xs md:text-sm">
                      {product.code} · {product.category}
                    </p>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className={product.stock <= product.minStock ? 'text-warning font-bold' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-3 text-right">{formatUSD(product.priceUSD)}</td>
                <td className="p-3 text-center">
                  {product.stock === 0 ? (
                    <AlertTriangle size={20} className="text-danger inline" />
                  ) : product.stock <= product.minStock ? (
                    <AlertTriangle size={20} className="text-warning inline" />
                  ) : (
                    <span className="text-success">●</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProduct(product);
                      }}
                      className="p-3 text-primary hover:bg-primary/10 rounded-xl"
                      title="Editar producto"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProduct(product);
                      }}
                      className="p-3 text-danger hover:bg-danger/10 rounded-xl"
                      title="Eliminar producto"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-text-muted py-8 text-base">
                  No se encontraron productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}