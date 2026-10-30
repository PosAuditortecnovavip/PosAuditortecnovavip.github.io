import { useState } from 'react';
import { Supplier } from '../../types';
import { Plus } from 'lucide-react';

interface Props {
  suppliers: Supplier[];
  selectedSupplierName: string;
  onChange: (name: string) => void;
  onNewSupplier: (name: string, phone: string, email: string) => Promise<void>;
}

export default function SupplierSelector({ suppliers, selectedSupplierName, onChange, onNewSupplier }: Props) {
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!newName) return;
    setSaving(true);
    try {
      await onNewSupplier(newName, newPhone, newEmail);
      onChange(newName);
      setShowNew(false);
      setNewName(''); setNewPhone(''); setNewEmail('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-secondary mb-1">Proveedor</label>
      
      {!showNew ? (
        <div className="flex gap-2">
          <select
            value={selectedSupplierName}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary"
          >
            <option value="">Seleccione un proveedor</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowNew(true)}
            className="px-4 py-3.5 bg-primary/20 text-primary hover:bg-primary/30 rounded-xl font-bold text-sm flex items-center gap-2 transition"
          >
            <Plus size={16} /> Nuevo
          </button>
        </div>
      ) : (
        <div className="space-y-3 bg-surface/30 rounded-xl p-4">
          <h4 className="text-sm font-bold">Registrar nuevo proveedor</h4>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Nombre</label>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej. Distribuidora XYZ" className="w-full bg-surface border border-border rounded-lg p-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Teléfono (opcional)</label>
            <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Ej. 0412-1234567" className="w-full bg-surface border border-border rounded-lg p-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Email (opcional)</label>
            <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Opcional" className="w-full bg-surface border border-border rounded-lg p-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleCreate} disabled={saving || !newName} className="flex-1 py-2 bg-primary rounded-lg text-white font-bold text-sm disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar proveedor'}</button>
            <button type="button" onClick={() => setShowNew(false)} className="flex-1 py-2 border border-border rounded-lg text-sm">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
