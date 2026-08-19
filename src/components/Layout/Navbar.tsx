<<<<<<< HEAD
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  LayoutDashboard, ShoppingCart, PackageOpen, ClipboardCheck,
  DollarSign, FileText, LogOut, TrendingUp, Menu, X, Users,
  RefreshCw, Edit3, Bell, Sun, Moon, UserPlus,
} from 'lucide-react';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../hooks/useNotifications';
import { motion, AnimatePresence } from 'framer-motion';

export type ViewId = 'dashboard' | 'sales' | 'inventory' | 'audit' | 'finance' | 'reports' | 'customers' | 'users' | 'backup';

const navItems: { id: ViewId; label: string; icon: typeof LayoutDashboard; roles: UserRole[] }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.SELLER, UserRole.INVENTORY] },
  { id: 'sales', label: 'Ventas', icon: ShoppingCart, roles: [UserRole.ADMIN, UserRole.SELLER] },
  { id: 'inventory', label: 'Inventario', icon: PackageOpen, roles: [UserRole.ADMIN, UserRole.INVENTORY] },
  { id: 'audit', label: 'Auditoría', icon: ClipboardCheck, roles: [UserRole.ADMIN, UserRole.INVENTORY] },
  { id: 'finance', label: 'Finanzas', icon: DollarSign, roles: [UserRole.ADMIN] },
  { id: 'reports', label: 'Reportes', icon: FileText, roles: [UserRole.ADMIN, UserRole.INVENTORY] },
  { id: 'customers', label: 'Clientes', icon: Users, roles: [UserRole.ADMIN] },
  { id: 'users', label: 'Usuarios', icon: UserPlus, roles: [UserRole.ADMIN] },
  { id: 'backup', label: 'Copia Seg.', icon: FileText, roles: [UserRole.ADMIN] },
];

interface NavbarProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
}

export default function Navbar({ activeView, onNavigate }: NavbarProps) {
  const { user, logout } = useAuth();
  const { rate, loading: rateLoading, refresh: refreshRate, promptManualRate } = useExchangeRate();
  const { theme, toggleTheme } = useTheme();
  const lowStock = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const allowedItems = navItems.filter((item) => item.roles.includes(user.role));

  const handleRefreshRate = async () => {
    try { await refreshRate(); } catch (error) { console.error(error); }
  };

  return (
    <nav className="bg-surface/60 backdrop-blur-xl border-b border-primary/10 sticky top-0 z-40 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-3 md:px-6 flex items-center justify-between">
        <span className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mr-2 shrink-0">
          Audity Pro
        </span>

        {/* Menú escritorio */}
        <div className="hidden md:flex items-center gap-1 overflow-x-auto">
          {allowedItems.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              onClick={() => onNavigate(id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-3 py-3 text-sm font-medium transition-all duration-200 border-b-2 shrink-0 cursor-pointer ${
                activeView === id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </motion.button>
          ))}
        </div>

        {/* Indicadores (escritorio) */}
        <div className="hidden md:flex items-center gap-4">
          {rate && (
            <div className="flex items-center gap-2 bg-primary/5 rounded-full px-3 py-1 text-xs font-medium text-text-secondary border border-primary/10">
              <TrendingUp size={14} className="text-primary" />
              <span>BCV: {rate.rate.toFixed(2)}</span>
              <button
                onClick={handleRefreshRate}
                disabled={rateLoading}
                className="p-0.5 rounded-full hover:bg-primary/10 transition disabled:opacity-50"
                title="Actualizar tasa"
              >
                <RefreshCw size={12} className={rateLoading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={() => { console.log('click lápiz'); promptManualRate(); }}
                className="p-0.5 rounded-full hover:bg-primary/10 transition"
                title="Ingresar tasa manualmente"
              >
                <Edit3 size={12} />
              </button>
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="relative">
              <Bell size={18} className="text-warning cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-danger text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {lowStock.length}
              </span>
            </div>
          )}
          <button onClick={toggleTheme} className="p-1.5 rounded-full hover:bg-surface/50">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <span className="text-xs font-medium text-text-secondary bg-surface/40 rounded-full px-3 py-1">
            {user.name}
          </span>
          <button
            onClick={() => { console.log('click salir'); logout(); }}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10 rounded-xl transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>Salir</span>
          </button>
        </div>

        {/* Móvil */}
        <div className="flex items-center gap-2 md:hidden">
          {rate && (
            <div className="flex items-center gap-1 text-xs bg-primary/5 rounded-full px-2 py-0.5">
              <TrendingUp size={12} className="text-primary" />
              <span>{rate.rate.toFixed(2)}</span>
              <button onClick={handleRefreshRate} disabled={rateLoading} className="p-0.5"><RefreshCw size={10} /></button>
              <button onClick={promptManualRate} className="p-0.5"><Edit3 size={10} /></button>
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="relative">
              <Bell size={16} className="text-warning" />
              <span className="absolute -top-1 -right-1 bg-danger text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center">{lowStock.length}</span>
            </div>
          )}
          <button onClick={toggleTheme} className="p-1"><Sun size={16} /></button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="md:hidden overflow-hidden bg-surface/90 backdrop-blur-xl border-t border-primary/10">
            <div className="p-3 space-y-1">
              {allowedItems.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => { onNavigate(id); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeView === id ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface/50'}`}>
                  <Icon size={18} />{label}
                </button>
              ))}
              <div className="border-t border-border pt-2 mt-2 flex justify-between items-center">
                <span className="text-xs text-text-muted px-4">{user.name}</span>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-danger hover:bg-danger/10 rounded-xl">
                  <LogOut size={16} />Salir
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
=======
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  LayoutDashboard, ShoppingCart, PackageOpen, ClipboardCheck,
  DollarSign, FileText, LogOut, TrendingUp, Menu, X, Users,
  RefreshCw, Edit3, Bell, Sun, Moon, UserPlus,
} from 'lucide-react';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../hooks/useNotifications';
import { motion, AnimatePresence } from 'framer-motion';

export type ViewId = 'dashboard' | 'sales' | 'inventory' | 'audit' | 'finance' | 'reports' | 'customers' | 'users' | 'backup';

const navItems: { id: ViewId; label: string; icon: typeof LayoutDashboard; roles: UserRole[] }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.SELLER, UserRole.INVENTORY] },
  { id: 'sales', label: 'Ventas', icon: ShoppingCart, roles: [UserRole.ADMIN, UserRole.SELLER] },
  { id: 'inventory', label: 'Inventario', icon: PackageOpen, roles: [UserRole.ADMIN, UserRole.INVENTORY] },
  { id: 'audit', label: 'Auditoría', icon: ClipboardCheck, roles: [UserRole.ADMIN, UserRole.INVENTORY] },
  { id: 'finance', label: 'Finanzas', icon: DollarSign, roles: [UserRole.ADMIN] },
  { id: 'reports', label: 'Reportes', icon: FileText, roles: [UserRole.ADMIN, UserRole.INVENTORY] },
  { id: 'customers', label: 'Clientes', icon: Users, roles: [UserRole.ADMIN] },
  { id: 'users', label: 'Usuarios', icon: UserPlus, roles: [UserRole.ADMIN] },
  { id: 'backup', label: 'Copia Seg.', icon: FileText, roles: [UserRole.ADMIN] },
];

