import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Receipt, Loader2 } from 'lucide-react';
import { Sale } from '../../types';
import { generateFiscalInvoice } from '../../utils/fiscalInvoice';
import { generateSimpleReceipt } from '../../utils/pdfGenerator';
import { useSettings } from '../../context/SettingsContext';

interface Props {
  sale: Sale;
  onClose: () => void;
}

export default function DocumentChoiceModal({ sale, onClose }: Props) {
  const { ivaRate } = useSettings();
  const [loading, setLoading] = useState(false);

  const handleSimpleReceipt = () => {
    generateSimpleReceipt(sale);
    onClose();
  };

  const handleFiscalInvoice = async () => {
    setLoading(true);
    try {
      await generateFiscalInvoice(sale, ivaRate);
      onClose();
    } catch (error) {
      console.error('Error al generar factura fiscal:', error);
      alert('Error al generar factura fiscal. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-sm p-6 space-y-5"
      >
        <div className="text-center">
          <h3 className="text-lg font-bold">Emitir comprobante</h3>
          <p className="text-sm text-text-secondary mt-2">
            Venta por <strong>${sale.totalUSD.toFixed(2)}</strong> registrada.
          </p>
          <p className="text-xs text-text-muted mt-1">
            Debe seleccionar un tipo de documento:
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSimpleReceipt}
            disabled={loading}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-surface/40 border border-border hover:border-primary transition disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <Receipt size={24} className="text-primary" />
              <div className="text-left">
                <p className="font-bold">Recibo simplificado</p>
                <p className="text-xs text-text-muted">Solo en dólares, sin IVA</p>
              </div>
            </div>
          </button>
          <button
            onClick={handleFiscalInvoice}
            disabled={loading}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-surface/40 border border-border hover:border-primary transition disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              {loading ? (
                <Loader2 size={24} className="text-success animate-spin" />
              ) : (
                <FileText size={24} className="text-success" />
              )}
              <div className="text-left">
                <p className="font-bold">Factura fiscal</p>
                <p className="text-xs text-text-muted">En bolívares, con IVA desglosado</p>
              </div>
            </div>
          </button>
        </div>

        <p className="text-xs text-text-muted text-center">
          Elija una opción para continuar.
        </p>
      </motion.div>
    </motion.div>
  );
}