import { createContext, useContext, useState } from 'react';
import { mockInventory } from '../data/mockData';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState(mockInventory);

  const sellProduct = (productId, quantity) => {
    setInventory(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, stock: p.stock - quantity }
          : p
      )
    );
  };

  return (
    <InventoryContext.Provider value={{ inventory, sellProduct }}>
      {children}
    </InventoryContext.Provider>
  );
};