import { motion } from 'framer-motion';
import { Package, AlertCircle } from 'lucide-react';

const glassCard = "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-glass-sm";

export const StockTable = ({ inventory }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={glassCard + " p-6"}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-yellow/20 flex items-center justify-center">
          <Package className="text-brand-yellow" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Stock Actual del Sistema</h2>
          <p className="text-xs text-neutral-400">Referencia antes del conteo</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-3 text-neutral-400 font-medium">Producto</th>
              <th className="text-left p-3 text-neutral-400 font-medium">SKU</th>
              <th className="text-left p-3 text-neutral-400 font-medium">Costo USD</th>
              <th className="text-left p-3 text-neutral-400 font-medium">Stock</th>
              <th className="text-left p-3 text-neutral-400 font-medium">Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-3 text-white font-medium">{item.name}</td>
                <td className="p-3 text-neutral-400 font-mono text-xs">{item.sku}</td>
                <td className="p-3 text-brand-green font-semibold">${item.costUSD}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item.stock <= item.minStock 
                      ? 'bg-brand-red/20 text-brand-red' 
                      : 'bg-brand-green/20 text-brand-green'
                  }`}>
                    {item.stock <= item.minStock && <AlertCircle size={12} className="mr-1" />}
                    {item.stock}
                  </span>
                </td>
                <td className="p-3 text-white font-semibold">
                  ${(item.costUSD * item.stock).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
