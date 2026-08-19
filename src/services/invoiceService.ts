import { Sale, Customer } from '../types';

interface InvoiceJSON {
  cabecera: {
    rifEmisor: string;
    razonSocialEmisor: string;
    numeroControl: string;
    fechaEmision: string;
    tipoTransaccion: string;
  };
  receptor: {
    nombre: string;
    telefono: string;
    email: string;
  } | null;
  items: {
    descripcion: string;
    cantidad: number;
    precioUnitarioUSD: number;
    baseImponibleUSD: number;
    ivaUSD: number;
    totalUSD: number;
  }[];
  totales: {
    subtotalBaseUSD: number;
    subtotalIVAUSD: number;
    totalUSD: number;
    totalBS: number;
    tasaBCV: number;
  };
}

export const generateInvoiceJSON = (sale: Sale, customer?: Customer | null): InvoiceJSON => {
  return {
    cabecera: {
      rifEmisor: 'J-50044992-5',         // RIF de ejemplo (configurable)
      razonSocialEmisor: 'Tecnova Vip, C.A.',
      numeroControl: `FAC-${sale.id}`,
      fechaEmision: sale.createdAt,
      tipoTransaccion: 'venta',
    },
    receptor: customer ? {
      nombre: customer.name,
      telefono: customer.phone,
      email: customer.email,
    } : null,
    items: sale.items.map(item => ({
      descripcion: item.productName,
      cantidad: item.quantity,
      precioUnitarioUSD: item.priceUSD,
      baseImponibleUSD: item.baseUSD,
      ivaUSD: item.ivaUSD,
      totalUSD: item.subtotalUSD,
    })),
    totales: {
      subtotalBaseUSD: sale.subtotalBaseUSD,
      subtotalIVAUSD: sale.subtotalIVAUSD,
      totalUSD: sale.totalUSD,
      totalBS: sale.totalBS,
      tasaBCV: sale.exchangeRate,
    },
  };
};