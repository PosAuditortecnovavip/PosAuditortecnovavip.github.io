import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle2, User } from 'lucide-react';
import { AuditRecord } from '../../types';

interface Props {
  history: AuditRecord[];
}

export default function AuditHistory({ history }: Props) {
  return (
    <div className="glass-card p-4 space-y-3 max-h-[600px] overflow-y-auto">
      <h3 className="font-bold text-sm">Historial de Auditorías</h3>
      {history.length === 0 ? (
        <p className="text-text-muted text-xs">No se han realizado auditorías.</p>
      ) : (
        history.slice(0, 40).map(record => (
          <div key={record.id} className="bg-surface/30 rounded-lg p-3 text-xs space-y-1">
            <div className="flex justify-between items-start">
              <span className="font-medium truncate">{record.productName}</span>
              {record.difference === 0 ? (
                <CheckCircle2 size={14} className="text-success shrink-0" />
              ) : (
                <AlertTriangle size={14} className="text-warning shrink-0" />
              )}
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Sistema: {record.systemStock}</span>
              <span>Físico: {record.physicalStock}</span>
              <span className={record.difference !== 0 ? 'text-warning font-bold' : 'text-success'}>
                {record.difference > 0 ? '+' : ''}{record.difference}
              </span>
            </div>
            {record.reason && (
              <p className="text-text-muted italic text-[11px] leading-tight">
                "{record.reason}"
              </p>
            )}
            <div className="flex justify-between items-center text-text-muted text-[10px] pt-1 border-t border-border/30">
              <span className="flex items-center gap-1">
                <User size={10} /> {record.auditorName}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {new Date(record.createdAt).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}