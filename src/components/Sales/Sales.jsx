import { useState } from 'react';
import { ProductSelector } from './ProductSelector';
import { QuickInvoice } from './QuickInvoice';
import { Zap } from 'lucide-react';

export const Sales = ({ exchangeRate, convertUSDtoVES, inventory }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center space-x-3 mb-2">
        <Zap className="text-accent-cyan" size={28} />
        <h1 className="text-3xl font-bold gradient-text">Facturación Rápida</h1>
      </div>
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
