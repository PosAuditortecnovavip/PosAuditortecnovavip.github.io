import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Sale, Transaction, Product, InventoryMovement, AuditRecord } from '../types';

// ===================== TICKET DE VENTA (original, con IVA) =====================
export const generateTicket = (sale: Sale): void => {
  const doc = new jsPDF({ unit: 'mm', format: [80, 150] });
  const pageWidth = 80;
  let y = 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Tecnova VIP', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Audity Pro · Sistema de Auditoría', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text('Ticket de Venta', pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFontSize(6);
  doc.text(`Fecha: ${new Date(sale.createdAt).toLocaleString('es-VE')}`, 5, y);
  y += 3;
  doc.text(`Vendedor: ${sale.sellerName}`, 5, y);
  y += 3;
  doc.text(`Método: ${formatPaymentMethod(sale.paymentMethod)}`, 5, y);
  y += 3;
  doc.text(`Tasa BCV: ${sale.exchangeRate.toFixed(2)} Bs/USD`, 5, y);
  y += 5;

  doc.line(5, y, pageWidth - 5, y); y += 4;
  doc.setFont('helvetica', 'bold');
  doc.text('Producto', 5, y); doc.text('Cant', 40, y); doc.text('Precio', 55, y); doc.text('Subtotal', 70, y, { align: 'right' });
  y += 3;
  doc.line(5, y, pageWidth - 5, y); y += 3;

  doc.setFont('helvetica', 'normal');
  for (const item of sale.items) {
    if (y > 130) { doc.addPage(); y = 10; }
    doc.text(item.productName.substring(0, 18), 5, y);
    doc.text(item.quantity.toString(), 40, y);
    doc.text(`$${item.priceUSD.toFixed(2)}`, 55, y);
    doc.text(`$${item.subtotalUSD.toFixed(2)}`, pageWidth - 5, y, { align: 'right' });
    y += 4;
  }

  y += 2; doc.line(5, y, pageWidth - 5, y); y += 4;
  doc.setFont('helvetica', 'bold');
  doc.text('Total USD:', 5, y); doc.text(`$${sale.totalUSD.toFixed(2)}`, pageWidth - 5, y, { align: 'right' });
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.text('Total Bs:', 5, y); doc.text(`Bs ${sale.totalBS.toFixed(2)}`, pageWidth - 5, y, { align: 'right' });
  y += 6; doc.line(5, y, pageWidth - 5, y); y += 4;
  doc.setFontSize(6);
  doc.text('Gracias por su compra', pageWidth / 2, y, { align: 'center' });
  doc.save(`ticket_${sale.id}.pdf`);
};

const formatPaymentMethod = (method: Sale['paymentMethod']): string => {
  const m: Record<Sale['paymentMethod'], string> = {
    cash_usd: 'Efectivo USD', cash_bs: 'Efectivo Bs', transfer_bs: 'Transferencia Bs', transfer_usd: 'Transferencia USD', mixed: 'Mixto',
  };
  return m[method];
};

// ===================== RECIBO SIMPLIFICADO (USD, sin IVA) =====================
export const generateSimpleReceipt = (sale: Sale): void => {
  const doc = new jsPDF({ unit: 'mm', format: [80, 100] });
  const pageWidth = 80;
  let y = 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Tecnova VIP', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Audity Pro · Recibo simplificado', pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFontSize(6);
  doc.text(`Fecha: ${new Date(sale.createdAt).toLocaleString('es-VE')}`, 5, y);
  y += 3;
  doc.text(`Vendedor: ${sale.sellerName}`, 5, y);
  y += 4;

  doc.line(5, y, pageWidth - 5, y); y += 4;
  doc.setFont('helvetica', 'bold');
  doc.text('Producto', 5, y);
  doc.text('Cant', 32, y);
  doc.text('Precio USD', 50, y);
  doc.text('Subtotal', 70, y, { align: 'right' });
  y += 3;
  doc.line(5, y, pageWidth - 5, y); y += 3;

  doc.setFont('helvetica', 'normal');
  for (const item of sale.items) {
    if (y > 90) { doc.addPage(); y = 10; }
    doc.text(item.productName.substring(0, 14), 5, y);
    doc.text(item.quantity.toString(), 32, y);
    doc.text(`$${item.priceUSD.toFixed(2)}`, 50, y);
    doc.text(`$${item.subtotalUSD.toFixed(2)}`, pageWidth - 5, y, { align: 'right' });
    y += 4;
  }

  y += 2; doc.line(5, y, pageWidth - 5, y); y += 4;
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL USD:', 5, y);
  doc.text(`$${sale.totalUSD.toFixed(2)}`, pageWidth - 5, y, { align: 'right' });

  y += 6; doc.line(5, y, pageWidth - 5, y); y += 4;
  doc.setFontSize(6);
  doc.text('Gracias por su compra', pageWidth / 2, y, { align: 'center' });

  doc.save(`recibo_${sale.id}.pdf`);
};

// ===================== RECIBO PARA FINANZAS =====================
export const generateReceipt = (transaction: Transaction, exchangeRate: number): void => {
  const doc = new jsPDF({ unit: 'mm', format: [80, 120] });
  const pageWidth = 80; let y = 10;
  doc.setFontSize(10); doc.setFont('helvetica', 'bold');
  doc.text('Tecnova VIP', pageWidth / 2, y, { align: 'center' }); y += 5;
  doc.setFontSize(7); doc.setFont('helvetica', 'normal');
  doc.text('Audity Pro · Módulo de Finanzas', pageWidth / 2, y, { align: 'center' }); y += 5;
  doc.setFontSize(6);
  doc.text(`Fecha: ${new Date(transaction.createdAt).toLocaleString('es-VE')}`, 5, y); y += 3;
  doc.text(`Descripción: ${transaction.description}`, 5, y); y += 3;
  doc.text(`Categoría: ${transaction.category}`, 5, y); y += 3;
  doc.text(`Monto: $${transaction.amountUSD.toFixed(2)}`, 5, y); y += 3;
  doc.text(`Equivalente: Bs ${(transaction.amountUSD * exchangeRate).toFixed(2)}`, 5, y); y += 3;
  doc.text(`Registrado por: ${transaction.userName}`, 5, y); y += 5;
  doc.line(5, y, pageWidth - 5, y); y += 4;
  doc.setFontSize(6);
  doc.text('Tecnova VIP - Audity Pro', pageWidth / 2, y, { align: 'center' });
  doc.save(`recibo_${transaction.id}.pdf`);
};

// ===================== REPORTES =====================
export const generateFinanceReport = (
  transactions: Transaction[],
  balance: number,
  exchangeRate: number,
  totalSalesUSD: number
): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth(); let y = 15;
  doc.setFontSize(16); doc.setFont('helvetica', 'bold');
  doc.text('Tecnova VIP - Reporte Financiero', pageWidth / 2, y, { align: 'center' }); y += 8;
  doc.setFontSize(10); doc.setFont('helvetica', 'normal');
  doc.text('Audity Pro', pageWidth / 2, y, { align: 'center' }); y += 6;
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-VE')}`, 14, y);
  doc.text(`Tasa BCV: ${exchangeRate.toFixed(2)} Bs/USD`, pageWidth - 14, y, { align: 'right' }); y += 6;
  doc.setFontSize(12); doc.setFont('helvetica', 'bold');
  doc.text(`Ingresos totales (ventas): $${totalSalesUSD.toFixed(2)}`, 14, y); y += 6;
  doc.text(`Egresos totales: $${transactions.reduce((s, t) => s + t.amountUSD, 0).toFixed(2)}`, 14, y); y += 6;
  doc.text(`Balance: $${balance.toFixed(2)} / Bs ${(balance * exchangeRate).toFixed(2)}`, 14, y); y += 8;

  (doc as any).autoTable({
    startY: y,
    head: [['Fecha', 'Descripción', 'Categoría', 'Monto USD', 'Monto Bs']],
    body: transactions.map(t => [
      new Date(t.createdAt).toLocaleDateString('es-VE'),
      t.description,
      t.category,
      `$${t.amountUSD.toFixed(2)}`,
      `Bs ${(t.amountUSD * exchangeRate).toFixed(2)}`
    ]),
    styles: { fontSize: 8 },
  });
  doc.save('reporte_financiero.pdf');
};

