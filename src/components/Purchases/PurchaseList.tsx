import { Purchase } from '../../types';

interface Props { purchases: Purchase[]; }

export default function PurchaseList({ purchases }: Props) {
  return (
    <div className="glass-card p-4 md:p-6 overflow-x-auto mt-6">
      <h3 className="font-bold text-lg mb-4 text-primary border-b border-border/50 pb-2">Historial de Compras</h3>
      {purchases.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-4">Sin compras registradas aún.</p>
      ) : (
        <table className="w-full text-xs md:text-sm min-w-[900px]">
          <thead className="bg-surface/50">
            <tr className="text-text-muted">
              <th className="text-left p-3 font-medium rounded-tl-lg">Fecha</th>
              <th className="text-left p-3 font-medium">Proveedor</th>
              <th className="text-left p-3 font-medium">Productos Comprados</th>
              <th className="text-right p-3 font-medium rounded-tr-lg">Total USD</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id} className="border-b border-border/20 align-top hover:bg-surface/20 transition">
                <td className="p-3 whitespace-nowrap">{new Date(p.createdAt).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td className="p-3 font-medium">{p.supplier}</td>
                <td className="p-3">
                  <ul className="space-y-1">
                    {/* AQUI ESTABA EL ERROR: p.items no existía si no actualizaste el index.ts, o estaba mal escrito */}
                    {p.items && p.items.map((it, idx) => (
                      <li key={idx} className="text-xs md:text-sm flex items-center gap-1">
                        <span className="bg-primary/20 text-primary font-bold px-1.5 rounded">{it.quantity}</span> 
                        <span>{it.productName}</span> 
                        <span className="text-text-muted">(${it.unitCostUSD.toFixed(2)} c/u)</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-3 text-right font-bold text-primary text-base">${p.totalUSD.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
