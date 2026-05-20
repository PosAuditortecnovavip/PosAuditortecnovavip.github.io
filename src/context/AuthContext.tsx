import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextValue {
  user: User | null;
  login: (role: UserRole, pin: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('audity_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('audity_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('audity_user');
    }
  }, [user]);

  const login = (role: UserRole, pin: string): boolean => {
    if (!pin || pin.length < 4) return false;
    const names: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'Administrador',
      [UserRole.SELLER]: 'Vendedor',
      [UserRole.INVENTORY]: 'Encargado de Inventario',
    };
    setUser({ role, name: names[role] });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};