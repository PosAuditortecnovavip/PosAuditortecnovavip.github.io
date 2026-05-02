import { DollarSign, TrendingUp, Clock, Activity } from 'lucide-react';

export const ExchangeRateCard = ({ exchangeRate, loading }) => {
  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 flex items-center justify-center border border-accent-cyan/20">
            <DollarSign className="text-accent-cyan" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Tasa BCV Oficial</h3>
            <p className="text-xs text-gray-500">Banco Central de Venezuela</p>
          </div>
        </div>
        <Activity className="text-accent-cyan animate-pulse-slow" size={20} />
      </div>
      
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-10 bg-white/5 rounded-lg w-2/3"></div>
          <div className="h-4 bg-white/5 rounded w-1/2"></div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="text-4xl font-bold text-white tracking-tight">
              Bs. {exchangeRate?.rate?.toFixed(2)}
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-400">
              <Clock size={14} className="mr-1" />
              <span>Actualizado: {exchangeRate?.date}</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-accent-green/10 border border-accent-green/20">
            <span className="text-sm text-gray-400">Tasa activa para conversiones</span>
            <TrendingUp size={16} className="text-accent-green" />
          </div>
        </>
      )}
    </div>
  );
};
