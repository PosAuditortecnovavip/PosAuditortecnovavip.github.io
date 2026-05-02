import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, ShieldAlert, Zap, TrendingUp } from 'lucide-react';

export const Sidebar = () => {
  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/ventas', icon: ShoppingCart, label: 'Ventas' },
    { to: '/auditoria', icon: ShieldAlert, label: 'Auditoría' },
  ];

  return (
    <aside className="w-72 glass flex flex-col border-r border-white/5">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center shadow-glow">
            <Zap className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">AuditorPOS</h1>
            <p className="text-xs text-gray-500">Transparencia Total</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-2">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-3 px-3">Módulos</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-accent-blue/10 border border-accent-blue/30 text-accent-blue shadow-glow'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`
            }
          >
            <item.icon size={20} className={({ isActive }) =>
              isActive ? 'text-accent-blue' : 'text-gray-500 group-hover:text-white'
            } />
            <span className="font-medium">{item.label}</span>
            {({ isActive }) => isActive && (
              <div className="ml-auto w-2 h-2 rounded-full bg-accent-blue animate-pulse-slow" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <TrendingUp size={14} className="text-accent-green" />
          <span>Tasa BCV actualizada</span>
        </div>
        <div className="mt-2 text-xs text-gray-600">v2.0 · Demo Profesional</div>
      </div>
    </aside>
  );
};
