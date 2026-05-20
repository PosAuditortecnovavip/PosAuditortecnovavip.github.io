import { InventoryMovement } from '../types';
import { updateProductStock } from './productService';

const STORAGE_KEY = 'audity_inventory_movements';

const getMovements = (): InventoryMovement[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveMovements = (movements: InventoryMovement[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movements));
};

export const recordMovement = (movement: Omit<InventoryMovement, 'id' | 'createdAt'>): InventoryMovement | null => {
  const product = updateProductStock(
    movement.productId,
    movement.type === 'entry' || movement.type === 'adjustment'
      ? movement.quantity
      : -movement.quantity // Las salidas reducen stock
  );

  if (!product) return null;

  const newMovement: InventoryMovement = {
    ...movement,
    id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  const movements = getMovements();
  movements.push(newMovement);
  saveMovements(movements);
  return newMovement;
};

export const getMovementHistory = (productId?: string): InventoryMovement[] => {
  const movements = getMovements();
  if (productId) {
    return movements.filter(m => m.productId === productId);
  }
  return movements;
};

export const getAllMovements = (): InventoryMovement[] => {
  return getMovements().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};