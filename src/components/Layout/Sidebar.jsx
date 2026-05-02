import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, ShieldAlert, BarChart3 } from 'lucide-react';

export const Sidebar = () => {
  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/ventas', icon: ShoppingCart, label: 'Ventas' },
    { to: '/auditoria', icon: ShieldAlert, label: 'Auditoría' },
  ];

  return (
    <aside className="w-64 bg-dark-800 border-r border-dark-700 flex flex-col">
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center space-x-2">
          <BarChart3 className="text-accent-green" size={28} />
          <span className="text-xl font-bold text-white">AuditorPOS</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-accent-blue/10 text-accent-blue'
                  : 'text-dark-500 hover:bg-dark-700 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-dark-700 text-xs text-dark-500">
        v1.0 Demo · Tasa BCV
      </div>
    </aside>
  );
};