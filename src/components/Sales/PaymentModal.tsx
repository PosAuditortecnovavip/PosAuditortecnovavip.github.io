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
  isLoading?: boolean;
}

const methods: { key: Sale['paymentMethod']; label: string; icon: typeof DollarSign }[] = [
  { key: 'cash_usd', label: 'Efectivo USD', icon: Banknote },
  { key: 'cash_bs', label: 'Efectivo Bs', icon: Banknote },
  { key: 'transfer_bs', label: 'Transferencia Bs', icon: Smartphone },
  { key: 'transfer_usd', label: 'Transferencia USD', icon: Smartphone },
  { key: 'mixed', label: 'Mixto', icon: CreditCard },
];

export default function PaymentModal({
  totalUSD,
  totalBS,
  paymentMethod,
  onPaymentMethodChange,
  onConfirm,
  onCancel,
  customers,
  selectedCustomerId,
  onCustomerChange,
  isLoading = false,
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
          className="glass-card w-full max-w-md md:max-w-lg p-5 md:p-6 space-y-5 rounded-b-none sm:rounded-2xl mx-0 sm:mx-3 max-h-[80vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Método de Pago</h3>
            <button onClick={onCancel} className="text-text-muted hover:text-text-primary p-2" aria-label="Cerrar">
              <X size={22} />
            </button>
          </div>

          <div className="text-center py-4 bg-surface/40 rounded-xl space-y-1">
            <p className="text-2xl md:text-3xl font-extrabold">{formatUSD(totalUSD)}</p>
            <p className="text-base md:text-lg text-text-secondary">{formatBS(totalBS)}</p>
          </div>

          <div className="space-y-3">
            {methods.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onPaymentMethodChange(key)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition text-base md:text-lg ${
                  paymentMethod === key
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-surface/30 border-2 border-transparent hover:border-border'
                }`}
              >
                <Icon size={24} className={paymentMethod === key ? 'text-primary' : 'text-text-muted'} />
                <span className="font-medium">{label}</span>
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
              className="flex-1 py-3 border border-border rounded-xl text-base font-medium hover:bg-surface/50 transition"
            >
              Cancelar
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              disabled={totalUSD === 0 || isLoading}
              className="flex-1 py-3 bg-gradient-to-r from-primary to-accent rounded-xl text-base font-bold text-white disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? <RefreshCw size={20} className="animate-spin" /> : null}
              {isLoading ? 'Procesando...' : 'Confirmar Venta'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}