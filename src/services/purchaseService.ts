import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { Purchase, PurchaseItem, Product } from '../types';
import { addProduct, getProductById, updateProductStock } from './productService';
import { recordMovement } from './inventoryMovementService';

const COL = 'purchases';

export interface PurchaseItemInput {
  productId?: string;
  productCode: string;
  productName: string;
  category: string;
  quantity: number;
  unitCostUSD: number;
  priceUSD: number;
  minStock: number;
}

export interface PurchaseInput {
  supplier: string;
  items: PurchaseItemInput[];
  userId: string;
  userName: string;
}

export const registerPurchase = async (input: PurchaseInput): Promise<Purchase> => {
  const savedItems: PurchaseItem[] = [];
  let totalUSD = 0;

  for (const itemInput of input.items) {
    let product: Product | undefined;

    if (itemInput.productId) {
      product = await getProductById(itemInput.productId);
    }

    if (!product) {
      product = await addProduct({
        code: itemInput.productCode,
        name: itemInput.productName,
        category: itemInput.category,
        costUSD: itemInput.unitCostUSD,
        priceUSD: itemInput.priceUSD,
        stock: itemInput.quantity,
        minStock: itemInput.minStock,
      });
    } else {
      await updateProductStock(product.id, product.stock + itemInput.quantity);
    }

    await recordMovement({
      productId: product.id,
      productName: product.name,
      type: 'entry',
      origin: 'purchase',
      quantity: itemInput.quantity,
      reason: `Compra a proveedor ${input.supplier}`,
      userId: input.userId,
      userName: input.userName,
    });

    const subtotal = itemInput.unitCostUSD * itemInput.quantity;
    totalUSD += subtotal;

    savedItems.push({
      productId: product.id,
      productName: product.name,
      productCode: product.code,
      quantity: itemInput.quantity,
      unitCostUSD: itemInput.unitCostUSD,
      subtotalUSD: subtotal,
    });
  }

  const purchase: Omit<Purchase, 'id'> = {
    supplier: input.supplier,
    items: savedItems,
    totalUSD,
    userId: input.userId,
    userName: input.userName,
    createdAt: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, COL), purchase);
  return { ...purchase, id: docRef.id };
};

export const getAllPurchases = async (): Promise<Purchase[]> => {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Purchase));
};