interface NavbarProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
}

export default function Navbar({ activeView, onNavigate }: NavbarProps) {
  const { user, logout } = useAuth();
  const { rate, loading: rateLoading, refresh: refreshRate, promptManualRate } = useExchangeRate();
  const { theme, toggleTheme } = useTheme();
  const lowStock = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const allowedItems = navItems.filter((item) => item.roles.includes(user.role));

  const handleRefreshRate = async () => {
    try { await refreshRate(); } catch (error) { console.error(error); }
  };

  return (
    <nav className="bg-surface/60 backdrop-blur-xl border-b border-primary/10 sticky top-0 z-40 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-3 md:px-6 flex items-center justify-between">
        <span className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mr-2 shrink-0">
          Audity Pro
        </span>

        {/* Menú escritorio */}
        <div className="hidden md:flex items-center gap-1 overflow-x-auto">
          {allowedItems.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              onClick={() => onNavigate(id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-3 py-3 text-sm font-medium transition-all duration-200 border-b-2 shrink-0 cursor-pointer ${
                activeView === id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </motion.button>
          ))}
        </div>

        {/* Indicadores (escritorio) */}
        <div className="hidden md:flex items-center gap-4">
          {rate && (
            <div className="flex items-center gap-2 bg-primary/5 rounded-full px-3 py-1 text-xs font-medium text-text-secondary border border-primary/10">
              <TrendingUp size={14} className="text-primary" />
              <span>BCV: {rate.rate.toFixed(2)}</span>
              <button
                onClick={handleRefreshRate}
                disabled={rateLoading}
                className="p-0.5 rounded-full hover:bg-primary/10 transition disabled:opacity-50"
                title="Actualizar tasa"
              >
                <RefreshCw size={12} className={rateLoading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={() => { console.log('click lápiz'); promptManualRate(); }}
                className="p-0.5 rounded-full hover:bg-primary/10 transition"
                title="Ingresar tasa manualmente"
              >
                <Edit3 size={12} />
              </button>
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="relative">
              <Bell size={18} className="text-warning cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-danger text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {lowStock.length}
              </span>
            </div>
          )}
          <button onClick={toggleTheme} className="p-1.5 rounded-full hover:bg-surface/50">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <span className="text-xs font-medium text-text-secondary bg-surface/40 rounded-full px-3 py-1">
            {user.name}
          </span>
          <button
            onClick={() => { console.log('click salir'); logout(); }}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10 rounded-xl transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>Salir</span>
          </button>
        </div>

        {/* Móvil */}
        <div className="flex items-center gap-2 md:hidden">
          {rate && (
            <div className="flex items-center gap-1 text-xs bg-primary/5 rounded-full px-2 py-0.5">
              <TrendingUp size={12} className="text-primary" />
              <span>{rate.rate.toFixed(2)}</span>
              <button onClick={handleRefreshRate} disabled={rateLoading} className="p-0.5"><RefreshCw size={10} /></button>
              <button onClick={promptManualRate} className="p-0.5"><Edit3 size={10} /></button>
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="relative">
              <Bell size={16} className="text-warning" />
              <span className="absolute -top-1 -right-1 bg-danger text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center">{lowStock.length}</span>
            </div>
          )}
          <button onClick={toggleTheme} className="p-1"><Sun size={16} /></button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="md:hidden overflow-hidden bg-surface/90 backdrop-blur-xl border-t border-primary/10">
            <div className="p-3 space-y-1">
              {allowedItems.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => { onNavigate(id); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeView === id ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface/50'}`}>
                  <Icon size={18} />{label}
                </button>
              ))}
              <div className="border-t border-border pt-2 mt-2 flex justify-between items-center">
                <span className="text-xs text-text-muted px-4">{user.name}</span>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-danger hover:bg-danger/10 rounded-xl">
                  <LogOut size={16} />Salir
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
}