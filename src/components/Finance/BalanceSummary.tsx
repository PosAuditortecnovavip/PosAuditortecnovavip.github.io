import { useExchangeRate } from '../../context/ExchangeRateContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  balance: number;
}

export default function BalanceSummary({ balance }: Props) {
  const { formatUSD, formatBS } = useExchangeRate();

  return (
    <div className="glass-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${balance >= 0 ? 'bg-success/20' : 'bg-danger/20'}`}>
          {balance >= 0 ? <TrendingUp size={24} className="text-success" /> : <TrendingDown size={24} className="text-danger" />}
        </div>
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wider">Balance actual</p>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatUSD(balance)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-text-muted">Equivalente en bolívares</p>
        <p className="text-lg font-bold text-text-secondary">{formatBS(balance)}</p>
      </div>
    </div>
  );
}