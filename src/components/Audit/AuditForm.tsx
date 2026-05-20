import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, PackageOpen, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { Product } from '../../types';
import { useExchangeRate } from '../../context/ExchangeRateContext';

interface Props {
  product: Product;
  onSubmit: (physicalStock: number, reason: string, applyAdjustment: boolean) => void;
  onCancel: () => void;
}

export default function AuditForm({ product, onSubmit, onCancel }: Props) {
  const [physicalStock, setPhysicalStock] = useState(product.stock.toString());
  const [reason, setReason] = useState('');
  const [applyAdjustment, setApplyAdjustment] = useState(false);
  const { formatUSD } = useExchangeRate();

  const difference = parseInt(physicalStock) - product.stock || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(physicalStock);
    if (isNaN(qty) || qty < 0) return;
    onSubmit(qty, reason, applyAdjustment);
  };

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <PackageOpen size={20} className="text-primary" />
          Conteo Físico
        </h3>
        <button onClick={onCancel} className="text-text-muted hover:text-text-primary"><X size={18} /></button>
      </div>

      <div className="text-sm text-text-secondary bg-surface/30 rounded-lg p-3 space-y-1">
        <p>Producto: <strong className="text-text-primary">{product.name}</strong></p>
        <p>Stock en sistema: <strong className="text-text-primary">{product.stock}</strong></p>
        <p>Precio: {formatUSD(product.priceUSD)}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-text-secondary mb-1 block">
            Cantidad contada físicamente
          </label>
          <input
            type="number"
            min="0"
            value={physicalStock}
            onChange={(e) => setPhysicalStock(e.target.value)}
            className="w-full bg-surface/50 border border-border rounded-xl p-3 text-text-primary outline-none focus:border-primary text-sm"
            placeholder="Ingrese la cantidad real observada"
            autoFocus
          />
        </div>

        {/* Diferencia calculada */}
        <div className={`rounded-xl p-3 flex items-center gap-3 ${
          difference === 0 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
        }`}>
          {difference === 0 ? (
            <ArrowRightLeft size={18} />
          ) : (
            <AlertTriangle size={18} />
          )}
          <span className="text-sm font-medium">
            Diferencia: {difference === 0 ? 'Sin diferencias' : `${difference > 0 ? '+' : ''}${difference} unidades`}
          </span>
        </div>

        {/* Razones (textarea obligatorio si hay diferencia) */}
        <div>
          <label className="text-sm font-medium text-text-secondary mb-1 block">
            Razones de la diferencia {difference !== 0 && <span className="text-danger">*</span>}
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            required={difference !== 0}
            placeholder="Describa las causas de la diferencia encontrada..."
            className="w-full bg-surface/50 border border-border rounded-xl p-3 text-text-primary outline-none focus:border-primary text-sm resize-none"
          />
        </div>

        {/* Ajuste automático */}
        <label className="flex items-center gap-3 p-3 rounded-xl bg-surface/30 cursor-pointer hover:bg-surface/40 transition">
          <input
            type="checkbox"
            checked={applyAdjustment}
            onChange={(e) => setApplyAdjustment(e.target.checked)}
            className="w-4 h-4 rounded accent-primary"
          />
          <span className="text-sm text-text-secondary">
            Aplicar ajuste al inventario ({difference > 0 ? '+' : ''}{difference} unidades)
          </span>
        </label>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 py-2.5 bg-gradient-to-r from-primary to-accent rounded-xl font-bold text-white text-sm transition hover:from-primary-dark hover:to-accent-light"
          >
            Registrar Auditoría
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 border border-border rounded-xl text-sm hover:bg-surface/50 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </motion.div>
  );
}