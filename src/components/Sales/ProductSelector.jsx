import { Package, ChevronRight } from 'lucide-react';

export const ProductSelector = ({ inventory, onSelect, selected }) => {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent-blue/20 flex items-center justify-center">
          <Package className="text-accent-blue" size={20} />
        </div>
        <h2 className="text-xl font-semibold text-white">Seleccionar Producto</h2>
      </div>
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {inventory.map(product => (
          <button
            key={product.id}
            onClick={() => onSelect(product)}
            className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
              selected?.id === product.id
                ? 'bg-accent-blue/10 border border-accent-blue/30 shadow-glow'
                : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <span className="text-white font-medium group-hover:text-accent-cyan transition-colors">{product.name}</span>
                <div className="text-sm text-gray-500 mt-1">
                  Stock: <span className={product.stock <= product.minStock ? 'text-red-400' : 'text-green-400'}>{product.stock}</span> · SKU: {product.sku}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-accent-green font-bold text-lg">${product.costUSD}</span>
                <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
