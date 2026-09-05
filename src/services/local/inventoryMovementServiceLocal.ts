import { InventoryMovement } from '../../types';
import { updateProductStockLocal } from './productServiceLocal';

const STORAGE_KEY = 'audity_inventory_movements';

const getMovements = (): InventoryMovement[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveMovements = (movements: InventoryMovement[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movements));
};

export const recordMovementLocal = (movement: Omit<InventoryMovement, 'id' | 'createdAt'>): InventoryMovement | null => {
  const product = updateProductStockLocal(
    movement.productId,
    movement.type === 'entry' || movement.type === 'adjustment'
      ? movement.quantity
      : -movement.quantity
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

export const getAllMovementsLocal = (): InventoryMovement[] => {
  return getMovements().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getMovementHistoryLocal = (productId?: string): InventoryMovement[] => {
  const movements = getMovements();
  if (productId) {
    return movements.filter(m => m.productId === productId);
  }
  return movements;
};