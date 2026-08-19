<<<<<<< HEAD
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Settings {
  ivaRate: number;
}

interface SettingsContextValue extends Settings {
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>({ ivaRate: 0.16 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'config', 'settings');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setSettings(snap.data() as Settings);
        } else {
          await setDoc(docRef, { ivaRate: 0.16 });
        }
      } catch (error) {
        console.error('Error cargando configuración:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    await setDoc(doc(db, 'config', 'settings'), updated);
    setSettings(updated);
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ ...settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings debe usarse dentro de SettingsProvider');
  return context;
=======
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Settings {
  ivaRate: number;
}

interface SettingsContextValue extends Settings {
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>({ ivaRate: 0.16 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'config', 'settings');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setSettings(snap.data() as Settings);
        } else {
          await setDoc(docRef, { ivaRate: 0.16 });
        }
      } catch (error) {
        console.error('Error cargando configuración:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    await setDoc(doc(db, 'config', 'settings'), updated);
    setSettings(updated);
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ ...settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings debe usarse dentro de SettingsProvider');
  return context;
>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
};