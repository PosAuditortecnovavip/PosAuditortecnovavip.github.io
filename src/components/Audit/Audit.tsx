import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck } from 'lucide-react';
import { useAudit } from '../../hooks/useAudit';
import AuditForm from './AuditForm';
import AuditHistory from './AuditHistory';
import { Product } from '../../types';

export default function Audit() {
  const { products, history, performAudit, refreshHistory } = useAudit();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAuditSubmit = (physicalStock: number, reason: string, applyAdjustment: boolean) => {
    if (!selectedProduct) return;
    performAudit(selectedProduct.id, physicalStock, reason, applyAdjustment);
    setSelectedProduct(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Auditoría de Inventario</h1>
        <p className="text-text-secondary mt-1 text-sm md:text-base">Conteo físico y registro de diferencias</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Panel izquierdo: selección y formulario */}
        <div className="lg:col-span-2 space-y-4">
          {/* Selector de producto */}
          <div className="glass-card p-4">
            <label className="text-sm font-medium text-text-secondary mb-2 block">
              Seleccione producto a auditar
            </label>
            <select
              value={selectedProduct?.id || ''}
              onChange={(e) => {
                const prod = products.find(p => p.id === e.target.value);
                setSelectedProduct(prod || null);
              }}
              className="w-full bg-surface/50 border border-border rounded-xl p-3 text-text-primary outline-none focus:border-primary text-sm"
            >
              <option value="">-- Seleccione --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock sistema: {p.stock})
                </option>
              ))}
            </select>
          </div>

          {/* Formulario de auditoría */}
          {selectedProduct && (
            <AuditForm
              product={selectedProduct}
              onSubmit={handleAuditSubmit}
              onCancel={() => setSelectedProduct(null)}
            />
          )}
          {!selectedProduct && (
            <div className="glass-card p-6 text-center text-text-muted">
              <ClipboardCheck size={32} className="mx-auto mb-2 opacity-50" />
              Seleccione un producto para registrar su conteo físico
            </div>
          )}
        </div>

        {/* Panel derecho: historial */}
        <AuditHistory history={history} />
      </div>
    </motion.div>
  );
}