import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Customer } from '../../types';

interface Props {
  customer?: Customer | null;
  onSave: (data: { name: string; phone: string; email: string }) => void;
  onCancel: () => void;
}

export default function CustomerForm({ customer, onSave, onCancel }: Props) {
  const [name, setName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [email, setEmail] = useState(customer?.email || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    onSave({ name, phone, email });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="glass-card p-5 space-y-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{customer ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
        <button type="button" onClick={onCancel} className="text-text-muted hover:text-text-primary p-2"><X size={20} /></button>
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre completo *"
        required
        className="w-full bg-surface/50 border border-border rounded-xl p-4 text-base outline-none focus:border-primary"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Teléfono *"
        required
        className="w-full bg-surface/50 border border-border rounded-xl p-4 text-base outline-none focus:border-primary"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico (opcional)"
        className="w-full bg-surface/50 border border-border rounded-xl p-4 text-base outline-none focus:border-primary"
      />
      <button
        type="submit"
        className="w-full py-4 bg-primary hover:bg-primary-dark rounded-xl text-base font-bold text-white transition"
      >
        {customer ? 'Guardar cambios' : 'Registrar cliente'}
      </button>
    </motion.form>
  );
}