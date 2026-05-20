import { useState, useCallback } from 'react';
import { Product, SaleItemIVA, Sale } from '../types';
import { getProducts } from '../services/productService';
import { recordSale } from '../services/salesService';
import { useAuth } from '../context/AuthContext';
import { useExchangeRate } from '../context/ExchangeRateContext';

export interface CartItem extends SaleItemIVA {
  stock: number;
}

export const useSales = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<Sale['paymentMethod']>('cash_usd');
  const [error, setError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const { user } = useAuth();
  const { convertToBS, rate } = useExchangeRate();

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 3000);
  };

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setError(null);
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      const currentQty = existing ? existing.quantity : 0;
      const newQty = currentQty + quantity;

      if (newQty > product.stock) {
        showError(`Stock insuficiente: solo hay ${product.stock} unidades de "${product.name}".`);
        return prev;
      }

      const baseUnitario = product.priceUSD / 1.16;
      const ivaUnitario = product.priceUSD - baseUnitario;

      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? {
                ...item,
                quantity: newQty,
                subtotalUSD: newQty * item.priceUSD,
                baseUSD: baseUnitario,
                ivaUSD: ivaUnitario,
                stock: product.stock,
              }
            : item
        );
      }

      return [...prev, {
        productId: product.id,
        productName: product.name,
        quantity,
        priceUSD: product.priceUSD,
        baseUSD: baseUnitario,
        ivaUSD: ivaUnitario,
        subtotalUSD: product.priceUSD * quantity,
        stock: product.stock,
      }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setError(null);
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev => prev.map(item => {
      if (item.productId !== productId) return item;
      if (quantity > item.stock) {
        showError(`Stock máximo disponible: ${item.stock} unidades de "${item.productName}".`);
        return item;
      }
      return {
        ...item,
        quantity,
        subtotalUSD: quantity * item.priceUSD,
      };
    }));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setError(null);
  }, []);

  const totalUSD = cart.reduce((sum, item) => sum + item.subtotalUSD, 0);
  const totalBS = convertToBS(totalUSD);

  const setCustomer = (id: string, name: string) => {
    setCustomerId(id);
    setCustomerName(name);
  };

  const checkout = useCallback((): Sale | null => {
    if (cart.length === 0 || !user || !rate) return null;

    const items = cart.map(({ productId, productName, quantity, priceUSD, baseUSD, ivaUSD, subtotalUSD }) => ({
      productId, productName, quantity, priceUSD, baseUSD, ivaUSD, subtotalUSD,
    }));

    const subtotalBaseUSD = cart.reduce((sum, item) => sum + item.baseUSD * item.quantity, 0);
    const subtotalIVAUSD = cart.reduce((sum, item) => sum + item.ivaUSD * item.quantity, 0);

    const sale = recordSale({
      items,
      subtotalBaseUSD,
      subtotalIVAUSD,
      totalUSD,
      totalBS,
      exchangeRate: rate.rate,
      paymentMethod,
      sellerId: user.role + '-001',
      sellerName: user.name,
      customerId: customerId || undefined,
      customerName: customerName || undefined,
    });

    if (sale) {
      clearCart();
      setCustomerId('');
      setCustomerName('');
      window.dispatchEvent(new Event('inventory-updated'));
    }
    return sale;
  }, [cart, user, rate, totalUSD, totalBS, paymentMethod, clearCart, customerId, customerName]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalUSD,
    totalBS,
    checkout,
    paymentMethod,
    setPaymentMethod,
    error,
    clearError: () => setError(null),
    customerId,
    customerName,
    setCustomer,
  };
};