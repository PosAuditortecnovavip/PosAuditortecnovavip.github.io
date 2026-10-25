import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { Product, Purchase } from '../types';
import { addProduct, getProductById, updateProductStock } from './productService';
import { recordMovement } from './inventoryMovementService';

const COL = 'purchases';

interface PurchaseInput {
  productId?: string;
  productCode: string;
  productName: string;
  category: string;
  supplier: string;
  quantity: number;
  unitCostUSD: number;
  priceUSD: number;
  minStock: number;
  userId: string;
  userName: string;
}

export const registerPurchase = async (input: PurchaseInput): Promise<Purchase> => {
  let product: Product | undefined;
  if (input.productId) product = await getProductById(input.productId);

  if (!product) {
    product = await addProduct({
      code: input.productCode,
      name: input.productName,
      category: input.category,
      costUSD: input.unitCostUSD,
      priceUSD: input.priceUSD,
      stock: input.quantity,
      minStock: input.minStock,
    });
  } else {
    await updateProductStock(product.id, product.stock + input.quantity);
  }

  await recordMovement({
    productId: product.id,
    productName: product.name,
    type: 'entry',
    origin: 'purchase',
    quantity: input.quantity,
    reason: `Compra a proveedor ${input.supplier}`,
    userId: input.userId,
    userName: input.userName,
  });

  const purchase: Omit<Purchase, 'id'> = {
    productId: product.id,
    productName: product.name,
    supplier: input.supplier,
    quantity: input.quantity,
    unitCostUSD: input.unitCostUSD,
    totalUSD: input.unitCostUSD * input.quantity,
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