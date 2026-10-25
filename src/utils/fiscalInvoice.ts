import jsPDF from 'jspdf';
import { Sale } from '../types';
import { getNextInvoiceNumber } from '../services/invoiceNumberService';

const formatPaymentMethod = (method: Sale['paymentMethod']): string => {
  const m: Record<Sale['paymentMethod'], string> = {
    cash_usd: 'Efectivo USD', cash_bs: 'Efectivo Bs', transfer_bs: 'Transferencia Bs',
    transfer_usd: 'Transferencia USD', mixed: 'Mixto',
  };
  return m[method];
};

export const generateFiscalInvoice = async (sale: Sale, ivaRate: number): Promise<void> => {
  const exchangeRate = sale.exchangeRate;
  const doc = new jsPDF({ unit: 'mm', format: [80, 180] });
  const pageWidth = 80; let y = 10;

  const invoiceNumber = await getNextInvoiceNumber();

  doc.setFontSize(10); doc.setFont('helvetica', 'bold');
  doc.text('Tecnova VIP', pageWidth / 2, y, { align: 'center' }); y += 5;
  doc.setFontSize(6); doc.setFont('helvetica', 'normal');
  doc.text('Audity Pro', pageWidth / 2, y, { align: 'center' }); y += 4;
  doc.text('RIF: J-12345678-9', pageWidth / 2, y, { align: 'center' }); y += 4;
  doc.setFont('helvetica', 'bold');
  doc.text(`No. Factura: ${invoiceNumber}`, pageWidth / 2, y, { align: 'center' }); y += 5;

  doc.setFont('helvetica', 'normal'); doc.setFontSize(6);
  doc.text(`Fecha: ${new Date(sale.createdAt).toLocaleString('es-VE')}`, 5, y); y += 3;
  doc.text(`Vendedor: ${sale.sellerName}`, 5, y); y += 3;
  doc.text(`Cliente: ${sale.customerName || 'Cliente General'}`, 5, y); y += 3;
  doc.text(`Método: ${formatPaymentMethod(sale.paymentMethod)}`, 5, y); y += 3;
  doc.text(`Tasa BCV: ${exchangeRate.toFixed(2)} Bs/USD`, 5, y); y += 5;

  doc.line(5, y, pageWidth - 5, y); y += 4;
  doc.setFont('helvetica', 'bold');
  doc.text('Producto', 5, y); doc.text('Cant', 32, y); doc.text('Precio Bs', 50, y); doc.text('Subtotal', 70, y, { align: 'right' });
  y += 3; doc.line(5, y, pageWidth - 5, y); y += 3;

  doc.setFont('helvetica', 'normal');
  for (const item of sale.items) {
    if (y > 140) { doc.addPage(); y = 10; }
    doc.text(item.productName.substring(0, 14), 5, y);
    doc.text(item.quantity.toString(), 32, y);
    doc.text(`Bs ${(item.priceUSD * exchangeRate).toFixed(2)}`, 50, y);
    doc.text(`Bs ${(item.subtotalUSD * exchangeRate).toFixed(2)}`, pageWidth - 5, y, { align: 'right' });
    y += 4;
  }

  y += 2; doc.line(5, y, pageWidth - 5, y); y += 4;

  doc.setFont('helvetica', 'bold');
  doc.text('Base Imponible:', 5, y);
  doc.text(`Bs ${(sale.subtotalBaseUSD * exchangeRate).toFixed(2)}`, pageWidth - 5, y, { align: 'right' }); y += 4;
  doc.text(`IVA ${(ivaRate * 100).toFixed(0)}%:`, 5, y);
  doc.text(`Bs ${(sale.subtotalIVAUSD * exchangeRate).toFixed(2)}`, pageWidth - 5, y, { align: 'right' }); y += 4;
  doc.text('TOTAL:', 5, y);
  doc.text(`Bs ${sale.totalBS.toFixed(2)}`, pageWidth - 5, y, { align: 'right' });

  y += 6; doc.line(5, y, pageWidth - 5, y); y += 4;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(5);
  doc.text('Factura procesada según normativa SENIAT', pageWidth / 2, y, { align: 'center' }); y += 3;
  doc.text('Tecnova VIP - Audity Pro', pageWidth / 2, y, { align: 'center' }); y += 3;
  doc.text('Gracias por su compra', pageWidth / 2, y, { align: 'center' });

  doc.save(`factura_${invoiceNumber.replace('/', '-')}.pdf`);
};