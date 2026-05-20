import { Customer } from '../../types';

interface Props {
  customers: Customer[];
  selectedCustomerId: string;
  onChange: (id: string, name: string) => void;
}

export default function CustomerSelector({ customers, selectedCustomerId, onChange }: Props) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-text-secondary">Cliente (opcional)</label>
      <select
        value={selectedCustomerId}
        onChange={(e) => {
          const selected = customers.find(c => c.id === e.target.value);
          onChange(e.target.value, selected?.name || '');
        }}
        className="w-full bg-surface/50 border border-border rounded-lg p-2 text-sm text-text-primary outline-none focus:border-primary"
      >
        <option value="">Cliente general</option>
        {customers.map(c => (
          <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
        ))}
      </select>
    </div>
  );
}