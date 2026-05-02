import { Package } from 'lucide-react';

export const StockTable = ({ inventory }) => {
  return (
    <div className="bg-dark-800 rounded-xl border border-dark-600 p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Package className="mr-2 text-accent-cyan" size={20} />
        Stock Actual del Sistema (Referencia)
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-dark-900">
            <tr>
              <th className="text-left p-3 text-dark-500">Producto</th>
              <th className="text-left p-3 text-dark-500">SKU</th>
              <th className="text-left p-3 text-dark-500">Costo USD</th>
              <th className="text-left p-3 text-dark-500">Stock</th>
              <th className="text-left p-3 text-dark-500">Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} className="border-t border-dark-700">
                <td className="p-3 text-white">{item.name}</td>
                <td className="p-3 text-dark-500">{item.sku}</td>
                <td className="p-3 text-accent-green">${item.costUSD}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.stock <= item.minStock 
                      ? 'bg-red-900/30 text-red-400' 
                      : 'bg-green-900/20 text-green-400'
                  }`}>
                    {item.stock}
                  </span>
                </td>
                <td className="p-3 text-white">
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