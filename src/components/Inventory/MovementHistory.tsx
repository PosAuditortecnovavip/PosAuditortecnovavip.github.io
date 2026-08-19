import { motion } from 'framer-motion';
import { ArrowUpCircle, ArrowDownCircle, Edit3, Clock } from 'lucide-react';
import { InventoryMovement } from '../../types';

interface Props {
  movements: InventoryMovement[];
  productName?: string;
}

export default function MovementHistory({ movements, productName }: Props) {
  const getIcon = (type: InventoryMovement['type']) => {
    switch (type) {
      case 'entry': return <ArrowUpCircle size={20} className="text-success" />;
      case 'exit': return <ArrowDownCircle size={20} className="text-danger" />;
      case 'adjustment': return <Edit3 size={20} className="text-warning" />;
    }
  };

  const formatType = (type: InventoryMovement['type']) => {
    switch (type) {
      case 'entry': return 'Entrada';
      case 'exit': return 'Salida';
      case 'adjustment': return 'Ajuste';
    }
  };

  return (
    <div className="glass-card p-4 space-y-3 max-h-[350px] overflow-y-auto">
      <h3 className="font-bold text-base">
        Historial {productName ? `· ${productName}` : 'general'}
      </h3>
      {movements.length === 0 ? (
        <p className="text-text-muted text-sm">Sin movimientos registrados</p>
      ) : (
        movements.slice(0, 30).map(mov => (
          <div key={mov.id} className="flex items-start gap-3 text-sm py-3 border-b border-border/20 last:border-0">
            <div className="mt-0.5">{getIcon(mov.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-2">
                <span className="font-medium truncate">{mov.productName}</span>
                <span className="font-bold">{mov.quantity}</span>
              </div>
              <div className="flex justify-between text-text-muted text-xs mt-1">
                <span>{formatType(mov.type)} · {mov.reason}</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(mov.createdAt).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
              <span className="text-text-muted text-xs">Por: {mov.userName}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}