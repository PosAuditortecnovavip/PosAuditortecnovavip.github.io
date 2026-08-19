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
      className="glass-card p-5 space-y-5"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <ArrowDownCircle size={22} className="text-danger" />
          Nuevo Egreso
        </h3>
        <button type="button" onClick={onCancel} className="text-text-muted hover:text-text-primary p-2"><X size={20} /></button>
      </div>

      <p className="text-sm text-text-muted">Los ingresos provienen automáticamente de las ventas.</p>

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
        className="w-full bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
        required
      />
      <input
        type="number"
        step="0.01"
        min="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Monto en USD"
        className="w-full bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
      >
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>

      <button
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-primary to-accent rounded-xl font-bold text-white text-base sm:text-lg transition hover:from-primary-dark hover:to-accent-light"
      >
        Registrar Egreso
      </button>
    </motion.form>
  );
}