import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Briefcase, ShoppingCart, ClipboardList, TrendingUp, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import ManualRateModal from '../ExchangeRate/ManualRateModal';

const roles = [
  { key: UserRole.ADMIN, label: 'Administrador', icon: Briefcase },
  { key: UserRole.SELLER, label: 'Vendedor', icon: ShoppingCart },
  { key: UserRole.INVENTORY, label: 'Enc. Inventario', icon: ClipboardList },
];

export default function Login() {
  const { login } = useAuth();
  const { rate, loading: rateLoading } = useExchangeRate();
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.ADMIN);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(selectedRole, pin);
    if (!success) {
      setError('PIN inválido. Debe tener al menos 4 dígitos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-aurora p-3 sm:p-4 relative">
      <ManualRateModal />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md glass-card p-6 sm:p-8 space-y-6 sm:space-y-8 mx-3 sm:mx-0"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-3 sm:mb-4">
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Audity Pro
          </h1>
          <p className="text-text-secondary text-xs sm:text-sm font-medium">Sistema de Auditoría de Inventarios</p>
        </div>

        {rate && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center gap-2 bg-surface/40 rounded-xl py-2 px-3 sm:py-3 sm:px-4 border border-primary/20"
          >
            <TrendingUp size={16} className="text-primary" />
            <span className="text-xs sm:text-sm text-text-secondary">
              Tasa BCV: <strong className="text-text-primary font-bold">{rate.rate.toFixed(2)} Bs/USD</strong>
            </span>
            {rate.source === 'manual' && (
              <span className="text-xs text-warning ml-1">(manual)</span>
            )}
          </motion.div>
        )}
        {!rate && rateLoading && (
          <div className="text-center text-text-muted text-sm">Obteniendo tasa BCV...</div>
        )}

        <div className="space-y-3">
          <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
            <User size={16} className="text-primary" /> Seleccionar Rol
          </label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {roles.map(({ key, label, icon: Icon }) => (
              <motion.button
                key={key}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRole(key)}
                className={`flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl transition-all duration-200 ${
                  selectedRole === key
                    ? 'bg-primary/10 border-2 border-primary shadow-lg shadow-primary/20'
                    : 'bg-surface/30 border-2 border-transparent hover:border-border hover:bg-surface/50'
                }`}
              >
                <Icon size={20} className={selectedRole === key ? 'text-primary' : 'text-text-muted'} />
                <span className="text-[10px] sm:text-xs font-medium leading-tight text-center">{label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
              <Lock size={16} className="text-primary" /> PIN de acceso
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full mt-2 bg-surface/50 border border-border rounded-xl p-3 sm:p-4 text-text-primary focus:border-primary outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 placeholder:text-text-muted"
              placeholder="Ingrese su PIN (4 dígitos)"
            />
            {error && <p className="text-danger text-sm mt-2">{error}</p>}
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-light rounded-xl font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 cursor-pointer"
          >
            Ingresar al Sistema
          </motion.button>
        </form>

        <p className="text-xs text-text-muted text-center">
          Cualquier PIN de 4 dígitos es válido (simulación)
        </p>
      </motion.div>
    </div>
  );
}