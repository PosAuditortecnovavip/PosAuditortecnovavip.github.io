<<<<<<< HEAD
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User, UserRole } from '../types';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 AuthProvider montado, escuchando cambios de autenticación...');
    const unsubscribe = onAuthStateChanged(auth,
      async (firebaseUser: FirebaseUser | null) => {
        console.log('👤 Estado de autenticación cambiado:', firebaseUser?.email || 'Ningún usuario');
        if (firebaseUser) {
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            console.log('📄 Buscando documento en Firestore:', userDocRef.path);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              console.log('✅ Documento de usuario encontrado:', userData);
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: userData.name || firebaseUser.email,
                role: userData.role as UserRole,
              });
            } else {
              console.log('🆕 Documento de usuario no encontrado, creando con rol por defecto...');
              const defaultRole = UserRole.SELLER;
              await setDoc(userDocRef, {
                email: firebaseUser.email,
                name: firebaseUser.email || '',
                role: defaultRole,
                createdAt: new Date().toISOString(),
              });
              console.log('✨ Documento de usuario creado con rol:', defaultRole);
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.email || '',
                role: defaultRole,
              });
            }
          } catch (error) {
            console.error('❌ Error al obtener/crear documento de usuario:', error);
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.email || 'Invitado',
              role: UserRole.SELLER,
            });
          }
        } else {
          console.log('👋 Usuario cerró sesión');
          setUser(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('❌ Error en onAuthStateChanged:', error);
        setLoading(false);
      }
    );
    return () => {
      console.log('🔌 Limpiando suscriptor de autenticación');
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('🔑 Intentando iniciar sesión con:', email);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Inicio de sesión exitoso:', userCredential.user.email);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Error de inicio de sesión:', error.code, error.message);
      let mensaje = 'Error al iniciar sesión.';
      if (error.code === 'auth/user-not-found') {
        mensaje = 'El usuario no existe.';
      } else if (error.code === 'auth/wrong-password') {
        mensaje = 'Contraseña incorrecta.';
      } else if (error.code === 'auth/invalid-email') {
        mensaje = 'Correo electrónico inválido.';
      } else if (error.code === 'auth/invalid-credential') {
        mensaje = 'Credenciales inválidas. Verifica correo y contraseña.';
      } else if (error.code === 'auth/network-request-failed') {
        mensaje = 'Error de red. Verifica tu conexión a internet.';
      } else {
        mensaje = error.message;
      }
      return { success: false, error: mensaje };
    }
  };

  const logout = async () => {
    console.log('🚪 Cerrando sesión...');
    try {
      await signOut(auth);
      console.log('👋 Sesión cerrada exitosamente');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
=======
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User, UserRole } from '../types';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 AuthProvider montado, escuchando cambios de autenticación...');
    const unsubscribe = onAuthStateChanged(auth,
      async (firebaseUser: FirebaseUser | null) => {
        console.log('👤 Estado de autenticación cambiado:', firebaseUser?.email || 'Ningún usuario');
        if (firebaseUser) {
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            console.log('📄 Buscando documento en Firestore:', userDocRef.path);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              console.log('✅ Documento de usuario encontrado:', userData);
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: userData.name || firebaseUser.email,
                role: userData.role as UserRole,
              });
            } else {
              console.log('🆕 Documento de usuario no encontrado, creando con rol por defecto...');
              const defaultRole = UserRole.SELLER;
              await setDoc(userDocRef, {
                email: firebaseUser.email,
                name: firebaseUser.email || '',
                role: defaultRole,
                createdAt: new Date().toISOString(),
              });
              console.log('✨ Documento de usuario creado con rol:', defaultRole);
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.email || '',
                role: defaultRole,
              });
            }
          } catch (error) {
            console.error('❌ Error al obtener/crear documento de usuario:', error);
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.email || 'Invitado',
              role: UserRole.SELLER,
            });
          }
        } else {
          console.log('👋 Usuario cerró sesión');
          setUser(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('❌ Error en onAuthStateChanged:', error);
        setLoading(false);
      }
    );
    return () => {
      console.log('🔌 Limpiando suscriptor de autenticación');
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('🔑 Intentando iniciar sesión con:', email);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Inicio de sesión exitoso:', userCredential.user.email);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Error de inicio de sesión:', error.code, error.message);
      let mensaje = 'Error al iniciar sesión.';
      if (error.code === 'auth/user-not-found') {
        mensaje = 'El usuario no existe.';
      } else if (error.code === 'auth/wrong-password') {
        mensaje = 'Contraseña incorrecta.';
      } else if (error.code === 'auth/invalid-email') {
        mensaje = 'Correo electrónico inválido.';
      } else if (error.code === 'auth/invalid-credential') {
        mensaje = 'Credenciales inválidas. Verifica correo y contraseña.';
      } else if (error.code === 'auth/network-request-failed') {
        mensaje = 'Error de red. Verifica tu conexión a internet.';
      } else {
        mensaje = error.message;
      }
      return { success: false, error: mensaje };
    }
  };

  const logout = async () => {
    console.log('🚪 Cerrando sesión...');
    try {
      await signOut(auth);
      console.log('👋 Sesión cerrada exitosamente');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
};