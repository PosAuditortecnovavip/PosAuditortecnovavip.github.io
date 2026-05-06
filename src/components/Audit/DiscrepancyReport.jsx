import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

const glassCard = "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-glass-sm";

export const DiscrepancyReport = ({ discrepancies, convertUSDtoVES }) => {
  const faltantes = discrepancies.filter(d => d.difference > 0);
  const sobrantes = discrepancies.filter(d => d.difference < 0);
  const totalLossUSD = faltantes.reduce((sum, d) => sum + d.lossUSD, 0);
  const totalGainUSD = sobrantes.reduce((sum, d) => sum + Math.abs(d.difference) * d.costUSD, 0);
  const netImpact = totalLossUSD - totalGainUSD;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={glassCard + " p-6"}>
          <div className="text-neutral-400 text-sm mb-2">Total Discrepancias</div>
          <div className="text-3xl font-bold text-white">{faltantes.length + sobrantes.length}</div>
        </div>
        <div className={glassCard + " p-6"}>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="text-brand-red" size={18} />
            <span className="text-neutral-400 text-sm">Faltantes</span>
          </div>
          <div className="text-2xl font-bold text-brand-red">{faltantes.length}</div>
          <div className="text-xs text-brand-red/80 mt-1">Pérdida: {convertUSDtoVES(totalLossUSD)}</div>
        </div>
        <div className={glassCard + " p-6"}>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="text-brand-green" size={18} />
            <span className="text-neutral-400 text-sm">Sobrantes</span>
          </div>
          <div className="text-2xl font-bold text-brand-green">{sobrantes.length}</div>
          <div className="text-xs text-brand-green/80 mt-1">Valor extra: {convertUSDtoVES(totalGainUSD)}</div>
        </div>
        <div className={glassCard + " p-6"}>
          <div className="text-neutral-400 text-sm mb-2">Impacto Neto</div>
          <div className={`text-2xl font-bold ${netImpact > 0 ? 'text-brand-red' : 'text-brand-green'}`}>
            {netImpact > 0 ? '-' : ''}{convertUSDtoVES(Math.abs(netImpact))}
          </div>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className={glassCard + " overflow-hidden"}>
        <div className="p-4 border-b border-white/10 flex items-center space-x-2">
          <AlertTriangle size={18} className="text-brand-yellow" />
          <h3 className="text-lg font-semibold text-white">Detalle de Diferencias</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-3 text-neutral-400">Producto</th>
                <th className="text-left p-3 text-neutral-400">Sistema</th>
                <th className="text-left p-3 text-neutral-400">Físico</th>
                <th className="text-left p-3 text-neutral-400">Diferencia</th>
                <th className="text-left p-3 text-neutral-400">Impacto USD</th>
                <th className="text-left p-3 text-neutral-400">Impacto VES</th>
              </tr>
            </thead>
            <tbody>
              {discrepancies.filter(d => d.difference !== 0).map(item => {
                const impactUSD = item.difference > 0 ? -item.lossUSD : Math.abs(item.difference) * item.costUSD;
                return (
                  <tr key={item.id} className="border-b border-white/5">
                    <td className="p-3 text-white">{item.name}</td>
                    <td className="p-3 text-neutral-400">{item.stock}</td>
                    <td className="p-3 text-white">{item.countedStock}</td>
                    <td className={`p-3 font-bold ${item.difference === 0 ? 'text-brand-green' : item.difference > 0 ? 'text-brand-red' : 'text-brand-green'}`}>
                      {item.difference > 0 ? `-${item.difference}` : item.difference === 0 ? '0' : `+${Math.abs(item.difference)}`}
                    </td>
                    <td className={`p-3 font-medium ${impactUSD >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                      {impactUSD !== 0 ? (impactUSD > 0 ? `+$${impactUSD.toFixed(2)}` : `-$${Math.abs(impactUSD).toFixed(2)}`) : '-'}
                    </td>
                    <td className={`p-3 font-medium ${impactUSD >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                      {impactUSD !== 0 ? convertUSDtoVES(Math.abs(impactUSD)) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
