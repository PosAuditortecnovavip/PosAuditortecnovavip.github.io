import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartItem } from '../../hooks/useSales';
import { useExchangeRate } from '../../context/ExchangeRateContext';

interface Props {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  totalUSD: number;
  totalBS: number;
  onCheckout: () => void;
  error: string | null;
  onClearError: () => void;
}

export default function Cart({ cart, onUpdateQuantity, onRemove, onClear, totalUSD, totalBS, onCheckout, error, onClearError }: Props) {
  const { formatUSD, formatBS } = useExchangeRate();

  if (cart.length === 0) {
    return (
      <div className="glass-card p-6 text-center space-y-3 sticky top-20">
        <ShoppingCart size={40} className="mx-auto text-text-muted opacity-50" />
        <p className="text-text-muted text-sm">El carrito está vacío</p>
        <p className="text-text-muted text-xs">Seleccione productos para comenzar</p>
        {error && (
          <div className="bg-danger/10 border border-danger/30 rounded-lg p-2 text-xs text-danger mt-3">
            {error}
            <button onClick={onClearError} className="ml-2 underline">Cerrar</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card p-4 space-y-3 sticky top-20">
      <div className="flex items-center justify-between">
        <h2 className="font-bold flex items-center gap-2">
          <ShoppingBag size={18} className="text-primary" />
          Carrito
        </h2>
        <button onClick={onClear} className="text-xs text-danger hover:underline">Vaciar</button>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-lg p-2 text-xs text-danger flex justify-between items-center">
          <span>{error}</span>
          <button onClick={onClearError} className="ml-2 underline">Ok</button>
        </div>
      )}

      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
        {cart.map(item => (
          <div key={item.productId} className="bg-surface/40 rounded-lg p-2 space-y-1">
            <div className="flex justify-between items-start gap-1">
              <p className="text-xs font-medium leading-tight flex-1">{item.productName}</p>
              <button onClick={() => onRemove(item.productId)} className="text-text-muted hover:text-danger shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                  className="w-6 h-6 rounded-md bg-surface flex items-center justify-center hover:bg-surface-light text-xs"
                >
                  <Minus size={12} />
                </button>
                <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="w-6 h-6 rounded-md bg-surface flex items-center justify-center hover:bg-surface-light text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus size={12} />
                </button>
              </div>
              <span className="text-sm font-bold text-primary">${item.subtotalUSD.toFixed(2)}</span>
            </div>
            <div className="text-[10px] text-text-muted">Stock: {item.stock}</div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-3 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-secondary">Total USD</span>
          <span className="font-bold text-lg">{formatUSD(totalUSD)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-secondary">Total Bs</span>
          <span className="font-bold text-lg">{formatBS(totalBS)}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCheckout}
          disabled={cart.length === 0}
          className="w-full py-3 bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-light rounded-xl font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cobrar
        </motion.button>
      </div>
    </div>
  );
}