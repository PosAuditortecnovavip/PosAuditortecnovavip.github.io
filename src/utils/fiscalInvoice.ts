<<<<<<< HEAD
import jsPDF from 'jspdf';
import { Sale } from '../types';
import { getNextInvoiceNumber } from '../services/invoiceNumberService';

export const generateFiscalInvoice = async (sale: Sale, ivaRate: number): Promise<void> => {
  const exchangeRate = sale.exchangeRate;
  const doc = new jsPDF({ unit: 'mm', format: [80, 180] });
  const pageWidth = 80;
  let y = 10;

  // Obtener número de factura
  const invoiceNumber = await getNextInvoiceNumber();

  // Encabezado
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Audity Pro', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('RIF: J-12345678-9', pageWidth / 2, y, { align: 'center' });
  y += 3;
  doc.text('Sistema de Auditoría de Inventarios', pageWidth / 2, y, { align: 'center' });
  y += 4;

  // Número de factura
  doc.setFont('helvetica', 'bold');
  doc.text(`No. Factura: ${invoiceNumber}`, pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text(`Fecha: ${new Date(sale.createdAt).toLocaleString('es-VE')}`, 5, y);
  y += 3;
  doc.text(`Vendedor: ${sale.sellerName}`, 5, y);
  y += 3;
  doc.text(`Cliente: ${sale.customerName || 'Cliente General'}`, 5, y);
  y += 3;
  doc.text(`Método: ${formatPaymentMethod(sale.paymentMethod)}`, 5, y);
  y += 3;
  doc.text(`Tasa BCV: ${exchangeRate.toFixed(2)} Bs/USD`, 5, y);
  y += 5;

  // Línea divisoria
  doc.line(5, y, pageWidth - 5, y); y += 4;

  // Encabezado de tabla
  doc.setFont('helvetica', 'bold');
  doc.text('Producto', 5, y);
  doc.text('Cant', 32, y);
  doc.text('Precio Bs', 50, y);
  doc.text('Subtotal', 70, y, { align: 'right' });
  y += 3;
  doc.line(5, y, pageWidth - 5, y); y += 3;

  // Items
  doc.setFont('helvetica', 'normal');
  for (const item of sale.items) {
    if (y > 140) { doc.addPage(); y = 10; }
    const precioBS = item.priceUSD * exchangeRate;
    const subtotalBS = item.subtotalUSD * exchangeRate;
    doc.text(item.productName.substring(0, 14), 5, y);
    doc.text(item.quantity.toString(), 32, y);
    doc.text(`Bs ${precioBS.toFixed(2)}`, 50, y);
    doc.text(`Bs ${subtotalBS.toFixed(2)}`, pageWidth - 5, y, { align: 'right' });
    y += 4;
  }

  y += 2;
  doc.line(5, y, pageWidth - 5, y); y += 4;

  // Totales
  const baseImponibleBS = sale.subtotalBaseUSD * exchangeRate;
  const ivaBS = sale.subtotalIVAUSD * exchangeRate;
  const totalBS = sale.totalBS;

  doc.setFont('helvetica', 'bold');
  doc.text('Base Imponible:', 5, y);
  doc.text(`Bs ${baseImponibleBS.toFixed(2)}`, pageWidth - 5, y, { align: 'right' });
  y += 4;
  doc.text(`IVA ${(ivaRate * 100).toFixed(0)}%:`, 5, y);
  doc.text(`Bs ${ivaBS.toFixed(2)}`, pageWidth - 5, y, { align: 'right' });
  y += 4;
  doc.text('TOTAL:', 5, y);
  doc.text(`Bs ${totalBS.toFixed(2)}`, pageWidth - 5, y, { align: 'right' });

  y += 6;
  doc.line(5, y, pageWidth - 5, y); y += 4;

  // Pie
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.text('Factura procesada según normativa SENIAT', pageWidth / 2, y, { align: 'center' });
  y += 3;
  doc.text('Tasa de cambio BCV aplicada', pageWidth / 2, y, { align: 'center' });
  y += 3;
  doc.text('Gracias por su compra', pageWidth / 2, y, { align: 'center' });

  doc.save(`factura_${invoiceNumber.replace('/', '-')}.pdf`);
};

const formatPaymentMethod = (method: Sale['paymentMethod']): string => {
  const m: Record<Sale['paymentMethod'], string> = {
    cash_usd: 'Efectivo USD',
    cash_bs: 'Efectivo Bs',
    transfer_bs: 'Transferencia Bs',
    transfer_usd: 'Transferencia USD',
    mixed: 'Mixto',
  };
  return m[method];
=======
import jsPDF from 'jspdf';
import { Sale } from '../types';
import { getNextInvoiceNumber } from '../services/invoiceNumberService';

export const generateFiscalInvoice = async (sale: Sale, ivaRate: number): Promise<void> => {
  const exchangeRate = sale.exchangeRate;
  const doc = new jsPDF({ unit: 'mm', format: [80, 180] });
  const pageWidth = 80;
  let y = 10;

  // Obtener número de factura
  const invoiceNumber = await getNextInvoiceNumber();

  // Encabezado
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Audity Pro', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('RIF: J-12345678-9', pageWidth / 2, y, { align: 'center' });
  y += 3;
  doc.text('Sistema de Auditoría de Inventarios', pageWidth / 2, y, { align: 'center' });
  y += 4;

  // Número de factura
  doc.setFont('helvetica', 'bold');
  doc.text(`No. Factura: ${invoiceNumber}`, pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text(`Fecha: ${new Date(sale.createdAt).toLocaleString('es-VE')}`, 5, y);
  y += 3;
  doc.text(`Vendedor: ${sale.sellerName}`, 5, y);
  y += 3;
  doc.text(`Cliente: ${sale.customerName || 'Cliente General'}`, 5, y);
  y += 3;
  doc.text(`Método: ${formatPaymentMethod(sale.paymentMethod)}`, 5, y);
  y += 3;
  doc.text(`Tasa BCV: ${exchangeRate.toFixed(2)} Bs/USD`, 5, y);
  y += 5;

  // Línea divisoria
  doc.line(5, y, pageWidth - 5, y); y += 4;

  // Encabezado de tabla
  doc.setFont('helvetica', 'bold');
  doc.text('Producto', 5, y);
  doc.text('Cant', 32, y);
  doc.text('Precio Bs', 50, y);
  doc.text('Subtotal', 70, y, { align: 'right' });
  y += 3;
  doc.line(5, y, pageWidth - 5, y); y += 3;

  // Items
  doc.setFont('helvetica', 'normal');
  for (const item of sale.items) {
    if (y > 140) { doc.addPage(); y = 10; }
    const precioBS = item.priceUSD * exchangeRate;
    const subtotalBS = item.subtotalUSD * exchangeRate;
    doc.text(item.productName.substring(0, 14), 5, y);
    doc.text(item.quantity.toString(), 32, y);
    doc.text(`Bs ${precioBS.toFixed(2)}`, 50, y);
    doc.text(`Bs ${subtotalBS.toFixed(2)}`, pageWidth - 5, y, { align: 'right' });
    y += 4;
  }

  y += 2;
  doc.line(5, y, pageWidth - 5, y); y += 4;

  // Totales
  const baseImponibleBS = sale.subtotalBaseUSD * exchangeRate;
  const ivaBS = sale.subtotalIVAUSD * exchangeRate;
  const totalBS = sale.totalBS;

  doc.setFont('helvetica', 'bold');
  doc.text('Base Imponible:', 5, y);
  doc.text(`Bs ${baseImponibleBS.toFixed(2)}`, pageWidth - 5, y, { align: 'right' });
  y += 4;
  doc.text(`IVA ${(ivaRate * 100).toFixed(0)}%:`, 5, y);
  doc.text(`Bs ${ivaBS.toFixed(2)}`, pageWidth - 5, y, { align: 'right' });
  y += 4;
  doc.text('TOTAL:', 5, y);
  doc.text(`Bs ${totalBS.toFixed(2)}`, pageWidth - 5, y, { align: 'right' });

  y += 6;
  doc.line(5, y, pageWidth - 5, y); y += 4;

  // Pie
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.text('Factura procesada según normativa SENIAT', pageWidth / 2, y, { align: 'center' });
  y += 3;
  doc.text('Tasa de cambio BCV aplicada', pageWidth / 2, y, { align: 'center' });
  y += 3;
  doc.text('Gracias por su compra', pageWidth / 2, y, { align: 'center' });

  doc.save(`factura_${invoiceNumber.replace('/', '-')}.pdf`);
};

const formatPaymentMethod = (method: Sale['paymentMethod']): string => {
  const m: Record<Sale['paymentMethod'], string> = {
    cash_usd: 'Efectivo USD',
    cash_bs: 'Efectivo Bs',
    transfer_bs: 'Transferencia Bs',
    transfer_usd: 'Transferencia USD',
    mixed: 'Mixto',
  };
  return m[method];
>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
};