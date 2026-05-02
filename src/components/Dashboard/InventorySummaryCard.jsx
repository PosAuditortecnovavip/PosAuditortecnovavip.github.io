import { Package, DollarSign, BarChart3 } from 'lucide-react';

export const InventorySummaryCard = ({ totalUSD, convertUSDtoVES }) => {
  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 flex items-center justify-center border border-accent-purple/20">
            <Package className="text-accent-purple" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Valor Total Inventario</h3>
            <p className="text-xs text-gray-500">Todos los productos</p>
          </div>
        </div>
        <BarChart3 className="text-accent-purple" size={20} />
      </div>
      <div className="mb-4">
        <div className="text-4xl font-bold text-white tracking-tight">
          ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
      </div>
      <div className="flex items-center p-3 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
        <DollarSign size={16} className="text-accent-blue mr-2" />
        <span className="text-sm text-gray-300">
          Equivalente: <span className="font-semibold text-white">{convertUSDtoVES(totalUSD)}</span>
        </span>
      </div>
    </div>
  );
};
