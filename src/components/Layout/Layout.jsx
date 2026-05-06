// src/components/Layout/Layout.jsx
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ShoppingCart, ShieldAlert, Zap, Activity
} from 'lucide-react';

const navItems = [
  { id: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { id: '/ventas', icon: ShoppingCart, label: 'Ventas' },
  { id: '/auditoria', icon: ShieldAlert, label: 'Auditoría' },
];

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white font-sans">
      {/* Barra lateral de vidrio */}
      <aside className="w-20 md:w-24 flex flex-col items-center py-6 bg-white/5 backdrop-blur-xl border-r border-white/10">
        <div className="mb-10">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center shadow-card-glow cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Zap className="text-white" size={20} />
          </motion.div>
        </div>

        <nav className="flex-1 flex flex-col items-center space-y-6">
          {navItems.map(({ id, icon: Icon, label }) => {
            const isActive = location.pathname === id;
            return (
              <motion.button
                key={id}
                onClick={() => navigate(id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-brand-blue/30 to-brand-cyan/20 border border-brand-blue/30 shadow-inner-glass'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'}
                `}
                aria-label={label}
              >
                <Icon size={20} />
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-brand-blue"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        <div className="mt-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center cursor-pointer"
          >
            <Activity size={14} className="text-brand-green" />
          </motion.div>
        </div>
      </aside>

      {/* Contenido de la ruta */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};
