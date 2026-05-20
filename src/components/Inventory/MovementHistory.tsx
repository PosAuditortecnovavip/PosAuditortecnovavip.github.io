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
      case 'entry': return <ArrowUpCircle size={14} className="text-success" />;
      case 'exit': return <ArrowDownCircle size={14} className="text-danger" />;
      case 'adjustment': return <Edit3 size={14} className="text-warning" />;
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
    <div className="glass-card p-4 space-y-2 max-h-[350px] overflow-y-auto">
      <h3 className="font-bold text-sm">
        Historial {productName ? `· ${productName}` : 'general'}
      </h3>
      {movements.length === 0 ? (
        <p className="text-text-muted text-xs">Sin movimientos registrados</p>
      ) : (
        movements.slice(0, 30).map(mov => (
          <div key={mov.id} className="flex items-start gap-2 text-xs py-2 border-b border-border/20 last:border-0">
            <div className="mt-0.5">{getIcon(mov.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-2">
                <span className="font-medium truncate">{mov.productName}</span>
                <span className="font-bold">{mov.quantity}</span>
              </div>
              <div className="flex justify-between text-text-muted text-[10px] mt-0.5">
                <span>{formatType(mov.type)} · {mov.reason}</span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {new Date(mov.createdAt).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
              <span className="text-text-muted text-[10px]">Por: {mov.userName}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}