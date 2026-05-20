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

  const selectedType = types.find(t => t.type === type)!;
  const Icon = selectedType.icon;

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-sm">Movimiento: {product.name}</h3>
        <button onClick={onCancel} className="text-text-muted hover:text-text-primary"><X size={16} /></button>
      </div>
      <div className="text-xs text-text-muted">Stock actual: {product.stock} | {formatUSD(product.priceUSD)}</div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-3 gap-1">
          {types.map(t => {
            const TypeIcon = t.icon;
            return (
              <button
                key={t.type}
                type="button"
                onClick={() => setType(t.type)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition ${
                  type === t.type
                    ? 'bg-surface-light border border-' + t.color.split('-')[1]
                    : 'bg-surface/50 border border-transparent hover:border-border'
                }`}
              >
                <TypeIcon size={16} className={t.color} />
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
          className="w-full bg-surface/50 border border-border rounded-lg p-2 text-sm text-text-primary outline-none focus:border-primary"
          placeholder="Cantidad"
        />

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Motivo (obligatorio)"
          rows={2}
          required
          className="w-full bg-surface/50 border border-border rounded-lg p-2 text-sm text-text-primary outline-none focus:border-primary resize-none"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 py-2 bg-primary hover:bg-primary-dark rounded-lg text-sm font-bold text-white transition"
          >
            Registrar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 border border-border rounded-lg text-sm hover:bg-surface/50 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </motion.div>
  );
}