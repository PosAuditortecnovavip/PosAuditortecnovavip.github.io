import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowDownCircle } from 'lucide-react';

interface Props {
  onSubmit: (description: string, amountUSD: number, type: 'expense', category: string) => void;
  onCancel: () => void;
}

const categories = ['Compra mercancía', 'Servicios', 'Alquiler', 'Nómina', 'Impuestos', 'Otros'];

export default function TransactionForm({ onSubmit, onCancel }: Props) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!description || isNaN(amt) || amt <= 0) return;
    onSubmit(description, amt, 'expense', category);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="glass-card p-5 space-y-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          <ArrowDownCircle size={18} className="text-danger" />
          Nuevo Egreso
        </h3>
        <button type="button" onClick={onCancel} className="text-text-muted hover:text-text-primary"><X size={18} /></button>
      </div>

      <p className="text-xs text-text-muted">Los ingresos provienen automáticamente de las ventas.</p>

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
        className="w-full bg-surface/50 border border-border rounded-xl p-3 text-sm text-text-primary outline-none focus:border-primary"
        required
      />
      <input
        type="number"
        step="0.01"
        min="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Monto en USD"
        className="w-full bg-surface/50 border border-border rounded-xl p-3 text-sm text-text-primary outline-none focus:border-primary"
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full bg-surface/50 border border-border rounded-xl p-3 text-sm text-text-primary outline-none focus:border-primary"
      >
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>

      <button
        type="submit"
        className="w-full py-2.5 bg-gradient-to-r from-primary to-accent rounded-xl font-bold text-white text-sm transition hover:from-primary-dark hover:to-accent-light"
      >
        Registrar Egreso
      </button>
    </motion.form>
  );
}