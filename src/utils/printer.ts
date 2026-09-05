import { Sale } from '../types';

export const printTicket = (sale: Sale): void => {
  const width = 80;
  const content = `
    <div style="font-family: monospace; width: ${width}mm; padding: 2mm;">
      <h2 style="text-align:center; margin:0;">Tecnova VIP</h2>
      <p style="text-align:center; margin:0;">Audity Pro</p>
      <p style="text-align:center; margin:0;">RIF: J-12345678-9</p>
      <hr/>
      <p style="text-align:center; font-size:1.2em; font-weight:bold;">TICKET DE VENTA</p>
      <p>No. Factura: ${sale.id}</p>
      <p>Fecha: ${new Date(sale.createdAt).toLocaleString('es-VE')}</p>
      <p>Vendedor: ${sale.sellerName}</p>
      ${sale.customerName ? `<p>Cliente: ${sale.customerName}</p>` : ''}
      <p>Método: ${formatPrintPayment(sale.paymentMethod)}</p>
      <p>Tasa BCV: ${sale.exchangeRate.toFixed(2)} Bs/USD</p>
      <hr/>
      <table style="width:100%; font-size:0.9em;">
        <thead><tr><th align="left">Producto</th><th>Cant</th><th align="right">Precio</th><th align="right">Subtotal</th></tr></thead>
        <tbody>
          ${sale.items.map(item => `
            <tr>
              <td>${item.productName.substring(0, 18)}</td>
              <td>${item.quantity}</td>
              <td align="right">$${item.priceUSD.toFixed(2)}</td>
              <td align="right">$${item.subtotalUSD.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <hr/>
      <p>Subtotal (sin IVA): $${sale.subtotalBaseUSD.toFixed(2)}</p>
      <p>IVA 16%: $${sale.subtotalIVAUSD.toFixed(2)}</p>
      <p style="font-weight:bold;">Total USD: $${sale.totalUSD.toFixed(2)}</p>
      <p>Total Bs: Bs ${sale.totalBS.toFixed(2)}</p>
      <hr/>
      <p style="text-align:center; font-size:0.8em;">Factura procesada según normativa SENIAT</p>
      <p style="text-align:center; font-size:0.8em;">Tecnova VIP - Audity Pro</p>
      <p style="text-align:center; font-size:0.8em;">Gracias por su compra</p>
    </div>
  `;

  const printWindow = window.open('', '_blank', `width=${width}mm,height=auto`);
  if (!printWindow) return;
  printWindow.document.write(`
    <html>
      <head>
        <title>Ticket de Venta</title>
        <style>
          body { margin:0; font-family: 'Courier New', monospace; font-size: 12px; }
          @media print { body { width: 80mm; } }
        </style>
      </head>
      <body onload="window.print(); setTimeout(() => window.close(), 500);">
        ${content}
      </body>
    </html>
  `);
  printWindow.document.close();
};

const formatPrintPayment = (method: string): string => {
  const map: Record<string, string> = {
    cash_usd: 'Efectivo USD',
    cash_bs: 'Efectivo Bs',
    transfer_bs: 'Transferencia Bs',
    transfer_usd: 'Transferencia USD',
    mixed: 'Mixto',
  };
  return map[method] || method;
};