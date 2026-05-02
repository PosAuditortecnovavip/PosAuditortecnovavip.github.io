import { DollarSign, TrendingUp, Clock } from 'lucide-react';

export const ExchangeRateCard = ({ exchangeRate, loading }) => {
  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
            <DollarSign className="text-cyan-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Tasa BCV</h3>
            <p className="text-xs text-gray-500">Banco Central de Venezuela</p>
          </div>
        </div>
        <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">En vivo</span>
      </div>
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-10 bg-white/5 rounded-lg w-2/3"></div>
          <div className="h-4 bg-white/5 rounded w-1/2"></div>
        </div>
      ) : (
        <>
          <div className="text-4xl font-bold text-white tracking-tight">
            Bs. {exchangeRate?.rate?.toFixed(2)}
          </div>
          <div className="flex items-center mt-3 text-sm text-gray-400">
            <Clock size={14} className="mr-1" />
            <span>Actualizado: {exchangeRate?.date}</span>
          </div>
          <div className="mt-4 flex items-center text-green-400 text-sm">
            <TrendingUp size={14} className="mr-1" />
            <span>Tasa activa para conversiones</span>
          </div>
        </>
      )}
    </div>
  );
};