import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { closeCashRegister } from '../../services/cashClosingService';

export default function CashClosingModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleClose = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await closeCashRegister(user.uid, user.name);
      alert('Cierre de caja registrado.');
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error al cerrar caja.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="glass-card w-full max-w-sm p-6 space-y-5" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl">Cierre de Caja</h3>
          <button onClick={onClose} className="p-2"><X size={22} /></button>
        </div>
        <p className="text-base text-text-secondary">Se registrarán las ventas y gastos del día y se calculará el balance.</p>
        <button onClick={handleClose} disabled={loading} className="w-full py-4 bg-primary rounded-xl text-white font-bold text-base disabled:opacity-50">
          {loading ? 'Procesando...' : 'Realizar cierre'}
        </button>
      </div>
    </motion.div>
  );
}