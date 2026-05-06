import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductSelector } from './ProductSelector';
import { QuickInvoice } from './QuickInvoice';
import { useInventory } from '../../context/InventoryContext';

export const Sales = ({ exchangeRate, convertUSDtoVES }) => {
  const { inventory } = useInventory();
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
          Facturación Rápida
        </h1>
        <p className="text-neutral-400 text-sm mt-1">Convierte USD a VES en tiempo real</p>
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
    </motion.div>
  );
};
