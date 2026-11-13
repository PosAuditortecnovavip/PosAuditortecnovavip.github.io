import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  LayoutDashboard, ShoppingCart, PackageOpen, ClipboardCheck,
  DollarSign, FileText, LogOut, TrendingUp, Menu, X, Users,
  RefreshCw, Edit3, Bell, Sun, Moon, UserPlus, ShoppingBag,
} from 'lucide-react';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../hooks/useNotifications';
import { motion, AnimatePresence } from 'framer-motion';

export type ViewId = 'dashboard' | 'sales' | 'inventory' | 'audit' | 'finance' | 'reports' | 'customers' | 'users' | 'backup' | 'purchases';

const navItems: { id: ViewId; label: string; icon: typeof LayoutDashboard; roles: UserRole[] }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.SELLER, UserRole.INVENTORY] },
  { id: 'sales', label: 'Ventas', icon: ShoppingCart, roles: [UserRole.ADMIN, UserRole.SELLER] },
  { id: 'inventory', label: 'Inventario', icon: PackageOpen, roles: [UserRole.ADMIN, UserRole.INVENTORY] },
  { id: 'purchases', label: 'Compras', icon: ShoppingBag, roles: [UserRole.ADMIN, UserRole.INVENTORY] },
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
  const handleRefreshRate = async () => { try { await refreshRate(); } catch (e) { console.error(e); } };

  return (
    <nav className="bg-surface/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 flex items-center justify-between h-16">
        
        {/* LOGO */}
        <div className="flex flex-col leading-tight shrink-0 mr-4">
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Tecnova VIP
          </span>
          <span className="text-[10px] text-text-muted font-medium">Audity Pro</span>
        </div>

        {/* MENÚ ESCRITORIO - Ahora con scroll horizontal si no cabe */}
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 px-2">
          {allowedItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeView === id
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* ACCIONES (Tasa, Tema, Usuario) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {rate && (
            <div className="flex items-center gap-1 bg-surface/50 rounded-lg px-2 py-1.5 text-xs font-medium border border-border/50">
              <TrendingUp size={14} className="text-primary" />
              <span>BCV: {rate.rate.toFixed(2)}</span>
              <button onClick={handleRefreshRate} disabled={rateLoading} className="p-1 hover:text-primary transition disabled:opacity-50"><RefreshCw size={12} className={rateLoading ? 'animate-spin' : ''} /></button>
              <button onClick={promptManualRate} className="p-1 hover:text-primary transition"><Edit3 size={12} /></button>
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="relative">
              <Bell size={18} className="text-warning" />
              <span className="absolute -top-1 -right-1 bg-danger text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{lowStock.length}</span>
            </div>
          )}
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-surface transition text-text-secondary">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="flex flex-col items-end mr-2">
            <span className="text-xs font-bold text-text-primary">{user.name}</span>
            <span className="text-[10px] text-text-muted capitalize">{user.role}</span>
          </div>
          <button onClick={logout} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10 rounded-lg transition">
            <LogOut size={16} /> Salir
          </button>
        </div>

        {/* MENÚ MÓVIL */}
        <div className="flex lg:hidden items-center gap-2">
          <button onClick={toggleTheme} className="p-2 text-text-secondary"><Sun size={20} /></button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-text-primary">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* DROPDOWN MÓVIL */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="lg:hidden overflow-hidden bg-surface border-t border-border/50">
            <div className="p-3 space-y-1">
              {allowedItems.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => { onNavigate(id); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeView === id ? 'bg-primary/10 text-primary' : 'text-text-secondary'}`}>
                  <Icon size={18} />{label}
                </button>
              ))}
              <div className="border-t border-border/50 pt-2 mt-2">
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-danger bg-danger/10 rounded-xl">
                  <LogOut size={18} />Cerrar Sesión
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
