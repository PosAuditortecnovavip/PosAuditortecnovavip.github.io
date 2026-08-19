<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, ShoppingCart, PackageOpen, ClipboardCheck, DollarSign,
  Download, RefreshCw, AlertTriangle, RotateCcw,
} from 'lucide-react';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import { getAllSales } from '../../services/salesService';
import { useInventory } from '../../hooks/useInventory';
import { useAudit } from '../../hooks/useAudit';
import { useFinance } from '../../hooks/useFinance';
import {
  generateSalesReport,
  generateInventoryReport,
  generateAuditReport,
  generateFinanceReport,
  generateLowStockReport,
} from '../../utils/pdfGenerator';
import { generateFiscalInvoice } from '../../utils/fiscalInvoice';
import { useSettings } from '../../context/SettingsContext';
import CreditNoteModal from '../CreditNote/CreditNoteModal';
import { Sale } from '../../types';

type Tab = 'sales' | 'inventory' | 'audit' | 'finance';

const tabs: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: 'sales', label: 'Ventas', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventario', icon: PackageOpen },
  { id: 'audit', label: 'Auditoría', icon: ClipboardCheck },
  { id: 'finance', label: 'Finanzas', icon: DollarSign },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState<Tab>('sales');
  const { rate } = useExchangeRate();
  const exchange = rate?.rate || 0;
  const { ivaRate } = useSettings();

  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [salesLoading, setSalesLoading] = useState(true);
  const { products, movements, loading: inventoryLoading } = useInventory();
  const { history: auditHistory, loading: auditLoading } = useAudit();
  const { transactions, balance, totalSalesUSD, loading: financeLoading } = useFinance();

  // Para nota de crédito
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showCreditNote, setShowCreditNote] = useState(false);

  useEffect(() => {
    getAllSales()
      .then(setAllSales)
      .catch(console.error)
      .finally(() => setSalesLoading(false));
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      getAllSales().then(setAllSales).catch(console.error);
    };
    window.addEventListener('inventory-updated', handleUpdate);
    return () => window.removeEventListener('inventory-updated', handleUpdate);
  }, []);

  const isLoading = salesLoading || inventoryLoading || auditLoading || financeLoading;

  const handleDownload = () => {
    switch (activeTab) {
      case 'sales':
        generateSalesReport(allSales, exchange);
        break;
      case 'inventory':
        generateInventoryReport(products, movements, exchange);
        break;
      case 'audit':
        generateAuditReport(auditHistory, exchange);
        break;
      case 'finance':
        generateFinanceReport(transactions, balance, exchange, totalSalesUSD);
        break;
    }
  };

  const handleLowStockDownload = () => {
    generateLowStockReport(products, exchange);
  };

  const countData: Record<Tab, number> = {
    sales: allSales.length,
    inventory: products.length,
    audit: auditHistory.length,
    finance: transactions.length,
  };

  const handleCreditNoteSuccess = () => {
    getAllSales().then(setAllSales).catch(console.error);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Reportes</h1>
          <p className="text-text-secondary mt-1 text-sm md:text-base">Consolidado de toda la operación</p>
        </div>
        <button
          onClick={handleDownload}
          disabled={countData[activeTab] === 0 || isLoading}
          className="glass-card px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition disabled:opacity-40 flex items-center gap-2"
        >
          <Download size={16} />
          Descargar PDF
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-text-muted">
          <RefreshCw size={32} className="mx-auto mb-3 animate-spin" />
          <p>Cargando datos del reporte...</p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                  activeTab === id
                    ? 'bg-primary/20 border border-primary text-primary'
                    : 'bg-surface/30 border border-transparent text-text-secondary hover:border-border'
                }`}
              >
                <Icon size={16} />
                {label}
                <span className="text-xs opacity-60">({countData[id]})</span>
              </button>
            ))}
          </div>

          {activeTab === 'inventory' && (
            <button
              onClick={handleLowStockDownload}
              className="glass-card px-4 py-2 text-sm font-medium text-warning hover:bg-warning/10 transition flex items-center gap-2"
            >
              <AlertTriangle size={16} />
              Descargar reporte de stock bajo
            </button>
          )}

          <div className="glass-card p-4 md:p-6 overflow-x-auto">
            {activeTab === 'sales' && (
              <div>
                <h2 className="font-bold text-lg mb-3">Historial de Ventas</h2>
                {allSales.length === 0 ? (
                  <p className="text-text-muted text-sm">No hay ventas registradas.</p>
                ) : (
                  <table className="w-full text-xs md:text-sm">
                    <thead className="bg-surface/30">
                      <tr className="text-text-muted">
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-left p-2">Vendedor</th>
                        <th className="text-left p-2">Items</th>
                        <th className="text-right p-2">Total USD</th>
                        <th className="text-right p-2">Total Bs</th>
                        <th className="text-left p-2">Método</th>
                        <th className="text-center p-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allSales.map((sale) => (
                        <tr key={sale.id} className="border-b border-border/20">
                          <td className="p-2">{new Date(sale.createdAt).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}</td>
                          <td className="p-2">{sale.sellerName}</td>
                          <td className="p-2">{sale.items.length}</td>
                          <td className="p-2 text-right">${sale.totalUSD.toFixed(2)}</td>
                          <td className="p-2 text-right">Bs {sale.totalBS.toFixed(2)}</td>
                          <td className="p-2">{sale.paymentMethod}</td>
                          <td className="p-2">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => generateFiscalInvoice(sale, ivaRate)}
                                className="p-1 text-primary hover:bg-primary/10 rounded"
                                title="Factura fiscal"
                              >
                                <FileText size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedSale(sale);
                                  setShowCreditNote(true);
                                }}
                                className="p-1 text-warning hover:bg-warning/10 rounded"
                                title="Nota de crédito"
                              >
                                <RotateCcw size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'inventory' && (
              <div>
                <h2 className="font-bold text-lg mb-3">Estado del Inventario</h2>
                <table className="w-full text-xs md:text-sm">
                  <thead className="bg-surface/30">
                    <tr className="text-text-muted">
                      <th className="text-left p-2">Código</th>
                      <th className="text-left p-2">Producto</th>
                      <th className="text-left p-2">Categoría</th>
                      <th className="text-right p-2">Stock</th>
                      <th className="text-right p-2">Costo USD</th>
                      <th className="text-right p-2">Precio USD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-border/20">
                        <td className="p-2">{p.code}</td>
                        <td className="p-2">{p.name}</td>
                        <td className="p-2">{p.category}</td>
                        <td className="p-2 text-right">{p.stock}</td>
                        <td className="p-2 text-right">${p.costUSD.toFixed(2)}</td>
                        <td className="p-2 text-right">${p.priceUSD.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'audit' && (
              <div>
                <h2 className="font-bold text-lg mb-3">Registros de Auditoría</h2>
                {auditHistory.length === 0 ? (
                  <p className="text-text-muted text-sm">Sin auditorías realizadas.</p>
                ) : (
                  <table className="w-full text-xs md:text-sm">
                    <thead className="bg-surface/30">
                      <tr className="text-text-muted">
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-left p-2">Producto</th>
                        <th className="text-right p-2">Sistema</th>
                        <th className="text-right p-2">Físico</th>
                        <th className="text-right p-2">Dif.</th>
                        <th className="text-left p-2">Razón</th>
                        <th className="text-left p-2">Auditor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditHistory.map((r) => (
                        <tr key={r.id} className="border-b border-border/20">
                          <td className="p-2">{new Date(r.createdAt).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}</td>
                          <td className="p-2">{r.productName}</td>
                          <td className="p-2 text-right">{r.systemStock}</td>
                          <td className="p-2 text-right">{r.physicalStock}</td>
                          <td className="p-2 text-right">{r.difference}</td>
                          <td className="p-2">{r.reason}</td>
                          <td className="p-2">{r.auditorName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'finance' && (
              <div>
                <h2 className="font-bold text-lg mb-3">Transacciones Financieras</h2>
                {transactions.length === 0 ? (
                  <p className="text-text-muted text-sm">Sin transacciones registradas.</p>
                ) : (
                  <table className="w-full text-xs md:text-sm">
                    <thead className="bg-surface/30">
                      <tr className="text-text-muted">
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-left p-2">Descripción</th>
                        <th className="text-left p-2">Categoría</th>
                        <th className="text-left p-2">Tipo</th>
                        <th className="text-right p-2">Monto USD</th>
                        <th className="text-left p-2">Usuario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t.id} className="border-b border-border/20">
                          <td className="p-2">{new Date(t.createdAt).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}</td>
                          <td className="p-2">{t.description}</td>
                          <td className="p-2">{t.category}</td>
                          <td className={`p-2 font-medium ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                            {t.type === 'income' ? 'Ingreso' : 'Egreso'}
                          </td>
                          <td className="p-2 text-right">${t.amountUSD.toFixed(2)}</td>
                          <td className="p-2">{t.userName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {showCreditNote && selectedSale && (
        <CreditNoteModal
          sale={selectedSale}
          onClose={() => {
            setShowCreditNote(false);
            setSelectedSale(null);
          }}
          onSuccess={handleCreditNoteSuccess}
        />
      )}
    </motion.div>
  );
