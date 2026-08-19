import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Sale } from '../../types';
import { createCreditNote } from '../../services/creditNoteServices';
import { getProductById, updateProductStock } from '../../services/productService';

interface Props {
  sale: Sale;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreditNoteModal({ sale, onClose, onSuccess }: Props) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason) return;
    setLoading(true);
    try {
      await createCreditNote(sale.id, sale.items, reason, sale.totalUSD, sale.totalBS);
      for (const item of sale.items) {
        const product = await getProductById(item.productId);
        if (product) {
          await updateProductStock(item.productId, product.stock + item.quantity);
        }
      }
      window.dispatchEvent(new Event('inventory-updated'));
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error al emitir nota de crédito.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="glass-card w-full max-w-md p-6 space-y-5" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl">Nota de Crédito</h3>
          <button onClick={onClose} className="p-2"><X size={22} /></button>
        </div>
        <p className="text-base">Venta #{sale.id} - Total: ${sale.totalUSD.toFixed(2)}</p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Motivo de la devolución"
          className="w-full bg-surface/50 border border-border rounded-xl p-4 text-base resize-none"
          rows={4}
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-4 border border-border rounded-xl text-base">Cancelar</button>
          <button onClick={handleSubmit} disabled={loading || !reason} className="flex-1 py-4 bg-danger rounded-xl text-white font-bold text-base disabled:opacity-50">
            {loading ? 'Procesando...' : 'Emitir Nota'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}