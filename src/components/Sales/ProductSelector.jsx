import { motion } from 'framer-motion';
import { Package, ChevronRight } from 'lucide-react';

const glassCard = "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-glass-sm";

export const ProductSelector = ({ inventory, onSelect, selected }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={glassCard + " p-6"}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center">
          <Package className="text-brand-blue" size={20} />
        </div>
        <h2 className="text-xl font-semibold text-white">Seleccionar Producto</h2>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {inventory.map(product => (
          <motion.button
            key={product.id}
            onClick={() => onSelect(product)}
            whileHover={{ scale: 1.01 }}
            className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
              selected?.id === product.id
                ? 'bg-brand-blue/10 border border-brand-blue/30 shadow-card-glow'
                : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <span className="text-white font-medium group-hover:text-brand-cyan transition-colors">{product.name}</span>
                <div className="text-sm text-neutral-400 mt-1">
                  Stock: <span className={product.stock <= product.minStock ? 'text-brand-red' : 'text-brand-green'}>{product.stock}</span> · SKU: {product.sku}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-brand-green font-bold text-lg">${product.costUSD}</span>
                <ChevronRight size={16} className="text-neutral-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