export const generateSalesReport = (sales: Sale[], exchangeRate: number): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth(); let y = 15;
  doc.setFontSize(16); doc.setFont('helvetica', 'bold');
  doc.text('Tecnova VIP - Reporte de Ventas', pageWidth / 2, y, { align: 'center' }); y += 8;
  doc.setFontSize(10); doc.setFont('helvetica', 'normal');
  doc.text('Audity Pro', pageWidth / 2, y, { align: 'center' }); y += 6;
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-VE')} | Tasa BCV: ${exchangeRate.toFixed(2)} Bs/USD`, 14, y); y += 8;
  const totalUSD = sales.reduce((s, sale) => s + sale.totalUSD, 0);
  doc.setFontSize(12); doc.setFont('helvetica', 'bold');
  doc.text(`Total vendido: $${totalUSD.toFixed(2)} / Bs ${(totalUSD * exchangeRate).toFixed(2)}`, 14, y); y += 6;
  (doc as any).autoTable({
    startY: y,
    head: [['Fecha', 'Vendedor', 'Items', 'Total USD', 'Total Bs', 'Método']],
    body: sales.map(s => [
      new Date(s.createdAt).toLocaleString('es-VE'),
      s.sellerName,
      s.items.length,
      `$${s.totalUSD.toFixed(2)}`,
      `Bs ${s.totalBS.toFixed(2)}`,
      formatPaymentMethod(s.paymentMethod),
    ]),
    styles: { fontSize: 8 },
  });
  doc.save('reporte_ventas.pdf');
};

