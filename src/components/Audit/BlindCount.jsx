import { useState } from 'react';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

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
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
            {showCounts ? <EyeOff className="text-yellow-400" size={20} /> : <Eye className="text-red-400" size={20} />}
          </div>
          <h2 className="text-xl font-semibold text-white">Conteo Ciego de Inventario</h2>
        </div>
        <button
          onClick={() => setShowCounts(!showCounts)}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all text-sm"
        >
          {showCounts ? 'Ocultar sistema' : 'Mostrar sistema'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-3 text-gray-500 font-medium">Producto</th>
              <th className="text-left p-3 text-gray-500 font-medium">SKU</th>
              <th className="text-left p-3 text-gray-500 font-medium">Costo USD</th>
              {showCounts && <th className="text-left p-3 text-gray-500 font-medium">Sistema</th>}
              <th className="text-left p-3 text-cyan-400 font-medium">Conteo Físico</th>
              {showCounts && <th className="text-left p-3 text-gray-500 font-medium">Diferencia</th>}
            </tr>
          </thead>
          <tbody>
            {inventory.map(product => (
              <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-3 text-white">{product.name}</td>
                <td className="p-3 text-gray-400 font-mono text-xs">{product.sku}</td>
                <td className="p-3 text-green-400">${product.costUSD}</td>
                {showCounts && (
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock <= product.minStock ? 'bg-red-900/30 text-red-400' : 'bg-green-900/20 text-green-400'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                )}
                <td className="p-3">
                  <input
                    type="number"
                    min="0"
                    className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none font-mono"
                    value={counts[product.id] || ''}
                    onChange={(e) => handleCountChange(product.id, e.target.value)}
                    placeholder="0"
                  />
                </td>
                {showCounts && (
                  <td className="p-3">
                    <span className={`font-bold ${
                      (product.stock - (counts[product.id] || 0)) === 0 
                        ? 'text-green-400'
                        : 'text-red-400'
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
        className="mt-6 w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-bold text-lg transition-all shadow-lg hover:shadow-glow flex items-center justify-center space-x-2"
      >
        <CheckCircle size={20} />
        <span>Finalizar Conteo y Generar Reporte</span>
      </button>
    </div>
  );
};