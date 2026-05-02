import { Package } from 'lucide-react';

export const ProductSelector = ({ inventory, onSelect, selected }) => {
  return (
    <div className="bg-dark-800 rounded-xl border border-dark-600 p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Package className="mr-2 text-accent-blue" size={20} />
        Seleccionar Producto
      </h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {inventory.map(product => (
          <button
            key={product.id}
            onClick={() => onSelect(product)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selected?.id === product.id
                ? 'bg-accent-blue/10 border border-accent-blue'
                : 'bg-dark-900 border border-dark-600 hover:border-dark-500'
            }`}
          >
            <div className="flex justify-between">
              <span className="text-white">{product.name}</span>
              <span className="text-accent-green">${product.costUSD}</span>
            </div>
            <div className="text-sm text-dark-500 mt-1">
              Stock: {product.stock} · SKU: {product.sku}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};