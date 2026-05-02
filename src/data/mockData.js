export const mockInventory = [
  { id: 1, name: 'Laptop Pro X1', sku: 'LPX-001', category: 'Electrónicos', costUSD: 850.00, stock: 12, minStock: 5 },
  { id: 2, name: 'Monitor 27" 4K', sku: 'MON-027', category: 'Electrónicos', costUSD: 420.00, stock: 8, minStock: 3 },
  { id: 3, name: 'Teclado Mecánico RGB', sku: 'TEC-RGB', category: 'Periféricos', costUSD: 75.00, stock: 25, minStock: 10 },
  { id: 4, name: 'Mouse Inalámbrico', sku: 'MOU-WRL', category: 'Periféricos', costUSD: 45.00, stock: 30, minStock: 15 },
  { id: 5, name: 'Webcam HD 1080p', sku: 'WEB-1080', category: 'Accesorios', costUSD: 65.00, stock: 15, minStock: 8 },
  { id: 6, name: 'SSD 1TB NVMe', sku: 'SSD-1TB', category: 'Componentes', costUSD: 110.00, stock: 20, minStock: 10 },
  { id: 7, name: 'RAM 16GB DDR4', sku: 'RAM-16G', category: 'Componentes', costUSD: 55.00, stock: 18, minStock: 8 },
  { id: 8, name: 'Tablet 10"', sku: 'TAB-010', category: 'Electrónicos', costUSD: 320.00, stock: 6, minStock: 3 },
];

export const mockSales = [
  { id: 1, productId: 1, quantity: 2, totalUSD: 1700.00, date: '2024-01-15' },
  { id: 2, productId: 3, quantity: 5, totalUSD: 375.00, date: '2024-01-16' },
  { id: 3, productId: 7, quantity: 3, totalUSD: 165.00, date: '2024-01-17' },
];

// Datos para el conteo ciego (físico real)
export const mockPhysicalCount = [
  { productId: 1, countedStock: 10 }, // Faltan 2
  { productId: 2, countedStock: 8 },  // Correcto
  { productId: 3, countedStock: 23 }, // Faltan 2
  { productId: 4, countedStock: 30 }, // Correcto
  { productId: 5, countedStock: 12 }, // Faltan 3
  { productId: 6, countedStock: 20 }, // Correcto
  { productId: 7, countedStock: 18 }, // Correcto
  { productId: 8, countedStock: 5 },  // Falta 1
];