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

export default function Cart({
  cart,
  onUpdateQuantity,
  onRemove,
  onClear,
  totalUSD,
  totalBS,
  onCheckout,
  error,
  onClearError,
}: Props) {
  const { formatUSD, formatBS } = useExchangeRate();

  if (cart.length === 0) {
    return (
      <div className="glass-card p-6 text-center space-y-3 sticky top-20">
        <ShoppingCart size={40} className="mx-auto text-text-muted opacity-50" />
        <p className="text-text-muted text-sm md:text-base">El carrito está vacío</p>
        <p className="text-text-muted text-xs md:text-sm">Seleccione productos para comenzar</p>
        {error && (
          <div className="bg-danger/10 border border-danger/30 rounded-lg p-3 text-xs md:text-sm text-danger mt-3">
            {error}
            <button onClick={onClearError} className="ml-2 underline">Cerrar</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card p-4 md:p-5 space-y-3 sticky top-20">
      <div className="flex items-center justify-between">
        <h2 className="font-bold flex items-center gap-2 text-base md:text-lg">
          <ShoppingBag size={20} className="text-primary" />
          Carrito
        </h2>
        <button onClick={onClear} className="text-xs md:text-sm text-danger hover:underline">
          Vaciar
        </button>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-lg p-3 text-xs md:text-sm text-danger flex justify-between items-center">
          <span>{error}</span>
          <button onClick={onClearError} className="ml-2 underline">Ok</button>
        </div>
      )}

      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
        {cart.map((item) => (
          <div key={item.productId} className="bg-surface/40 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-start gap-1">
              <p className="text-sm md:text-base font-medium leading-tight flex-1">{item.productName}</p>
              <button
                onClick={() => onRemove(item.productId)}
                className="text-text-muted hover:text-danger shrink-0 p-1"
                aria-label={`Eliminar ${item.productName}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 rounded-md bg-surface flex items-center justify-center hover:bg-surface-light"
                  aria-label="Disminuir cantidad"
                >
                  <Minus size={16} />
                </button>
                <span className="text-base md:text-lg font-bold w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="w-8 h-8 rounded-md bg-surface flex items-center justify-center hover:bg-surface-light disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-base md:text-lg font-bold text-primary">${item.subtotalUSD.toFixed(2)}</span>
            </div>
            <div className="text-[10px] md:text-xs text-text-muted">Stock: {item.stock}</div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-3 space-y-2">
        <div className="flex justify-between items-center text-sm md:text-base">
          <span className="text-text-secondary">Total USD</span>
          <span className="font-bold text-lg md:text-xl">{formatUSD(totalUSD)}</span>
        </div>
        <div className="flex justify-between items-center text-sm md:text-base">
          <span className="text-text-secondary">Total Bs</span>
          <span className="font-bold text-lg md:text-xl">{formatBS(totalBS)}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCheckout}
          disabled={cart.length === 0}
          className="w-full py-3.5 bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-light rounded-xl font-bold text-white text-base md:text-lg shadow-lg shadow-primary/20 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cobrar
        </motion.button>
      </div>
    </div>
  );
}