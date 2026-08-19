import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload } from 'lucide-react';
import { exportAllData, importAllData } from '../../services/backupServices';

export default function BackupPanel() {
  const [importing, setImporting] = useState(false);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      await importAllData(file);
      alert('Datos importados exitosamente.');
    } catch (error) {
      console.error(error);
      alert('Error al importar.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-extrabold">Copia de seguridad</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="glass-card p-6 text-center space-y-5">
          <Download size={48} className="mx-auto text-primary" />
          <h3 className="font-bold text-xl">Exportar datos</h3>
          <p className="text-base text-text-secondary">Descarga un archivo JSON con todos los datos del sistema.</p>
          <button onClick={exportAllData} className="bg-primary px-6 py-4 rounded-xl text-white font-bold text-base hover:bg-primary-dark transition">Descargar</button>
        </div>
        <div className="glass-card p-6 text-center space-y-5">
          <Upload size={48} className="mx-auto text-success" />
          <h3 className="font-bold text-xl">Importar datos</h3>
          <p className="text-base text-text-secondary">Restaura los datos desde un archivo JSON previamente exportado.</p>
          <label className="cursor-pointer bg-success px-6 py-4 rounded-xl text-white font-bold text-base hover:bg-success/80 transition inline-block">
            {importing ? 'Importando...' : 'Cargar archivo'}
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>
    </motion.div>
  );
}