=======
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, ShoppingCart, PackageOpen, ClipboardCheck, DollarSign,
  Download, RefreshCw, AlertTriangle, RotateCcw,
} from 'lucide-react';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import { getAllSales } from '../../services/salesService';
import { useInventory } from '../../hooks/useInventory';
import { useAudit } from '../../hooks/useAudit';
import { useFinance } from '../../hooks/useFinance';
import {
  generateSalesReport,
  generateInventoryReport,
  generateAuditReport,
  generateFinanceReport,
  generateLowStockReport,
} from '../../utils/pdfGenerator';
import { generateFiscalInvoice } from '../../utils/fiscalInvoice';
import { useSettings } from '../../context/SettingsContext';
import CreditNoteModal from '../CreditNote/CreditNoteModal';
import { Sale } from '../../types';

type Tab = 'sales' | 'inventory' | 'audit' | 'finance';

const tabs: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: 'sales', label: 'Ventas', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventario', icon: PackageOpen },
  { id: 'audit', label: 'Auditoría', icon: ClipboardCheck },
  { id: 'finance', label: 'Finanzas', icon: DollarSign },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState<Tab>('sales');
  const { rate } = useExchangeRate();
  const exchange = rate?.rate || 0;
  const { ivaRate } = useSettings();

  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [salesLoading, setSalesLoading] = useState(true);
  const { products, movements, loading: inventoryLoading } = useInventory();
  const { history: auditHistory, loading: auditLoading } = useAudit();
  const { transactions, balance, totalSalesUSD, loading: financeLoading } = useFinance();

  // Para nota de crédito
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showCreditNote, setShowCreditNote] = useState(false);

  useEffect(() => {
    getAllSales()
      .then(setAllSales)
      .catch(console.error)
      .finally(() => setSalesLoading(false));
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      getAllSales().then(setAllSales).catch(console.error);
    };
    window.addEventListener('inventory-updated', handleUpdate);
    return () => window.removeEventListener('inventory-updated', handleUpdate);
  }, []);

  const isLoading = salesLoading || inventoryLoading || auditLoading || financeLoading;

  const handleDownload = () => {
    switch (activeTab) {
      case 'sales':
        generateSalesReport(allSales, exchange);
        break;
      case 'inventory':
        generateInventoryReport(products, movements, exchange);
        break;
      case 'audit':
        generateAuditReport(auditHistory, exchange);
        break;
      case 'finance':
        generateFinanceReport(transactions, balance, exchange, totalSalesUSD);
        break;
    }
  };

  const handleLowStockDownload = () => {
    generateLowStockReport(products, exchange);
  };

  const countData: Record<Tab, number> = {
    sales: allSales.length,
    inventory: products.length,
    audit: auditHistory.length,
    finance: transactions.length,
  };

  const handleCreditNoteSuccess = () => {
    getAllSales().then(setAllSales).catch(console.error);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Reportes</h1>
          <p className="text-text-secondary mt-1 text-sm md:text-base">Consolidado de toda la operación</p>
        </div>
        <button
          onClick={handleDownload}
          disabled={countData[activeTab] === 0 || isLoading}
          className="glass-card px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition disabled:opacity-40 flex items-center gap-2"
        >
          <Download size={16} />
          Descargar PDF
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-text-muted">
          <RefreshCw size={32} className="mx-auto mb-3 animate-spin" />
          <p>Cargando datos del reporte...</p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                  activeTab === id
                    ? 'bg-primary/20 border border-primary text-primary'
                    : 'bg-surface/30 border border-transparent text-text-secondary hover:border-border'
                }`}
              >
                <Icon size={16} />
                {label}
                <span className="text-xs opacity-60">({countData[id]})</span>
              </button>
            ))}
          </div>

          {activeTab === 'inventory' && (
            <button
              onClick={handleLowStockDownload}
              className="glass-card px-4 py-2 text-sm font-medium text-warning hover:bg-warning/10 transition flex items-center gap-2"
            >
              <AlertTriangle size={16} />
              Descargar reporte de stock bajo
            </button>
          )}

          <div className="glass-card p-4 md:p-6 overflow-x-auto">
            {activeTab === 'sales' && (
              <div>
                <h2 className="font-bold text-lg mb-3">Historial de Ventas</h2>
                {allSales.length === 0 ? (
                  <p className="text-text-muted text-sm">No hay ventas registradas.</p>
                ) : (
                  <table className="w-full text-xs md:text-sm">
                    <thead className="bg-surface/30">
                      <tr className="text-text-muted">
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-left p-2">Vendedor</th>
                        <th className="text-left p-2">Items</th>
                        <th className="text-right p-2">Total USD</th>
                        <th className="text-right p-2">Total Bs</th>
                        <th className="text-left p-2">Método</th>
                        <th className="text-center p-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allSales.map((sale) => (
                        <tr key={sale.id} className="border-b border-border/20">
                          <td className="p-2">{new Date(sale.createdAt).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}</td>
                          <td className="p-2">{sale.sellerName}</td>
                          <td className="p-2">{sale.items.length}</td>
                          <td className="p-2 text-right">${sale.totalUSD.toFixed(2)}</td>
                          <td className="p-2 text-right">Bs {sale.totalBS.toFixed(2)}</td>
                          <td className="p-2">{sale.paymentMethod}</td>
                          <td className="p-2">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => generateFiscalInvoice(sale, ivaRate)}
                                className="p-1 text-primary hover:bg-primary/10 rounded"
                                title="Factura fiscal"
                              >
                                <FileText size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedSale(sale);
                                  setShowCreditNote(true);
                                }}
                                className="p-1 text-warning hover:bg-warning/10 rounded"
                                title="Nota de crédito"
                              >
                                <RotateCcw size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'inventory' && (
              <div>
                <h2 className="font-bold text-lg mb-3">Estado del Inventario</h2>
                <table className="w-full text-xs md:text-sm">
                  <thead className="bg-surface/30">
                    <tr className="text-text-muted">
                      <th className="text-left p-2">Código</th>
                      <th className="text-left p-2">Producto</th>
                      <th className="text-left p-2">Categoría</th>
                      <th className="text-right p-2">Stock</th>
                      <th className="text-right p-2">Costo USD</th>
                      <th className="text-right p-2">Precio USD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-border/20">
                        <td className="p-2">{p.code}</td>
                        <td className="p-2">{p.name}</td>
                        <td className="p-2">{p.category}</td>
                        <td className="p-2 text-right">{p.stock}</td>
                        <td className="p-2 text-right">${p.costUSD.toFixed(2)}</td>
                        <td className="p-2 text-right">${p.priceUSD.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'audit' && (
              <div>
                <h2 className="font-bold text-lg mb-3">Registros de Auditoría</h2>
                {auditHistory.length === 0 ? (
                  <p className="text-text-muted text-sm">Sin auditorías realizadas.</p>
                ) : (
                  <table className="w-full text-xs md:text-sm">
                    <thead className="bg-surface/30">
                      <tr className="text-text-muted">
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-left p-2">Producto</th>
                        <th className="text-right p-2">Sistema</th>
                        <th className="text-right p-2">Físico</th>
                        <th className="text-right p-2">Dif.</th>
                        <th className="text-left p-2">Razón</th>
                        <th className="text-left p-2">Auditor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditHistory.map((r) => (
                        <tr key={r.id} className="border-b border-border/20">
                          <td className="p-2">{new Date(r.createdAt).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}</td>
                          <td className="p-2">{r.productName}</td>
                          <td className="p-2 text-right">{r.systemStock}</td>
                          <td className="p-2 text-right">{r.physicalStock}</td>
                          <td className="p-2 text-right">{r.difference}</td>
                          <td className="p-2">{r.reason}</td>
                          <td className="p-2">{r.auditorName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'finance' && (
              <div>
                <h2 className="font-bold text-lg mb-3">Transacciones Financieras</h2>
                {transactions.length === 0 ? (
                  <p className="text-text-muted text-sm">Sin transacciones registradas.</p>
                ) : (
                  <table className="w-full text-xs md:text-sm">
                    <thead className="bg-surface/30">
                      <tr className="text-text-muted">
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-left p-2">Descripción</th>
                        <th className="text-left p-2">Categoría</th>
                        <th className="text-left p-2">Tipo</th>
                        <th className="text-right p-2">Monto USD</th>
                        <th className="text-left p-2">Usuario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t.id} className="border-b border-border/20">
                          <td className="p-2">{new Date(t.createdAt).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}</td>
                          <td className="p-2">{t.description}</td>
                          <td className="p-2">{t.category}</td>
                          <td className={`p-2 font-medium ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                            {t.type === 'income' ? 'Ingreso' : 'Egreso'}
                          </td>
                          <td className="p-2 text-right">${t.amountUSD.toFixed(2)}</td>
                          <td className="p-2">{t.userName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {showCreditNote && selectedSale && (
        <CreditNoteModal
          sale={selectedSale}
          onClose={() => {
            setShowCreditNote(false);
            setSelectedSale(null);
          }}
          onSuccess={handleCreditNoteSuccess}
        />
      )}
    </motion.div>
  );
>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
}