import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Edit2, Trash2 } from 'lucide-react';
import { Customer } from '../../types';

interface Props {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function CustomerList({ customers, onEdit, onDelete, onAdd }: Props) {
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cliente..."
            className="w-full pl-12 pr-4 py-4 bg-surface/50 border border-border rounded-xl text-base outline-none focus:border-primary"
          />
        </div>
        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-2 px-5 py-4 bg-primary hover:bg-primary-dark rounded-xl text-base font-bold text-white transition"
        >
          <UserPlus size={20} />
          Nuevo
        </button>
      </div>

      <div className="overflow-x-auto max-h-96">
        <table className="w-full min-w-[500px] text-sm md:text-base">
          <thead className="bg-surface/30">
            <tr className="text-text-muted">
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">Teléfono</th>
              <th className="text-left p-3 hidden sm:table-cell">Email</th>
              <th className="text-center p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b border-border/20 hover:bg-surface/20">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3 hidden sm:table-cell text-text-muted">{c.email || '-'}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => onEdit(c)} className="p-3 text-primary hover:bg-primary/10 rounded-xl" title="Editar">
                      <Edit2 size={20} />
                    </button>
                    <button onClick={() => onDelete(c.id)} className="p-3 text-danger hover:bg-danger/10 rounded-xl" title="Eliminar">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="text-center text-text-muted py-4 text-base">No se encontraron clientes</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}