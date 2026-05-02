import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, ShieldAlert, Zap, Circle } from 'lucide-react';

export const Sidebar = () => {
  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/ventas', icon: ShoppingCart, label: 'Ventas' },
    { to: '/auditoria', icon: ShieldAlert, label: 'Auditoría' },
  ];

  return (
    <aside className="w-72 glass flex flex-col border-r border-white/5">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
            <Zap className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">AuditorPOS</h1>
            <p className="text-xs text-gray-500">Transparencia Total</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-3 px-3">Módulos</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
            {({ isActive }) => isActive && <Circle size={8} className="ml-auto fill-blue-400 text-blue-400" />}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs text-gray-500">Tasa BCV actualizada</span>
        </div>
        <p className="text-xs text-gray-600 mt-2">v2.0 · Demo Profesional</p>
      </div>
    </aside>
  );
};