import { Purchase } from '../../types';

interface Props { purchases: Purchase[]; }

export default function PurchaseList({ purchases }: Props) {
  return (
    <div className="glass-card p-4 md:p-6 overflow-x-auto">
      <h3 className="font-bold text-lg mb-3">Historial de Compras</h3>
      {purchases.length === 0 ? <p className="text-text-muted text-sm">Sin compras registradas.</p> : (
        <table className="w-full text-xs md:text-sm min-w-[700px]">
          <thead className="bg-surface/30">
            <tr className="text-text-muted">
              <th className="text-left p-2 md:p-3">Fecha</th>
              <th className="text-left p-2 md:p-3">Producto</th>
              <th className="text-left p-2 md:p-3">Proveedor</th>
              <th className="text-right p-2 md:p-3">Cantidad</th>
              <th className="text-right p-2 md:p-3">Costo Unit.</th>
              <th className="text-right p-2 md:p-3">Total USD</th>
              <th className="text-left p-2 md:p-3">Usuario</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id} className="border-b border-border/20">
                <td className="p-2 md:p-3">{new Date(p.createdAt).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td className="p-2 md:p-3">{p.productName}</td>
                <td className="p-2 md:p-3">{p.supplier}</td>
                <td className="p-2 md:p-3 text-right">{p.quantity}</td>
                <td className="p-2 md:p-3 text-right">${p.unitCostUSD.toFixed(2)}</td>
                <td className="p-2 md:p-3 text-right">${p.totalUSD.toFixed(2)}</td>
                <td className="p-2 md:p-3">{p.userName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}