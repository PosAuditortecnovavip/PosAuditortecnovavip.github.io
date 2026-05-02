import { AlertTriangle, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

export const DiscrepancyReport = ({ discrepancies, convertUSDtoVES }) => {
  const faltantes = discrepancies.filter(d => d.difference > 0);
  const sobrantes = discrepancies.filter(d => d.difference < 0);

  const totalLossUSD = faltantes.reduce((sum, d) => sum + d.lossUSD, 0);
  const totalGainUSD = sobrantes.reduce((sum, d) => sum + Math.abs(d.difference) * d.costUSD, 0);

  const discrepancyCount = faltantes.length + sobrantes.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <div className="text-gray-500 text-sm mb-2">Total discrepancias</div>
          <div className="text-3xl font-bold text-white">{discrepancyCount}</div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="text-red-400" size={20} />
            <span className="text-gray-500 text-sm">Faltantes</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{faltantes.length}</div>
          <div className="text-sm text-red-300 mt-1">Pérdida: {convertUSDtoVES(totalLossUSD)}</div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="text-green-400" size={20} />
            <span className="text-gray-500 text-sm">Sobrantes</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{sobrantes.length}</div>
          <div className="text-sm text-green-300 mt-1">Valor extra: {convertUSDtoVES(totalGainUSD)}</div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <div className="text-gray-500 text-sm mb-2">Impacto neto</div>
          <div className={`text-2xl font-bold ${totalLossUSD - totalGainUSD > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {convertUSDtoVES(totalLossUSD - totalGainUSD)}
          </div>
        </div>
      </div>

      {/* Tabla de discrepancias */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <AlertTriangle size={20} className="text-yellow-400" />
            <span>Detalle de diferencias</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-3 text-gray-500">Producto</th>
                <th className="text-left p-3 text-gray-500">Sistema</th>
                <th className="text-left p-3 text-gray-500">Físico</th>
                <th className="text-left p-3 text-gray-500">Diferencia</th>
                <th className="text-left p-3 text-gray-500">Impacto USD</th>
                <th className="text-left p-3 text-gray-500">Impacto VES</th>
              </tr>
            </thead>
            <tbody>
              {discrepancies.filter(d => d.difference !== 0).map(item => {
                const impactUSD = item.difference > 0 ? -item.lossUSD : Math.abs(item.difference) * item.costUSD;
                return (
                  <tr key={item.id} className={`border-b border-white/5 ${item.difference !== 0 ? 'bg-red-900/5' : ''}`}>
                    <td className="p-3 text-white">{item.name}</td>
                    <td className="p-3 text-gray-400">{item.stock}</td>
                    <td className="p-3 text-white">{item.countedStock}</td>
                    <td className={`p-3 font-bold ${item.difference === 0 ? 'text-green-400' : item.difference > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {item.difference > 0 ? `-${item.difference}` : item.difference === 0 ? '0' : `+${Math.abs(item.difference)}`}
                    </td>
                    <td className={`p-3 font-medium ${impactUSD >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {impactUSD !== 0 ? (impactUSD > 0 ? `+$${impactUSD.toFixed(2)}` : `-$${Math.abs(impactUSD).toFixed(2)}`) : '-'}
                    </td>
                    <td className={`p-3 font-medium ${impactUSD >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {impactUSD !== 0 ? convertUSDtoVES(Math.abs(impactUSD)) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
