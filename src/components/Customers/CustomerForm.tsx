import { useState } from 'react';
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
    <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass-card p-5 md:p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">{customer ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
        <button type="button" onClick={onCancel} className="text-text-muted hover:text-text-primary p-2" aria-label="Cerrar formulario"><X size={22} /></button>
      </div>
      <div>
        <label htmlFor="customer-name" className="block text-sm font-medium text-text-secondary mb-1">Nombre completo <span className="text-danger">*</span></label>
        <input id="customer-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. María Pérez" required className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary transition" />
      </div>
      <div>
        <label htmlFor="customer-phone" className="block text-sm font-medium text-text-secondary mb-1">Teléfono <span className="text-danger">*</span></label>
        <input id="customer-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ej. 0412-1234567" required className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary transition" />
      </div>
      <div>
        <label htmlFor="customer-email" className="block text-sm font-medium text-text-secondary mb-1">Correo electrónico</label>
        <input id="customer-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Opcional" className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary transition" />
      </div>
      <button type="submit" className="w-full py-3.5 bg-primary hover:bg-primary-dark rounded-xl text-base font-bold text-white transition focus:outline-none focus:ring-2 focus:ring-primary">{customer ? 'Guardar cambios' : 'Registrar cliente'}</button>
    </motion.form>
  );
}