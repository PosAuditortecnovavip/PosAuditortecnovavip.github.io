import * as XLSX from 'xlsx';
import { Sale, Product, InventoryMovement, AuditRecord, Transaction, Customer, User, Purchase, ProductLogEntry } from '../types';

const BRAND = 'Tecnova VIP';
const makeSheet = (data: any[]) => XLSX.utils.json_to_sheet(data);

export const exportSalesExcel = (sales: Sale[]): void => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, makeSheet(sales.map(s => ({
    Fecha: new Date(s.createdAt).toLocaleString('es-VE'), Vendedor: s.sellerName, Items: s.items.length,
    'Total USD': s.totalUSD.toFixed(2), 'Total Bs': s.totalBS.toFixed(2), 'Tasa BCV': s.exchangeRate.toFixed(2), 'Método': s.paymentMethod,
  }))), 'Ventas');
  XLSX.writeFile(wb, `${BRAND}_Ventas_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportInventoryExcel = (products: Product[]): void => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, makeSheet(products.map(p => ({
    Código: p.code, Producto: p.name, Categoría: p.category, Stock: p.stock, 'Stock Mínimo': p.minStock,
    'Costo USD': p.costUSD.toFixed(2), 'Precio USD': p.priceUSD.toFixed(2), 'Valor Costo': (p.costUSD * p.stock).toFixed(2),
  }))), 'Inventario');
  XLSX.writeFile(wb, `${BRAND}_Inventario_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportAuditExcel = (records: AuditRecord[]): void => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, makeSheet(records.map(r => ({
    Fecha: new Date(r.createdAt).toLocaleString('es-VE'), Producto: r.productName,
    'Stock Sistema': r.systemStock, 'Stock Físico': r.physicalStock, Diferencia: r.difference,
    Razón: r.reason, Auditor: r.auditorName,
  }))), 'Auditoría');
  XLSX.writeFile(wb, `${BRAND}_Auditoria_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportFinanceExcel = (transactions: Transaction[]): void => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, makeSheet(transactions.map(t => ({
    Fecha: new Date(t.createdAt).toLocaleString('es-VE'), Descripción: t.description, Categoría: t.category,
    Tipo: t.type === 'income' ? 'Ingreso' : 'Egreso', 'Monto USD': t.amountUSD.toFixed(2), Usuario: t.userName,
  }))), 'Finanzas');
  XLSX.writeFile(wb, `${BRAND}_Finanzas_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportMovementsExcel = (movements: InventoryMovement[]): void => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, makeSheet(movements.map(m => ({
    Fecha: new Date(m.createdAt).toLocaleString('es-VE'), Producto: m.productName,
    Tipo: m.type, Origen: m.origin, Cantidad: m.quantity, Motivo: m.reason, Usuario: m.userName,
  }))), 'Movimientos');
  XLSX.writeFile(wb, `${BRAND}_Movimientos_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportLowStockExcel = (products: Product[]): void => {
  const wb = XLSX.utils.book_new();
  const lowStock = products.filter((p) => p.stock <= p.minStock || p.stock === 0);
  XLSX.utils.book_append_sheet(wb, makeSheet(lowStock.map((p) => ({
    Código: p.code, Producto: p.name, Categoría: p.category, Stock: p.stock,
    'Stock Mínimo': p.minStock, 'Precio USD': p.priceUSD.toFixed(2),
  }))), 'StockBajo');
  XLSX.writeFile(wb, `${BRAND}_StockBajo_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportProductLogsExcel = (logs: ProductLogEntry[]): void => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, makeSheet(logs.map(log => ({
    Fecha: new Date(log.timestamp).toLocaleString('es-VE'), Usuario: log.userName,
    Acción: log.action === 'created' ? 'Creación' : 'Eliminación', Producto: log.productName, Código: log.productCode,
  }))), 'RegistroProductos');
  XLSX.writeFile(wb, `${BRAND}_RegistroProductos_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportCustomersExcel = (customers: Customer[]): void => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, makeSheet(customers.map(c => ({
    Nombre: c.name, Teléfono: c.phone, Email: c.email, 'Fecha Registro': new Date(c.createdAt).toLocaleString('es-VE'),
  }))), 'Clientes');
  XLSX.writeFile(wb, `${BRAND}_Clientes_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportUsersExcel = (users: User[]): void => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, makeSheet(users.map(u => ({
    Email: u.email, Nombre: u.name, Rol: u.role, Estado: u.active === false ? 'Inactivo' : 'Activo',
  }))), 'Usuarios');
  XLSX.writeFile(wb, `${BRAND}_Usuarios_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

// 👇 ESTA ES LA FUNCIÓN ÚNICA Y CORREGIDA DE COMPRAS EN EXCEL 👇
export const exportPurchasesExcel = (purchases: Purchase[]): void => {
  const wb = XLSX.utils.book_new();
  const rows = purchases.flatMap((p) =>
    p.items.map((it) => ({
      Fecha: new Date(p.createdAt).toLocaleString('es-VE'),
      Proveedor: p.supplier,
      Producto: it.productName,
      Código: it.productCode,
      Cantidad: it.quantity,
      'Costo Unit. USD': it.unitCostUSD.toFixed(2),
      'Subtotal USD': it.subtotalUSD.toFixed(2),
      Usuario: p.userName,
    }))
  );
  XLSX.utils.book_append_sheet(wb, makeSheet(rows), 'Compras');
  XLSX.writeFile(wb, `${BRAND}_Compras_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
