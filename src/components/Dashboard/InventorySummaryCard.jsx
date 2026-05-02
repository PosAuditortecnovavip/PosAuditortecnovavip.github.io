import { Package, BarChart3 } from 'lucide-react';

export const InventorySummaryCard = ({ totalUSD, convertUSDtoVES }) => {
  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center">
            <Package className="text-purple-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Valor Inventario</h3>
            <p className="text-xs text-gray-500">Total productos</p>
          </div>
        </div>
        <BarChart3 className="text-purple-400" size={20} />
      </div>
      <div className="text-4xl font-bold text-white tracking-tight">
        ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </div>
      <div className="mt-4 flex items-center text-blue-400 text-sm">
        <span>Equivalente: {convertUSDtoVES(totalUSD)}</span>
      </div>
    </div>
  );
};
