import { ExchangeRateCard } from './ExchangeRateCard';
import { InventorySummaryCard } from './InventorySummaryCard';
import { SalesChart } from './SalesChart';
import { AlertsCard } from './AlertsCard';
import { InventoryChart } from './InventoryChart';
import { Activity } from 'lucide-react';

export const Dashboard = ({ exchangeRate, loading, convertUSDtoVES, totalInventoryUSD }) => {
  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center space-x-3 mb-2">
        <Activity className="text-blue-400" size={28} />
        <h1 className="text-3xl font-bold gradient-text">Panel de Control</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <ExchangeRateCard exchangeRate={exchangeRate} loading={loading} />
        <InventorySummaryCard totalUSD={totalInventoryUSD} convertUSDtoVES={convertUSDtoVES} />
        <AlertsCard />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <InventoryChart />
      </div>
    </div>
  );
};