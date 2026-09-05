import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import ManualRateModal from '../ExchangeRate/ManualRateModal';

export default function Login() {
  const { login } = useAuth();
  const { rate, loading: rateLoading } = useExchangeRate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Ingrese correo y contraseña.');
      return;
    }
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.success) {
      setError(result.error || 'Error desconocido.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-aurora p-4">
      <ManualRateModal />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card p-6 sm:p-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
            <Sparkles size={32} className="text-white" />
          </div>
          {/* TECNOVA VIP como marca principal */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
            Tecnova VIP
          </h1>
          {/* Audity Pro como nombre del sistema */}
          <p className="text-sm sm:text-base text-text-secondary font-medium">
            Audity Pro · Sistema de Auditoría de Inventarios
          </p>
        </div>

        {rate && (
          <div className="flex items-center justify-center gap-2 bg-surface/40 rounded-xl py-3 px-4 border border-primary/20 text-sm sm:text-base">
            Tasa BCV: <strong>{rate.rate.toFixed(2)} Bs/USD</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm sm:text-base text-text-secondary flex items-center gap-2">
              <Mail size={18} /> Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
              placeholder="usuario@tienda.com"
              autoComplete="email"
              disabled={submitting}
            />
          </div>
          <div>
            <label className="text-sm sm:text-base text-text-secondary flex items-center gap-2">
              <Lock size={18} /> Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={submitting}
            />
          </div>
          {error && <p className="text-danger text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-primary to-accent rounded-xl font-bold text-white text-base sm:text-lg transition disabled:opacity-70 disabled:cursor-wait"
          >
            {submitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p className="text-xs sm:text-sm text-text-muted text-center">
          Contacte al administrador para crear una cuenta.
        </p>
      </motion.div>
    </div>
  );
}