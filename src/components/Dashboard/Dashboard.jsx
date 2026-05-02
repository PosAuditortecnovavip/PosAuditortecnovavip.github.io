import { ExchangeRateCard } from './ExchangeRateCard';
import { InventorySummaryCard } from './InventorySummaryCard';
import { Activity } from 'lucide-react';

export const Dashboard = ({ exchangeRate, loading, convertUSDtoVES, totalInventoryUSD }) => {
  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center space-x-3 mb-2">
        <Activity className="text-accent-blue" size={28} />
        <h1 className="text-3xl font-bold gradient-text">Panel de Control</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExchangeRateCard exchangeRate={exchangeRate} loading={loading} />
        <InventorySummaryCard 
          totalUSD={totalInventoryUSD} 
          convertUSDtoVES={convertUSDtoVES} 
        />
      </div>
    </div>
  );
};
