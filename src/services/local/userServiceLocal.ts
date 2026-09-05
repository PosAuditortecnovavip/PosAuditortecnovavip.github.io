import { User, UserRole } from '../../types';

const STORAGE_KEY = 'audity_users';

interface LocalUser extends User {
  password: string;
}

const getUsers = (): LocalUser[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveUsers = (users: LocalUser[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// Crear usuarios por defecto si no existen
const ensureDefaultUsers = (): void => {
  const users = getUsers();
  if (users.length === 0) {
    const defaultUsers: LocalUser[] = [
      {
        uid: 'admin-001',
        email: 'admin@auditypro.com',
        name: 'Administrador',
        role: UserRole.ADMIN,
        active: true,
        password: 'admin123',
      },
      {
        uid: 'seller-001',
        email: 'vendedor@auditypro.com',
        name: 'Vendedor',
        role: UserRole.SELLER,
        active: true,
        password: 'vendedor123',
      },
      {
        uid: 'inventory-001',
        email: 'inventario@auditypro.com',
        name: 'Encargado de Inventario',
        role: UserRole.INVENTORY,
        active: true,
        password: 'inventario123',
      },
    ];
    saveUsers(defaultUsers);
  }
};

export const getAllUsersLocal = (): LocalUser[] => {
  ensureDefaultUsers();
  return getUsers();
};

export const addUserLocal = (user: LocalUser): LocalUser => {
  const users = getUsers();
  const newUser = { ...user, uid: `user-${Date.now()}` };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const updateUserLocal = (uid: string, data: Partial<LocalUser>): LocalUser | null => {
  const users = getUsers();
  const index = users.findIndex(u => u.uid === uid);
  if (index === -1) return null;
  users[index] = { ...users[index], ...data };
  saveUsers(users);
  return users[index];
};

export const deleteUserLocal = (uid: string): boolean => {
  const users = getUsers();
  const filtered = users.filter(u => u.uid !== uid);
  if (filtered.length === users.length) return false;
  saveUsers(filtered);
  return true;
};