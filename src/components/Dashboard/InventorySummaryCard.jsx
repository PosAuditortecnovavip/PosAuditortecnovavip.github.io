import { Package, DollarSign } from 'lucide-react';

export const InventorySummaryCard = ({ totalUSD, convertUSDtoVES }) => {
  return (
    <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl p-6 border border-dark-600 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-accent-cyan">Valor Total Inventario</h3>
        <Package className="text-accent-blue" size={24} />
      </div>
      <div className="text-3xl font-bold text-white mb-2">
        ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </div>
      <div className="flex items-center text-dark-500 text-sm">
        <DollarSign size={14} className="mr-1" />
        <span>Equivalente: {convertUSDtoVES(totalUSD)}</span>
      </div>
    </div>
  );
};