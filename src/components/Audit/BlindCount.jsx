import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, CheckCircle, ChevronRight } from 'lucide-react';

const glassCard = "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-glass-sm";

export const BlindCount = ({ inventory, onComplete }) => {
  const [showCounts, setShowCounts] = useState(false);
  const [counts, setCounts] = useState({});

  const handleCountChange = (productId, value) => {
    setCounts(prev => ({ ...prev, [productId]: parseInt(value) || 0 }));
  };

  const calculateDiscrepancies = () => {
    const discrepancies = inventory.map(product => {
      const countedStock = counts[product.id] || 0;
      const systemStock = product.stock;
      const difference = systemStock - countedStock;
      return {
        ...product,
        countedStock,
        difference,
        lossUSD: difference > 0 ? difference * product.costUSD : 0,
        status: difference === 0 ? 'ok' : difference > 0 ? 'faltante' : 'sobrante'
      };
    });
    onComplete(discrepancies);
    setShowCounts(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={glassCard + " p-6"}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-red/20 flex items-center justify-center">
            {showCounts ? <EyeOff className="text-brand-yellow" size={20} /> : <Eye className="text-brand-red" size={20} />}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Conteo Ciego</h2>
            <p className="text-xs text-neutral-400">Ingrese las cantidades físicas</p>
          </div>
        </div>
        <button
          onClick={() => setShowCounts(!showCounts)}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-all text-sm"
        >
          {showCounts ? 'Ocultar sistema' : 'Mostrar sistema'}
        </button>
      </div>

      <div className="space-y-2">
        {inventory.map(product => {
          const diff = product.stock - (counts[product.id] || 0);
          return (
            <motion.div
              key={product.id}
              layout
              className={`flex items-center p-4 rounded-xl transition-all ${
                showCounts && diff !== 0
                  ? 'bg-brand-red/5 border border-brand-red/20'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium truncate">{product.name}</span>
                  <span className="text-xs text-neutral-500 font-mono">{product.sku}</span>
                </div>
                <div className="flex items-center mt-1 space-x-3">
                  <span className="text-brand-green text-sm">${product.costUSD}</span>
                  {showCounts && (
                    <span className={`text-sm ${diff === 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                      Sistema: {product.stock}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 ml-4">
                <input
                  type="number"
                  min="0"
                  className="w-20 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-brand-blue"
                  value={counts[product.id] || ''}
                  onChange={(e) => handleCountChange(product.id, e.target.value)}
                  placeholder="0"
                />
                {showCounts && (
                  <span className={`text-sm font-bold ${diff === 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                    {diff > 0 ? `-${diff}` : diff < 0 ? `+${Math.abs(diff)}` : '0'}
                  </span>
                )}
                <ChevronRight size={16} className="text-neutral-600" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={calculateDiscrepancies}
        className="mt-6 w-full py-4 bg-gradient-to-r from-brand-blue to-brand-cyan rounded-xl text-white font-bold text-lg shadow-card-glow flex items-center justify-center space-x-2"
      >
        <CheckCircle size={20} />
        <span>Finalizar y Generar Reporte</span>
      </motion.button>
    </motion.div>
  );
};
