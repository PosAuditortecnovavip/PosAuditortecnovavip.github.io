import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { User, UserRole } from '../../types';
import { RefreshCw, Save, ShieldOff, UserX, UserPlus, Trash2 } from 'lucide-react';

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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const usersList = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
      setUsers(usersList);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

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

  const handleDisableUser = async (uid: string, currentActive?: boolean) => {
    try {
      await updateDoc(doc(db, 'users', uid), { active: currentActive === false ? true : false });
      fetchUsers();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar estado del usuario.');
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!confirm('¿Eliminar este usuario permanentemente? Esta acción no se puede deshacer.')) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
      alert('Usuario eliminado de la lista. Para eliminarlo completamente de Authentication, despliega la Cloud Function.');
      fetchUsers();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar usuario.');
    }
  };

  const handleCreateUser = async () => {
    if (!newEmail || !newPassword) {
      alert('Ingrese correo y contraseña.');
      return;
    }
    setCreating(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newEmail, newPassword);
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
      if (error.code === 'auth/email-already-in-use') mensaje = 'El correo ya está en uso.';
      else if (error.code === 'auth/invalid-email') mensaje = 'Correo inválido.';
      else if (error.code === 'auth/weak-password') mensaje = 'La contraseña debe tener al menos 6 caracteres.';
      alert(mensaje);
    } finally {
      setCreating(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-text-secondary mt-1 text-base">Administrar roles y accesos</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCreate(!showCreate)} className="glass-card px-5 py-3 text-base flex items-center gap-2 text-primary">
            <UserPlus size={20} /> Nuevo usuario
          </button>
          <button onClick={fetchUsers} disabled={loading} className="glass-card px-5 py-3 text-base flex items-center gap-2">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} /> Actualizar
          </button>
        </div>
      </div>

      {showCreate && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-bold text-lg">Crear nuevo usuario</h3>
          <input type="email" placeholder="Correo electrónico" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full bg-surface/50 border border-border rounded-xl p-4 text-base" />
          <input type="password" placeholder="Contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-surface/50 border border-border rounded-xl p-4 text-base" />
          <select value={newRole} onChange={(e) => setNewRole(e.target.value as UserRole)} className="w-full bg-surface/50 border border-border rounded-xl p-4 text-base">
            <option value={UserRole.ADMIN}>Admin</option>
            <option value={UserRole.SELLER}>Vendedor</option>
            <option value={UserRole.INVENTORY}>Inventario</option>
          </select>
          <div className="flex gap-3">
            <button onClick={handleCreateUser} disabled={creating} className="flex-1 py-4 bg-primary rounded-xl text-white font-bold text-base">{creating ? 'Creando...' : 'Crear'}</button>
            <button onClick={() => setShowCreate(false)} className="flex-1 py-4 border border-border rounded-xl text-base">Cancelar</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12"><RefreshCw className="animate-spin mx-auto" size={32} /></div>
      ) : (
        <div className="glass-card p-4 md:p-6 overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm md:text-base">
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
              {users.map(user => (
                <tr key={user.uid} className="border-b border-border/20">
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">
                    {editingUser === user.uid ? (
                      <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as UserRole)} className="bg-surface/50 border border-border rounded-lg p-2 text-base outline-none">
                        <option value={UserRole.ADMIN}>Admin</option>
                        <option value={UserRole.SELLER}>Vendedor</option>
                        <option value={UserRole.INVENTORY}>Inventario</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === UserRole.ADMIN ? 'bg-primary/20 text-primary' :
                        user.role === UserRole.SELLER ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                      }`}>
                        {user.role === UserRole.ADMIN ? 'Admin' : user.role === UserRole.SELLER ? 'Vendedor' : 'Inventario'}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {user.active === false ? (
                      <span className="text-danger flex items-center justify-center gap-1"><ShieldOff size={18} /> Inactivo</span>
                    ) : (
                      <span className="text-success">● Activo</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      {editingUser === user.uid ? (
                        <button onClick={() => handleUpdateRole(user.uid)} className="p-3 text-success hover:bg-success/10 rounded-xl"><Save size={20} /></button>
                      ) : (
                        <button onClick={() => { setEditingUser(user.uid); setSelectedRole(user.role); }} className="p-3 text-primary hover:bg-primary/10 rounded-xl">Editar rol</button>
                      )}
                      <button onClick={() => handleDisableUser(user.uid, user.active)} className="p-3 text-warning hover:bg-warning/10 rounded-xl">
                        {user.active === false ? <UserPlus size={20} /> : <UserX size={20} />}
                      </button>
                      <button onClick={() => handleDeleteUser(user.uid)} className="p-3 text-danger hover:bg-danger/10 rounded-xl"><Trash2 size={20} /></button>
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