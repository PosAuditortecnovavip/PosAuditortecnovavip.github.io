import { DollarSign, TrendingUp, Clock } from 'lucide-react';

export const ExchangeRateCard = ({ exchangeRate, loading }) => {
  return (
    <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl p-6 border border-dark-600 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-accent-cyan">Tasa BCV Oficial</h3>
        <DollarSign className="text-accent-green" size={24} />
      </div>
      
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-dark-600 rounded w-2/3"></div>
          <div className="h-4 bg-dark-600 rounded w-1/2"></div>
        </div>
      ) : (
        <>
          <div className="text-3xl font-bold text-white mb-2">
            Bs. {exchangeRate?.rate?.toFixed(2)}
          </div>
          <div className="flex items-center text-dark-500 text-sm">
            <Clock size={14} className="mr-1" />
            <span>Actualizado: {exchangeRate?.date}</span>
          </div>
          <div className="mt-4 flex items-center text-accent-green text-sm">
            <TrendingUp size={14} className="mr-1" />
            <span>Tasa activa para conversiones</span>
          </div>
        </>
      )}
    </div>
  );
};