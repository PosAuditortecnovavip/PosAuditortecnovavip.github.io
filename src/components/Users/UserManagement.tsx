import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { User, UserRole } from '../../types';
import {
  RefreshCw,
  Save,
  ShieldOff,
  UserX,
  UserPlus,
  Trash2,
  Pencil,
} from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.SELLER);
  const [showCreate, setShowCreate] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.SELLER);
  const [creating, setCreating] = useState(false);

  // Cargar usuarios
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const usersList = snapshot.docs.map((doc) => {
  const data = doc.data() as Partial<User>;
  return {
    uid: doc.id,
    email: data.email || '',
    name: data.name || '',
    role: data.role || UserRole.SELLER,
    active: data.active,
  } as User;
});
      setUsers(usersList);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Actualizar rol
  const handleUpdateRole = async (uid: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: selectedRole });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      alert('Error al actualizar rol.');
    }
  };

  // Activar / Desactivar usuario
  const handleToggleActive = async (uid: string, currentActive?: boolean) => {
    try {
      const newActive = currentActive === false ? true : false;
      await updateDoc(doc(db, 'users', uid), { active: newActive });
      fetchUsers();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar estado del usuario.');
    }
  };

  // Eliminar usuario (solo de Firestore)
  const handleDeleteUser = async (uid: string) => {
    if (
      !confirm(
        '¿Eliminar este usuario permanentemente? Esta acción no se puede deshacer.'
      )
    ) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'users', uid));
      alert(
        'Usuario eliminado de la lista. Para eliminarlo completamente de Authentication, despliega la Cloud Function.'
      );
      fetchUsers();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar usuario.');
    }
  };

  // Crear usuario
  const handleCreateUser = async () => {
    if (!newEmail || !newPassword) {
      alert('Ingrese correo y contraseña.');
      return;
    }
    setCreating(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newEmail,
        newPassword
      );
      const uid = userCredential.user.uid;
      await setDoc(doc(db, 'users', uid), {
        email: newEmail,
        name: newEmail,
        role: newRole,
        active: true,
        createdAt: new Date().toISOString(),
      });
      setShowCreate(false);
      setNewEmail('');
      setNewPassword('');
      fetchUsers();
      alert('Usuario creado exitosamente.');
    } catch (error: any) {
      console.error('Error al crear usuario:', error);
      let mensaje = 'Error al crear usuario.';
      if (error.code === 'auth/email-already-in-use') {
        mensaje = 'El correo ya está en uso.';
      } else if (error.code === 'auth/invalid-email') {
        mensaje = 'Correo inválido.';
      } else if (error.code === 'auth/weak-password') {
        mensaje = 'La contraseña debe tener al menos 6 caracteres.';
      }
      alert(mensaje);
    } finally {
      setCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="text-text-secondary mt-1 text-base">
            Administrar roles y accesos
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="glass-card px-5 py-3 text-base flex items-center gap-2 text-primary hover:bg-primary/10 transition"
          >
            <UserPlus size={20} />
            Nuevo usuario
          </button>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="glass-card px-5 py-3 text-base flex items-center gap-2 text-text-secondary hover:bg-surface/40 transition disabled:opacity-50"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Formulario de creación */}
      {showCreate && (
        <div className="glass-card p-5 md:p-6 space-y-4">
          <h3 className="font-bold text-lg">Crear nuevo usuario</h3>
          <div>
            <label
              htmlFor="new-user-email"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              Correo electrónico
            </label>
            <input
              id="new-user-email"
              type="email"
              placeholder="usuario@tienda.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full bg-surface/50 border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary transition"
            />
          </div>
          <div>
            <label
              htmlFor="new-user-password"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              Contraseña
            </label>
            <input
              id="new-user-password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-surface/50 border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary transition"
            />
          </div>
          <div>
            <label
              htmlFor="new-user-role"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              Rol
            </label>
            <select
              id="new-user-role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="w-full bg-surface/50 border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary transition"
            >
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.SELLER}>Vendedor</option>
              <option value={UserRole.INVENTORY}>Inventario</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreateUser}
              disabled={creating}
              className="flex-1 py-3.5 bg-primary rounded-xl text-white font-bold text-base hover:bg-primary-dark transition disabled:opacity-50"
            >
              {creating ? 'Creando...' : 'Crear'}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="flex-1 py-3.5 border border-border rounded-xl text-base text-text-secondary hover:bg-surface/50 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Tabla de usuarios */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="animate-spin mx-auto" size={32} />
        </div>
      ) : (
        <div className="glass-card p-4 md:p-6 overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm md:text-base">
            <thead className="bg-surface/30">
              <tr className="text-text-muted">
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Rol</th>
                <th className="text-center p-3">Estado</th>
                <th className="text-center p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uid} className="border-b border-border/20">
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">
                    {editingUser === user.uid ? (
                      <select
                        value={selectedRole}
                        onChange={(e) =>
                          setSelectedRole(e.target.value as UserRole)
                        }
                        className="bg-surface/50 border border-border rounded-lg p-2 text-base outline-none focus:border-primary"
                      >
                        <option value={UserRole.ADMIN}>Admin</option>
                        <option value={UserRole.SELLER}>Vendedor</option>
                        <option value={UserRole.INVENTORY}>Inventario</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === UserRole.ADMIN
                            ? 'bg-primary/20 text-primary'
                            : user.role === UserRole.SELLER
                            ? 'bg-success/20 text-success'
                            : 'bg-warning/20 text-warning'
                        }`}
                      >
                        {user.role === UserRole.ADMIN
                          ? 'Admin'
                          : user.role === UserRole.SELLER
                          ? 'Vendedor'
                          : 'Inventario'}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {user.active === false ? (
                      <span className="text-danger flex items-center justify-center gap-1">
                        <ShieldOff size={18} />
                        Inactivo
                      </span>
                    ) : (
                      <span className="text-success">● Activo</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      {editingUser === user.uid ? (
                        <button
                          onClick={() => handleUpdateRole(user.uid)}
                          className="inline-flex items-center gap-1 p-2 md:p-2.5 rounded-xl text-success hover:bg-success/10 transition"
                          title="Guardar rol"
                          aria-label="Guardar rol"
                        >
                          <Save size={18} />
                          <span className="hidden md:inline text-sm">
                            Guardar
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingUser(user.uid);
                            setSelectedRole(user.role);
                          }}
                          className="inline-flex items-center gap-1 p-2 md:p-2.5 rounded-xl text-primary hover:bg-primary/10 transition"
                          title="Editar rol"
                          aria-label="Editar rol"
                        >
                          <Pencil size={18} />
                          <span className="hidden md:inline text-sm">
                            Editar rol
                          </span>
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleToggleActive(user.uid, user.active)
                        }
                        className="inline-flex items-center gap-1 p-2 md:p-2.5 rounded-xl text-warning hover:bg-warning/10 transition"
                        title={
                          user.active === false
                            ? 'Activar usuario'
                            : 'Desactivar usuario'
                        }
                        aria-label={
                          user.active === false
                            ? 'Activar usuario'
                            : 'Desactivar usuario'
                        }
                      >
                        {user.active === false ? (
                          <UserPlus size={18} />
                        ) : (
                          <UserX size={18} />
                        )}
                        <span className="hidden md:inline text-sm">
                          {user.active === false ? 'Activar' : 'Desactivar'}
                        </span>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.uid)}
                        className="inline-flex items-center gap-1 p-2 md:p-2.5 rounded-xl text-danger hover:bg-danger/10 transition"
                        title="Eliminar usuario"
                        aria-label="Eliminar usuario"
                      >
                        <Trash2 size={18} />
                        <span className="hidden md:inline text-sm">
                          Eliminar
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}