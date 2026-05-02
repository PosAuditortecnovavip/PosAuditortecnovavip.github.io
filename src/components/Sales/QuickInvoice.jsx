import { useState } from 'react';
import { Receipt, DollarSign, Minus, Plus, ShoppingCart } from 'lucide-react';
import { ReceiptModal } from './Receipt';
import { useInventory } from '../context/InventoryContext';

export const QuickInvoice = ({ product, exchangeRate, convertUSDtoVES }) => {
  const [quantity, setQuantity] = useState(1);
  const [showReceipt, setShowReceipt] = useState(false);
  const { sellProduct } = useInventory();

  if (!product) {
    return (
      <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
        <ShoppingCart size={48} className="text-gray-600 mb-4" />
        <p className="text-gray-500 text-lg">Seleccione un producto</p>
        <p className="text-gray-600 text-sm">para generar la factura</p>
      </div>
    );
  }

  const totalUSD = product.costUSD * quantity;
  const totalVES = convertUSDtoVES(totalUSD);

  const handleCobrar = () => {
    if (quantity > product.stock) return; // protección
    sellProduct(product.id, quantity);
    setShowReceipt(true);
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-6 animate-fade-in">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
            <Receipt className="text-accent-cyan" size={20} />
          </div>
          <h2 className="text-xl font-semibold text-white">Factura Rápida</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 p-4 rounded-xl">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Producto</div>
            <div className="text-white font-semibold">{product.name}</div>
            <div className="text-sm text-gray-500 mt-1">SKU: {product.sku}</div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Cantidad</div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Minus size={16} className="text-white" />
              </button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.min(val, product.stock));
                }}
                className="w-20 text-center bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-lg focus:outline-none focus:border-accent-cyan"
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Plus size={16} className="text-white" />
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">Disponible: {product.stock}</div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Precio unitario</span>
              <span className="text-white">${product.costUSD}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal USD</span>
              <span className="text-white">${totalUSD.toFixed(2)}</span>
            </div>
            <div className="border-t border-white/10 pt-3 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-400">Total a pagar</span>
                <span className="text-accent-green text-2xl">{totalVES}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCobrar}
            disabled={quantity > product.stock}
            className={`w-full py-4 bg-gradient-to-r from-accent-green to-emerald-600 rounded-xl text-white font-bold text-lg transition-all shadow-lg hover:shadow-glow flex items-center justify-center space-x-2 ${
              quantity > product.stock ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <DollarSign size={20} />
            <span>Cobrar Ahora</span>
          </button>
        </div>
      </div>

      {showReceipt && (
        <ReceiptModal
          product={product}
          quantity={quantity}
          totalVES={totalVES}
          exchangeRate={exchangeRate}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </>
  );
};
