import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Banknote, CreditCard, Smartphone, RefreshCw } from 'lucide-react';
import { Sale, Customer } from '../../types';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import CustomerSelector from '../Customers/CustomerSelector';

interface Props {
  totalUSD: number;
  totalBS: number;
  paymentMethod: Sale['paymentMethod'];
  onPaymentMethodChange: (method: Sale['paymentMethod']) => void;
  onConfirm: () => void;
  onCancel: () => void;
  customers: Customer[];
  selectedCustomerId: string;
  onCustomerChange: (id: string, name: string) => void;
  isLoading?: boolean; // <-- AGREGADO
}

const methods: { key: Sale['paymentMethod']; label: string; icon: typeof DollarSign }[] = [
  { key: 'cash_usd', label: 'Efectivo USD', icon: Banknote },
  { key: 'cash_bs', label: 'Efectivo Bs', icon: Banknote },
  { key: 'transfer_bs', label: 'Transferencia Bs', icon: Smartphone },
  { key: 'transfer_usd', label: 'Transferencia USD', icon: Smartphone },
  { key: 'mixed', label: 'Mixto', icon: CreditCard },
];

export default function PaymentModal({
  totalUSD, totalBS, paymentMethod, onPaymentMethodChange,
  onConfirm, onCancel, customers, selectedCustomerId, onCustomerChange,
  isLoading = false, // <-- AGREGADO con valor por defecto
}: Props) {
  const { formatUSD, formatBS } = useExchangeRate();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50"
        onClick={onCancel}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-md p-5 sm:p-6 space-y-4 rounded-b-none sm:rounded-2xl mx-0 sm:mx-3 max-h-[80vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Método de Pago</h3>
            <button onClick={onCancel} className="text-text-muted hover:text-text-primary p-1">
              <X size={20} />
            </button>
          </div>

          <div className="text-center py-3 bg-surface/40 rounded-xl space-y-1">
            <p className="text-2xl font-extrabold">{formatUSD(totalUSD)}</p>
            <p className="text-sm text-text-secondary">{formatBS(totalBS)}</p>
          </div>

          <div className="space-y-2">
            {methods.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onPaymentMethodChange(key)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
                  paymentMethod === key
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-surface/30 border-2 border-transparent hover:border-border'
                }`}
              >
                <Icon size={20} className={paymentMethod === key ? 'text-primary' : 'text-text-muted'} />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          <CustomerSelector
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            onChange={onCustomerChange}
          />

          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-surface/50 transition"
            >
              Cancelar
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              disabled={totalUSD === 0 || isLoading}
              className="flex-1 py-2.5 bg-gradient-to-r from-primary to-accent rounded-xl text-sm font-bold text-white disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading && <RefreshCw size={16} className="animate-spin" />}
              {isLoading ? 'Procesando...' : 'Confirmar Venta'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}