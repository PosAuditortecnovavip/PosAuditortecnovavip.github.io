import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  ShoppingCart,
  PackageOpen,
  ClipboardCheck,
  DollarSign,
  Download,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  History,
} from 'lucide-react';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import { getAllSales } from '../../services/salesService'; // Servicio online
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
import { getAllProductLogs, ProductLogEntry } from '../../services/productLogService';

type Tab = 'sales' | 'inventory' | 'audit' | 'finance' | 'productLogs';

const tabs: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: 'sales', label: 'Ventas', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventario', icon: PackageOpen },
  { id: 'audit', label: 'Auditoría', icon: ClipboardCheck },
  { id: 'finance', label: 'Finanzas', icon: DollarSign },
  { id: 'productLogs', label: 'Registro de Productos', icon: History },
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
  const [productLogs, setProductLogs] = useState<ProductLogEntry[]>([]);

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showCreditNote, setShowCreditNote] = useState(false);

  useEffect(() => {
    getAllSales()
      .then(setAllSales)
      .catch(console.error)
      .finally(() => setSalesLoading(false));

    getAllProductLogs()
      .then(setProductLogs)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      getAllSales().then(setAllSales).catch(console.error);
      getAllProductLogs().then(setProductLogs).catch(console.error);
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
      default:
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
    productLogs: productLogs.length,
  };

  const handleCreditNoteSuccess = () => {
    getAllSales().then(setAllSales).catch(console.error);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 md:space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Reportes</h1>
          <p className="text-text-secondary mt-1 text-sm md:text-base">
            Consolidado de toda la operación
          </p>
        </div>
        <button
          onClick={handleDownload}
          disabled={countData[activeTab] === 0 || isLoading || activeTab === 'productLogs'}
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
                  <table className="w-full text-xs md:text-sm min-w-[700px]">
                    <thead className="bg-surface/30">
                      <tr className="text-text-muted">
                        <th className="text-left p-2 md:p-3">Fecha</th>
                        <th className="text-left p-2 md:p-3">Vendedor</th>
                        <th className="text-left p-2 md:p-3">Items</th>
                        <th className="text-right p-2 md:p-3">Total USD</th>
                        <th className="text-right p-2 md:p-3">Total Bs</th>
                        <th className="text-left p-2 md:p-3">Método</th>
                        <th className="text-center p-2 md:p-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allSales.map((sale) => (
                        <tr key={sale.id} className="border-b border-border/20">
                          <td className="p-2 md:p-3">
                            {new Date(sale.createdAt).toLocaleString('es-VE', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </td>
                          <td className="p-2 md:p-3">{sale.sellerName}</td>
                          <td className="p-2 md:p-3">{sale.items.length}</td>
                          <td className="p-2 md:p-3 text-right">${sale.totalUSD.toFixed(2)}</td>
                          <td className="p-2 md:p-3 text-right">Bs {sale.totalBS.toFixed(2)}</td>
                          <td className="p-2 md:p-3">{sale.paymentMethod}</td>
                          <td className="p-2 md:p-3">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => generateFiscalInvoice(sale, ivaRate)}
                                className="inline-flex items-center gap-1 p-2 md:p-2.5 rounded-lg text-primary hover:bg-primary/10 transition"
                                title="Generar factura fiscal"
                              >
                                <FileText size={16} />
                                <span className="hidden md:inline text-xs md:text-sm">Factura fiscal</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedSale(sale);
                                  setShowCreditNote(true);
                                }}
                                className="inline-flex items-center gap-1 p-2 md:p-2.5 rounded-lg text-warning hover:bg-warning/10 transition"
                                title="Emitir nota de crédito"
                              >
                                <RotateCcw size={16} />
                                <span className="hidden md:inline text-xs md:text-sm">Nota de crédito</span>
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
                <table className="w-full text-xs md:text-sm min-w-[700px]">
                  <thead className="bg-surface/30">
                    <tr className="text-text-muted">
                      <th className="text-left p-2 md:p-3">Código</th>
                      <th className="text-left p-2 md:p-3">Producto</th>
                      <th className="text-left p-2 md:p-3">Categoría</th>
                      <th className="text-right p-2 md:p-3">Stock</th>
                      <th className="text-right p-2 md:p-3">Costo USD</th>
                      <th className="text-right p-2 md:p-3">Precio USD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-border/20">
                        <td className="p-2 md:p-3">{p.code}</td>
                        <td className="p-2 md:p-3">{p.name}</td>
                        <td className="p-2 md:p-3">{p.category}</td>
                        <td className="p-2 md:p-3 text-right">{p.stock}</td>
                        <td className="p-2 md:p-3 text-right">${p.costUSD.toFixed(2)}</td>
                        <td className="p-2 md:p-3 text-right">${p.priceUSD.toFixed(2)}</td>
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
                  <table className="w-full text-xs md:text-sm min-w-[700px]">
                    <thead className="bg-surface/30">
                      <tr className="text-text-muted">
                        <th className="text-left p-2 md:p-3">Fecha</th>
                        <th className="text-left p-2 md:p-3">Producto</th>
                        <th className="text-right p-2 md:p-3">Sistema</th>
                        <th className="text-right p-2 md:p-3">Físico</th>
                        <th className="text-right p-2 md:p-3">Dif.</th>
                        <th className="text-left p-2 md:p-3">Razón</th>
                        <th className="text-left p-2 md:p-3">Auditor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditHistory.map((r) => (
                        <tr key={r.id} className="border-b border-border/20">
                          <td className="p-2 md:p-3">
                            {new Date(r.createdAt).toLocaleString('es-VE', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </td>
                          <td className="p-2 md:p-3">{r.productName}</td>
                          <td className="p-2 md:p-3 text-right">{r.systemStock}</td>
                          <td className="p-2 md:p-3 text-right">{r.physicalStock}</td>
                          <td className="p-2 md:p-3 text-right">{r.difference}</td>
                          <td className="p-2 md:p-3">{r.reason}</td>
                          <td className="p-2 md:p-3">{r.auditorName}</td>
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
                  <table className="w-full text-xs md:text-sm min-w-[700px]">
                    <thead className="bg-surface/30">
                      <tr className="text-text-muted">
                        <th className="text-left p-2 md:p-3">Fecha</th>
                        <th className="text-left p-2 md:p-3">Descripción</th>
                        <th className="text-left p-2 md:p-3">Categoría</th>
                        <th className="text-left p-2 md:p-3">Tipo</th>
                        <th className="text-right p-2 md:p-3">Monto USD</th>
                        <th className="text-left p-2 md:p-3">Usuario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t.id} className="border-b border-border/20">
                          <td className="p-2 md:p-3">
                            {new Date(t.createdAt).toLocaleString('es-VE', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </td>
                          <td className="p-2 md:p-3">{t.description}</td>
                          <td className="p-2 md:p-3">{t.category}</td>
                          <td className={`p-2 md:p-3 font-medium ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                            {t.type === 'income' ? 'Ingreso' : 'Egreso'}
                          </td>
                          <td className="p-2 md:p-3 text-right">${t.amountUSD.toFixed(2)}</td>
                          <td className="p-2 md:p-3">{t.userName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'productLogs' && (
              <div>
                <h2 className="font-bold text-lg mb-3">Registro de Productos</h2>
                {productLogs.length === 0 ? (
                  <p className="text-text-muted text-sm">No hay registros de productos.</p>
                ) : (
                  <table className="w-full text-xs md:text-sm min-w-[700px]">
                    <thead className="bg-surface/30">
                      <tr className="text-text-muted">
                        <th className="text-left p-2 md:p-3">Fecha / Hora</th>
                        <th className="text-left p-2 md:p-3">Usuario</th>
                        <th className="text-left p-2 md:p-3">Acción</th>
                        <th className="text-left p-2 md:p-3">Producto</th>
                        <th className="text-left p-2 md:p-3">Código</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productLogs.map((log) => (
                        <tr key={log.id} className="border-b border-border/20">
                          <td className="p-2 md:p-3">
                            {new Date(log.timestamp).toLocaleString('es-VE', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </td>
                          <td className="p-2 md:p-3">{log.userName}</td>
                          <td className="p-2 md:p-3">
                            <span className={log.action === 'created' ? 'text-success' : 'text-danger'}>
                              {log.action === 'created' ? 'Creación' : 'Eliminación'}
                            </span>
                          </td>
                          <td className="p-2 md:p-3">{log.productName}</td>
                          <td className="p-2 md:p-3">{log.productCode}</td>
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
}