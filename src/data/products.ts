import { Product } from '../types';

export const defaultProducts: Product[] = [
  // Protección
  { id: 'prod-001', code: 'VT-001', name: 'Vidrio Templado iPhone 14', category: 'Protección', costUSD: 1.50, priceUSD: 5.00, stock: 45, minStock: 10, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'prod-002', code: 'VT-002', name: 'Vidrio Templado iPhone 15', category: 'Protección', costUSD: 1.80, priceUSD: 6.00, stock: 32, minStock: 10, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'prod-003', code: 'VT-003', name: 'Vidrio Templado Samsung S24', category: 'Protección', costUSD: 1.60, priceUSD: 5.50, stock: 28, minStock: 8, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'prod-004', code: 'FC-001', name: 'Funda Silicona iPhone 14', category: 'Protección', costUSD: 2.00, priceUSD: 7.00, stock: 20, minStock: 5, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'prod-005', code: 'FC-002', name: 'Funda Silicona iPhone 15', category: 'Protección', costUSD: 2.20, priceUSD: 7.50, stock: 15, minStock: 5, createdAt: '2025-01-01', updatedAt: '2025-01-01' },

  // Cargadores
  { id: 'prod-006', code: 'CG-001', name: 'Cargador Rápido 20W USB-C', category: 'Cargadores', costUSD: 4.00, priceUSD: 12.00, stock: 25, minStock: 5, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'prod-007', code: 'CG-002', name: 'Cargador Rápido 30W USB-C', category: 'Cargadores', costUSD: 5.50, priceUSD: 15.00, stock: 18, minStock: 5, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'prod-008', code: 'CB-001', name: 'Cable USB-C 1m Trenzado', category: 'Cargadores', costUSD: 1.20, priceUSD: 4.00, stock: 60, minStock: 15, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'prod-009', code: 'CB-002', name: 'Cable Lightning 1m Trenzado', category: 'Cargadores', costUSD: 1.50, priceUSD: 5.00, stock: 40, minStock: 10, createdAt: '2025-01-01', updatedAt: '2025-01-01' },

  // Audio
  { id: 'prod-010', code: 'AU-001', name: 'Audífonos Bluetooth TWS', category: 'Audio', costUSD: 6.00, priceUSD: 18.00, stock: 12, minStock: 3, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'prod-011', code: 'AU-002', name: 'Audífonos Cable USB-C', category: 'Audio', costUSD: 2.00, priceUSD: 6.00, stock: 22, minStock: 5, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'prod-012', code: 'AU-003', name: 'AirPods Pro Réplica AAA', category: 'Audio', costUSD: 12.00, priceUSD: 30.00, stock: 8, minStock: 2, createdAt: '2025-01-01', updatedAt: '2025-01-01' },

  // Accesorios
  { id: 'prod-013', code: 'AC-001', name: 'Soporte Magnético para Auto', category: 'Accesorios', costUSD: 3.00, priceUSD: 9.00, stock: 15, minStock: 5, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'prod-014', code: 'AC-002', name: 'Ring Holder para Dedo', category: 'Accesorios', costUSD: 0.80, priceUSD: 3.00, stock: 50, minStock: 10, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'prod-015', code: 'AC-003', name: 'Power Bank 10000mAh', category: 'Accesorios', costUSD: 8.00, priceUSD: 22.00, stock: 10, minStock: 3, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
];