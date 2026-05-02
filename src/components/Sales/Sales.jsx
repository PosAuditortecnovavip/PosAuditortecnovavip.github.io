import { useState } from 'react';
import { ProductSelector } from './ProductSelector';
import { QuickInvoice } from './QuickInvoice';
import { useInventory } from '../context/InventoryContext';

export const Sales = ({ exchangeRate, convertUSDtoVES }) => {
  const { inventory } = useInventory();
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="space-y-6 page-enter">
      <h1 className="text-3xl font-bold gradient-text">Facturación Rápida</h1>
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
