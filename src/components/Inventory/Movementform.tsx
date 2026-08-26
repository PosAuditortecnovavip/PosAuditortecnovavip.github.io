import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowUpCircle, ArrowDownCircle, Edit3 } from 'lucide-react';
import { Product } from '../../types';
import { useExchangeRate } from '../../context/ExchangeRateContext';

interface Props {
  product: Product;
  onSubmit: (type: 'entry' | 'exit' | 'adjustment', quantity: number, reason: string) => void;
  onCancel: () => void;
}

const types: { type: 'entry' | 'exit' | 'adjustment'; label: string; icon: typeof ArrowUpCircle; color: string }[] = [
  { type: 'entry', label: 'Entrada', icon: ArrowUpCircle, color: 'text-success' },
  { type: 'exit', label: 'Salida', icon: ArrowDownCircle, color: 'text-danger' },
  { type: 'adjustment', label: 'Ajuste', icon: Edit3, color: 'text-warning' },
];

export default function MovementForm({ product, onSubmit, onCancel }: Props) {
  const [type, setType] = useState<'entry' | 'exit' | 'adjustment'>('entry');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const { formatUSD } = useExchangeRate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;
    onSubmit(type, quantity, reason);
  };

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-base sm:text-lg">Movimiento: {product.name}</h3>
        <button onClick={onCancel} className="text-text-muted hover:text-text-primary p-2"><X size={20} /></button>
      </div>
      <div className="text-sm text-text-muted">Stock actual: {product.stock} | {formatUSD(product.priceUSD)}</div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {types.map(t => {
            const TypeIcon = t.icon;
            return (
              <button
                key={t.type}
                type="button"
                onClick={() => setType(t.type)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl text-sm transition ${
                  type === t.type
                    ? 'bg-surface-light border-2 border-primary'
                    : 'bg-surface/50 border-2 border-transparent hover:border-border'
                }`}
              >
                <TypeIcon size={24} className={t.color} />
                {t.label}
              </button>
            );
          })}
        </div>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
          placeholder="Cantidad"
        />

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Motivo (obligatorio)"
          rows={3}
          required
          className="w-full bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary resize-none"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 py-4 bg-primary hover:bg-primary-dark rounded-xl text-base font-bold text-white transition"
          >
            Registrar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-4 border border-border rounded-xl text-base hover:bg-surface/50 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </motion.div>
  );
}