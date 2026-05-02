import { AlertCircle, ShieldAlert } from 'lucide-react';

export const AlertsCard = () => {
  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <ShieldAlert className="text-red-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Alertas de Auditoría</h3>
          </div>
        </div>
        <span className="text-red-400 font-bold text-lg">+263</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center text-sm">
          <AlertCircle size={14} className="text-red-400 mr-2" />
          <span className="text-gray-400">Faltantes críticos</span>
          <span className="ml-auto text-white font-medium">12</span>
        </div>
        <div className="flex items-center text-sm">
          <AlertCircle size={14} className="text-yellow-400 mr-2" />
          <span className="text-gray-400">Stock bajo mínimo</span>
          <span className="ml-auto text-white font-medium">5</span>
        </div>
        <div className="flex items-center text-sm">
          <AlertCircle size={14} className="text-blue-400 mr-2" />
          <span className="text-gray-400">Auditorías pendientes</span>
          <span className="ml-auto text-white font-medium">3</span>
        </div>
      </div>
    </div>
  );
};