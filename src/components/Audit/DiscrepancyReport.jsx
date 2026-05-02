import { AlertTriangle, DollarSign, TrendingDown } from 'lucide-react';

export const DiscrepancyReport = ({ discrepancies, convertUSDtoVES }) => {
  const totalLossUSD = discrepancies
    .filter(d => d.difference > 0)
    .reduce((sum, d) => sum + d.lossUSD, 0);

  const discrepancyCount = discrepancies.filter(d => d.difference !== 0).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-600">
          <div className="text-dark-500 text-sm mb-2">Discrepancias Detectadas</div>
          <div className="text-3xl font-bold text-accent-yellow">{discrepancyCount}</div>
        </div>
        
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-600">
          <div className="text-dark-500 text-sm mb-2">Pérdida Total USD</div>
          <div className="text-3xl font-bold text-accent-red">${totalLossUSD.toFixed(2)}</div>
        </div>
        
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-600">
          <div className="text-dark-500 text-sm mb-2">Pérdida en Bolívares</div>
          <div className="text-3xl font-bold text-accent-red">
            {convertUSDtoVES(totalLossUSD)}
          </div>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl border border-dark-600 overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark-900">
            <tr>
              <th className="text-left p-4 text-dark-500">Producto</th>
              <th className="text-left p-4 text-dark-500">Sistema</th>
              <th className="text-left p-4 text-dark-500">Físico</th>
              <th className="text-left p-4 text-dark-500">Diferencia</th>
              <th className="text-left p-4 text-dark-500">Pérdida USD</th>
              <th className="text-left p-4 text-dark-500">Pérdida VES</th>
            </tr>
          </thead>
          <tbody>
            {discrepancies.map(item => (
              <tr key={item.id} className={`border-t border-dark-700 ${
                item.difference !== 0 ? 'bg-red-900/10' : ''
              }`}>
                <td className="p-4 text-white">{item.name}</td>
                <td className="p-4 text-dark-500">{item.stock}</td>
                <td className="p-4 text-white">{item.countedStock}</td>
                <td className="p-4">
                  <span className={`font-bold ${
                    item.difference === 0 ? 'text-accent-green' : 'text-accent-red'
                  }`}>
                    {item.difference > 0 ? `-${item.difference}` : item.difference === 0 ? '0' : `+${Math.abs(item.difference)}`}
                  </span>
                </td>
                <td className="p-4 text-accent-red">
                  {item.lossUSD > 0 && `-$${item.lossUSD.toFixed(2)}`}
                </td>
                <td className="p-4 text-accent-red">
                  {item.lossUSD > 0 && convertUSDtoVES(item.lossUSD)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gradient-to-r from-red-900/20 to-dark-800 rounded-xl p-6 border border-red-900/50">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="text-accent-red flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-white font-bold text-lg mb-2">Resumen de Auditoría</h3>
            <p className="text-dark-500">
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