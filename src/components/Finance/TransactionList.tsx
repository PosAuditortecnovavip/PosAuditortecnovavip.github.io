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
      <h3 className="font-bold text-base">Historial de Transacciones</h3>
      {transactions.length === 0 ? (
        <p className="text-text-muted text-sm">No hay transacciones registradas.</p>
      ) : (
        transactions.map(t => (
          <div key={t.id} className="bg-surface/30 rounded-lg p-4 text-sm space-y-2 flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {t.type === 'income' ? (
                  <ArrowUpCircle size={20} className="text-success shrink-0" />
                ) : (
                  <ArrowDownCircle size={20} className="text-danger shrink-0" />
                )}
                <span className="font-medium truncate">{t.description}</span>
              </div>
              <div className="text-text-muted text-xs mt-1">{t.category}</div>
              <div className="flex items-center gap-2 text-text-muted text-xs mt-1">
                <User size={14} /> {t.userName}
                <Clock size={14} className="ml-1" />
                {new Date(t.createdAt).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}
              </div>
            </div>
            <div className="text-right shrink-0 ml-2">
              <p className={`font-bold text-base ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                {t.type === 'income' ? '+' : '-'}${t.amountUSD.toFixed(2)}
              </p>
              <button
                onClick={() => generateReceipt(t, rate?.rate || 0)}
                className="text-primary hover:underline text-sm flex items-center gap-1 mt-2 p-2"
              >
                <Download size={18} /> Recibo
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}