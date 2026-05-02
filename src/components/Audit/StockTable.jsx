import { Package, AlertCircle } from 'lucide-react';

export const StockTable = ({ inventory }) => {
  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent-yellow/20 flex items-center justify-center">
          <Package className="text-accent-yellow" size={20} />
        </div>
        <h2 className="text-xl font-semibold text-white">Stock Actual del Sistema</h2>
        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">Referencia</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-3 text-gray-500 font-medium">Producto</th>
              <th className="text-left p-3 text-gray-500 font-medium">SKU</th>
              <th className="text-left p-3 text-gray-500 font-medium">Costo USD</th>
              <th className="text-left p-3 text-gray-500 font-medium">Stock</th>
              <th className="text-left p-3 text-gray-500 font-medium">Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-3 text-white font-medium">{item.name}</td>
                <td className="p-3 text-gray-400 font-mono text-xs">{item.sku}</td>
                <td className="p-3 text-accent-green font-semibold">${item.costUSD}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item.stock <= item.minStock 
                      ? 'bg-red-900/30 text-red-400' 
                      : 'bg-green-900/20 text-green-400'
                  }`}>
                    {item.stock <= item.minStock && <AlertCircle size={12} className="mr-1" />}
                    {item.stock}
                  </span>
                </td>
                <td className="p-3 text-white font-semibold">
                  ${(item.costUSD * item.stock).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
