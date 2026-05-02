import { useState } from 'react';
import { Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';

export const BlindCount = ({ inventory, onComplete }) => {
  const [showCounts, setShowCounts] = useState(false);
  const [counts, setCounts] = useState({});

  const handleCountChange = (productId, value) => {
    setCounts(prev => ({
      ...prev,
      [productId]: parseInt(value) || 0
    }));
  };

  const calculateDiscrepancies = () => {
    const discrepancies = inventory.map(product => {
      const countedStock = counts[product.id] || 0;
      const systemStock = product.stock;
      const difference = systemStock - countedStock;
      const lossUSD = difference * product.costUSD;
      
      return {
        ...product,
        countedStock,
        difference,
        lossUSD: difference > 0 ? lossUSD : 0,
        status: difference === 0 ? 'ok' : difference > 0 ? 'faltante' : 'sobrante'
      };
    });

    onComplete(discrepancies);
    setShowCounts(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          {showCounts ? (
            <EyeOff className="mr-2 text-accent-yellow" size={24} />
          ) : (
            <Eye className="mr-2 text-accent-red" size={24} />
          )}
          Conteo Ciego de Inventario
        </h2>
        <button
          onClick={() => setShowCounts(!showCounts)}
          className="px-4 py-2 bg-dark-700 rounded-lg text-dark-500 hover:text-white transition-colors"
        >
          {showCounts ? 'Ocultar' : 'Mostrar'} Stock del Sistema
        </button>
      </div>

      <div className="bg-dark-800 rounded-xl border border-dark-600 overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark-900">
            <tr>
              <th className="text-left p-4 text-dark-500">Producto</th>
              <th className="text-left p-4 text-dark-500">SKU</th>
              <th className="text-left p-4 text-dark-500">Costo USD</th>
              {showCounts && <th className="text-left p-4 text-dark-500">Sistema</th>}
              <th className="text-left p-4 text-accent-cyan">Conteo Físico</th>
              {showCounts && <th className="text-left p-4 text-dark-500">Diferencia</th>}
            </tr>
          </thead>
          <tbody>
            {inventory.map(product => (
              <tr key={product.id} className="border-t border-dark-700 hover:bg-dark-700/50">
                <td className="p-4 text-white">{product.name}</td>
                <td className="p-4 text-dark-500">{product.sku}</td>
                <td className="p-4 text-accent-green">${product.costUSD}</td>
                {showCounts && (
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      product.stock <= product.minStock ? 'bg-red-900/30 text-red-400' : ''
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                )}
                <td className="p-4">
                  <input
                    type="number"
                    min="0"
                    className="w-24 bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-accent-blue focus:outline-none"
                    value={counts[product.id] || ''}
                    onChange={(e) => handleCountChange(product.id, e.target.value)}
                    placeholder="0"
                  />
                </td>
                {showCounts && (
                  <td className="p-4">
                    <span className={`font-bold ${
                      (product.stock - (counts[product.id] || 0)) === 0 
                        ? 'text-accent-green'
                        : 'text-accent-red'
                    }`}>
                      {product.stock - (counts[product.id] || 0)}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={calculateDiscrepancies}
        className="w-full py-3 bg-accent-blue hover:bg-blue-600 rounded-lg text-white font-semibold transition-colors flex items-center justify-center"
      >
        <CheckCircle className="mr-2" size={20} />
        Finalizar Conteo y Generar Reporte
      </button>
    </div>
  );
};