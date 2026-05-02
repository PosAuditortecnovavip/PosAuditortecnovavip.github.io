import { useState } from 'react';
import { Receipt, DollarSign } from 'lucide-react';

export const QuickInvoice = ({ product, exchangeRate, convertUSDtoVES }) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="bg-dark-800 rounded-xl border border-dark-600 p-6 flex items-center justify-center">
        <p className="text-dark-500">Seleccione un producto para facturar</p>
      </div>
    );
  }

  const totalUSD = product.costUSD * quantity;
  const totalVES = convertUSDtoVES(totalUSD);

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-600 p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Receipt className="mr-2 text-accent-cyan" size={20} />
        Factura Rápida
      </h2>
      
      <div className="space-y-4">
        <div className="bg-dark-900 p-4 rounded-lg">
          <div className="text-sm text-dark-500">Producto</div>
          <div className="text-white font-semibold">{product.name}</div>
        </div>

        <div className="bg-dark-900 p-4 rounded-lg">
          <div className="text-sm text-dark-500">Cantidad</div>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 1, product.stock))}
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white mt-1"
          />
        </div>

        <div className="bg-dark-900 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-dark-500">Precio unitario</span>
            <span className="text-white">${product.costUSD}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-dark-500">Subtotal USD</span>
            <span className="text-white">${totalUSD.toFixed(2)}</span>
          </div>
          <div className="border-t border-dark-700 pt-2 mt-2">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-dark-500">Total a pagar</span>
              <span className="text-accent-green">{totalVES}</span>
            </div>
            <div className="text-right text-xs text-dark-500 mt-1">
              Tasa: Bs. {exchangeRate?.rate.toFixed(2)}
            </div>
          </div>
        </div>

        <button className="w-full py-3 bg-accent-green hover:bg-emerald-600 rounded-lg text-white font-semibold transition-colors flex items-center justify-center">
          <DollarSign className="mr-2" size={20} />
          Cobrar Ahora
        </button>
      </div>
    </div>
  );
};