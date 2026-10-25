import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, Download, FileSpreadsheet } from 'lucide-react';
import { usePurchases } from '../../hooks/usePurchases';
import { useInventory } from '../../hooks/useInventory';
import { useAuth } from '../../context/AuthContext';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import { generatePurchasesReport } from '../../utils/pdfGenerator';
import { exportPurchasesExcel } from '../../utils/excelGenerator';
import PurchaseForm from './PurchaseForm';
import PurchaseList from './PurchaseList';

export default function PurchasesPage() {
  const { purchases, addPurchase, refresh, loading } = usePurchases();
  const { products, refresh: refreshInventory } = useInventory();
  const { user } = useAuth();
  const { rate } = useExchangeRate();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { refresh(); }, [refresh]);

  const handleSubmit = async (data: any) => {
    if (!user) return;
    await addPurchase({ ...data, userId: user.uid, userName: user.name });
    await refreshInventory();
    setShowForm(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Compras</h1>
          <p className="text-text-secondary mt-1 text-sm md:text-base">Registro de mercancía y proveedores</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => generatePurchasesReport(purchases, rate?.rate || 0)} disabled={purchases.length === 0 || loading} className="glass-card px-4 py-2 flex items-center gap-2 text-sm font-medium text-primary hover:bg-primary/10 transition disabled:opacity-40"><Download size={16} /> PDF</button>
          <button onClick={() => exportPurchasesExcel(purchases)} disabled={purchases.length === 0 || loading} className="glass-card px-4 py-2 flex items-center gap-2 text-sm font-medium text-success hover:bg-success/10 transition disabled:opacity-40"><FileSpreadsheet size={16} /> Excel</button>
          <button onClick={() => setShowForm(!showForm)} className="glass-card px-4 py-2 flex items-center gap-2 text-sm font-medium text-primary hover:bg-primary/10 transition"><Plus size={16} /> Registrar compra</button>
          <button onClick={refresh} disabled={loading} className="glass-card px-4 py-2 flex items-center gap-2 text-sm font-medium text-text-secondary hover:bg-surface/40 transition disabled:opacity-50"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualizar</button>
        </div>
      </div>
      {showForm && <PurchaseForm products={products} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />}
      <PurchaseList purchases={purchases} />
    </motion.div>
  );
}