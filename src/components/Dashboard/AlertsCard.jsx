import { AlertCircle, ShieldAlert } from 'lucide-react';

export const AlertsCard = () => {
  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
            <ShieldAlert className="text-red-400" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-white">Alertas de Auditoría</h3>
        </div>
        <span className="text-accent-red font-bold text-lg">+263</span>
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
