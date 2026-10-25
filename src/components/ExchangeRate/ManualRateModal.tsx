import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign } from 'lucide-react';
import { useExchangeRate } from '../../context/ExchangeRateContext';

export default function ManualRateModal() {
  const { showManualModal, dismissManualModal, setManualRate, rate } = useExchangeRate();
  const [inputValue, setInputValue] = useState(rate?.rate.toString() || '62.50');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(inputValue);
    if (isNaN(value) || value <= 0) return;
    setManualRate(value);
  };

  return (
    <AnimatePresence>
      {showManualModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="glass-card w-full max-w-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2"><DollarSign size={20} className="text-warning" />Tasa manual requerida</h3>
              <button onClick={dismissManualModal} className="text-text-muted hover:text-text-primary cursor-pointer"><X size={20} /></button>
            </div>
            <p className="text-sm text-text-secondary">Ingrese la tasa BCV del día</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="number" step="0.0001" min="0" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary outline-none focus:border-primary" placeholder="Ej: 62.50" autoFocus />
              <button type="submit" className="w-full py-2 bg-primary hover:bg-primary-dark rounded-lg font-semibold transition cursor-pointer">Establecer tasa</button>
            </form>
            <p className="text-xs text-text-muted text-center">Esta tasa se usará hasta que se restablezca la conexión.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}