export const generateInventoryReport = (products: Product[], movements: InventoryMovement[], exchangeRate: number): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth(); let y = 15;
  doc.setFontSize(16); doc.setFont('helvetica', 'bold');
  doc.text('Tecnova VIP - Reporte de Inventario', pageWidth / 2, y, { align: 'center' }); y += 8;
  doc.setFontSize(10); doc.setFont('helvetica', 'normal');
  doc.text('Audity Pro', pageWidth / 2, y, { align: 'center' }); y += 6;
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-VE')} | Tasa BCV: ${exchangeRate.toFixed(2)} Bs/USD`, 14, y); y += 8;
  doc.setFontSize(12); doc.setFont('helvetica', 'bold');
  doc.text('Productos', 14, y); y += 6;
  (doc as any).autoTable({
    startY: y,
    head: [['Código', 'Nombre', 'Categoría', 'Stock', 'Costo USD', 'Precio USD', 'Valor costo']],
    body: products.map(p => [
      p.code, p.name, p.category, p.stock,
      `$${p.costUSD.toFixed(2)}`, `$${p.priceUSD.toFixed(2)}`,
      `$${(p.costUSD * p.stock).toFixed(2)}`
    ]),
    styles: { fontSize: 7 },
  });
  y = (doc as any).lastAutoTable.finalY + 8;
  doc.setFontSize(12); doc.setFont('helvetica', 'bold');
  doc.text('Últimos movimientos', 14, y); y += 6;
  (doc as any).autoTable({
    startY: y,
    head: [['Fecha', 'Producto', 'Tipo', 'Cantidad', 'Motivo', 'Usuario']],
    body: movements.slice(0, 30).map(m => [
      new Date(m.createdAt).toLocaleString('es-VE'),
      m.productName,
      m.type === 'entry' ? 'Entrada' : m.type === 'exit' ? 'Salida' : 'Ajuste',
      m.quantity,
      m.reason,
      m.userName,
    ]),
    styles: { fontSize: 7 },
  });
  doc.save('reporte_inventario.pdf');
};

export const generateAuditReport = (records: AuditRecord[], exchangeRate: number): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth(); let y = 15;
  doc.setFontSize(16); doc.setFont('helvetica', 'bold');
  doc.text('Tecnova VIP - Reporte de Auditorías', pageWidth / 2, y, { align: 'center' }); y += 8;
  doc.setFontSize(10); doc.setFont('helvetica', 'normal');
  doc.text('Audity Pro', pageWidth / 2, y, { align: 'center' }); y += 6;
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-VE')} | Tasa BCV: ${exchangeRate.toFixed(2)} Bs/USD`, 14, y); y += 8;
  (doc as any).autoTable({
    startY: y,
    head: [['Fecha', 'Producto', 'Stock Sistema', 'Stock Físico', 'Diferencia', 'Razón', 'Auditor']],
    body: records.map(r => [
      new Date(r.createdAt).toLocaleString('es-VE'),
      r.productName,
      r.systemStock,
      r.physicalStock,
      r.difference > 0 ? `+${r.difference}` : r.difference,
      r.reason,
      r.auditorName,
    ]),
    styles: { fontSize: 7 },
  });
  doc.save('reporte_auditoria.pdf');
};

// ===================== REPORTE DE STOCK BAJO =====================
export const generateLowStockReport = (products: Product[], exchangeRate: number): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Tecnova VIP - Stock Bajo', pageWidth / 2, y, { align: 'center' });
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Audity Pro', pageWidth / 2, y, { align: 'center' });
  y += 6;
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-VE')} | Tasa BCV: ${exchangeRate.toFixed(2)} Bs/USD`, 14, y);
  y += 8;

  const lowStockProducts = products.filter((p) => p.stock <= p.minStock || p.stock === 0);

  (doc as any).autoTable({
    startY: y,
    head: [['Código', 'Nombre', 'Categoría', 'Stock', 'Stock Mínimo', 'Precio USD']],
    body: lowStockProducts.map((p) => [
      p.code,
      p.name,
      p.category,
      p.stock,
      p.minStock,
      `$${p.priceUSD.toFixed(2)}`,
    ]),
    styles: { fontSize: 8 },
  });

  doc.save('reporte_stock_bajo.pdf');
};