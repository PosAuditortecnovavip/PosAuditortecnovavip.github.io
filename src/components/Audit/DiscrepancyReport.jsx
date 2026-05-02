import { AlertTriangle, DollarSign, TrendingDown, ShieldAlert } from 'lucide-react';

export const DiscrepancyReport = ({ discrepancies, convertUSDtoVES }) => {
  const totalLossUSD = discrepancies
    .filter(d => d.difference > 0)
    .reduce((sum, d) => sum + d.lossUSD, 0);

  const discrepancyCount = discrepancies.filter(d => d.difference !== 0).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-3">
            <ShieldAlert className="text-accent-yellow" size={20} />
            <span className="text-gray-500 text-sm">Discrepancias</span>
          </div>
          <div className="text-3xl font-bold text-accent-yellow">{discrepancyCount}</div>
        </div>
        
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingDown className="text-accent-red" size={20} />
            <span className="text-gray-500 text-sm">Pérdida Total USD</span>
          </div>
          <div className="text-3xl font-bold text-accent-red">${totalLossUSD.toFixed(2)}</div>
        </div>
        
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-3">
            <DollarSign className="text-accent-red" size={20} />
            <span className="text-gray-500 text-sm">Pérdida en Bolívares</span>
          </div>
          <div className="text-3xl font-bold text-accent-red">
            {convertUSDtoVES(totalLossUSD)}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <AlertTriangle size={20} className="text-accent-yellow" />
            <span>Detalle de Discrepancias</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-3 text-gray-500 font-medium">Producto</th>
                <th className="text-left p-3 text-gray-500 font-medium">Sistema</th>
                <th className="text-left p-3 text-gray-500 font-medium">Físico</th>
                <th className="text-left p-3 text-gray-500 font-medium">Diferencia</th>
                <th className="text-left p-3 text-gray-500 font-medium">Pérdida USD</th>
                <th className="text-left p-3 text-gray-500 font-medium">Pérdida VES</th>
              </tr>
            </thead>
            <tbody>
              {discrepancies.map(item => (
                <tr key={item.id} className={`border-b border-white/5 ${
                  item.difference !== 0 ? 'bg-red-900/5' : ''
                }`}>
                  <td className="p-3 text-white">{item.name}</td>
                  <td className="p-3 text-gray-400">{item.stock}</td>
                  <td className="p-3 text-white">{item.countedStock}</td>
                  <td className="p-3">
                    <span className={`font-bold ${
                      item.difference === 0 ? 'text-accent-green' : 'text-accent-red'
                    }`}>
                      {item.difference > 0 ? `-${item.difference}` : item.difference === 0 ? '0' : `+${Math.abs(item.difference)}`}
                    </span>
                  </td>
                  <td className="p-3 text-accent-red">
                    {item.lossUSD > 0 && `-$${item.lossUSD.toFixed(2)}`}
                  </td>
                  <td className="p-3 text-accent-red">
                    {item.lossUSD > 0 && convertUSDtoVES(item.lossUSD)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-red-500/20 bg-red-900/5">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="text-accent-red flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-white font-bold text-lg mb-2">Resumen de Auditoría</h3>
            <p className="text-gray-400">
              Se detectaron <span className="text-accent-yellow font-bold">{discrepancyCount} discrepancias</span> en el inventario.
              La pérdida total asciende a <span className="text-accent-red font-bold">{convertUSDtoVES(totalLossUSD)}</span>.
              Esto puede deberse a faltantes, deterioro o pérdida por devaluación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
