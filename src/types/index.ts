export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
  INVENTORY = 'inventory',
}

export interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  active?: boolean;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  costUSD: number;
  priceUSD: number; // Precio de venta al público (IVA incluido)
  stock: number;
  minStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItemIVA {
  productId: string;
  productName: string;
  quantity: number;
  priceUSD: number;
  baseUSD: number;
  ivaUSD: number;
  subtotalUSD: number;
}

export interface SaleItem extends SaleItemIVA {}

export interface SaleIVA {
  id: string;
  items: SaleItemIVA[];
  subtotalBaseUSD: number;
  subtotalIVAUSD: number;
  totalUSD: number;
  totalBS: number;
  exchangeRate: number;
  paymentMethod: 'cash_usd' | 'cash_bs' | 'transfer_bs' | 'transfer_usd' | 'mixed';
  sellerId: string;
  sellerName: string;
  customerId?: string;
  customerName?: string;
  createdAt: string;
}

export interface Sale extends SaleIVA {}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'entry' | 'exit' | 'adjustment';
  quantity: number;
  reason: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface AuditRecord {
  id: string;
  productId: string;
  productName: string;
  systemStock: number;
  physicalStock: number;
  difference: number;
  reason: string;
  auditorId: string;
  auditorName: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  description: string;
  amountUSD: number;
  type: 'income' | 'expense';
  category: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface ExchangeRate {
  rate: number;
  date: string;
  source: 'bcv-official' | 'fallback' | 'manual' | 'offline';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
}