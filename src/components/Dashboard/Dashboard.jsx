import { ExchangeRateCard } from './ExchangeRateCard';
import { InventorySummaryCard } from './InventorySummaryCard';

export const Dashboard = ({ exchangeRate, loading, convertUSDtoVES, totalInventoryUSD }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Panel de Control</h1>
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