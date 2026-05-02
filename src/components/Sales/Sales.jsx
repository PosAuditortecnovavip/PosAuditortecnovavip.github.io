import { useState } from 'react';
import { ProductSelector } from './ProductSelector';
import { QuickInvoice } from './QuickInvoice';

export const Sales = ({ exchangeRate, convertUSDtoVES, inventory }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Facturación Rápida</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductSelector 
          inventory={inventory} 
          onSelect={setSelectedProduct}
          selected={selectedProduct}
        />
        <QuickInvoice 
          product={selectedProduct}
          exchangeRate={exchangeRate}
          convertUSDtoVES={convertUSDtoVES}
        />
      </div>
    </div>
  );
};