import { Transaction } from '../../types';
import { ArrowUpCircle, ArrowDownCircle, Clock, User, Download } from 'lucide-react';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import { generateReceipt } from '../../utils/pdfGenerator';

interface Props {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: Props) {
  const { rate } = useExchangeRate();

  return (
    <div className="glass-card p-4 space-y-3 max-h-[500px] overflow-y-auto">
      <h3 className="font-bold text-sm">Historial de Transacciones</h3>
      {transactions.length === 0 ? (
        <p className="text-text-muted text-xs">No hay transacciones registradas.</p>
      ) : (
        transactions.map(t => (
          <div key={t.id} className="bg-surface/30 rounded-lg p-3 text-xs space-y-1 flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                {t.type === 'income' ? (
                  <ArrowUpCircle size={14} className="text-success shrink-0" />
                ) : (
                  <ArrowDownCircle size={14} className="text-danger shrink-0" />
                )}
                <span className="font-medium truncate">{t.description}</span>
              </div>
              <div className="text-text-muted text-[10px] mt-0.5">{t.category}</div>
              <div className="flex items-center gap-1 text-text-muted text-[10px] mt-0.5">
                <User size={10} /> {t.userName}
                <Clock size={10} className="ml-1" />
                {new Date(t.createdAt).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}
              </div>
            </div>
            <div className="text-right shrink-0 ml-2">
              <p className={`font-bold ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                {t.type === 'income' ? '+' : '-'}${t.amountUSD.toFixed(2)}
              </p>
              <button
                onClick={() => generateReceipt(t, rate?.rate || 0)}
                className="text-primary hover:underline text-xs flex items-center gap-1 mt-1"
              >
                <Download size={10} /> Recibo
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}