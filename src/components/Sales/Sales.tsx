import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PackageOpen, RefreshCw } from 'lucide-react';
import { useSales } from '../../hooks/useSales';
import { useCustomers } from '../../hooks/useCustomers';
import ProductSearch from './ProductSearch';
import Cart from './Cart';
import PaymentModal from './PaymentModal';
import DocumentChoiceModal from './DocumentChoiceModal';
import { Sale } from '../../types';

export default function Sales() {
  const {
    products,
    loadingProducts,
    cart, addToCart, removeFromCart, updateQuantity, clearCart,
    totalUSD, totalBS, checkout, checkoutLoading, paymentMethod, setPaymentMethod,
    error, clearError, customerId, setCustomer,
  } = useSales();
  const { customers } = useCustomers();
  const [search, setSearch] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const lower = search.toLowerCase();
    return products.filter(
      p => p.name.toLowerCase().includes(lower) || p.code.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower)
    );
  }, [products, search]);

  const handleCheckout = async () => {
    const sale = await checkout();
    if (sale) {
      setCompletedSale(sale);
      setShowPayment(false);
      // No se genera ningún documento automático
    }
  };

  const handleCloseDocumentChoice = () => {
    setCompletedSale(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Punto de Venta</h1>
        <p className="text-text-secondary mt-1 text-sm md:text-base">Registrar venta rápida</p>
      </div>

      {loadingProducts ? (
        <div className="text-center py-8 text-text-muted">
          <RefreshCw size={24} className="mx-auto mb-2 animate-spin" />
          <p>Cargando productos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4">
            <ProductSearch search={search} onSearchChange={setSearch} />
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredProducts.map(product => (
                <motion.button
                  key={product.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`glass-card p-3 text-left space-y-1 transition cursor-pointer ${product.stock === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:border-primary/50'}`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-semibold leading-tight line-clamp-2">{product.name}</span>
                    <span className="text-[10px] text-text-muted shrink-0">{product.code}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-primary">${product.priceUSD.toFixed(2)}</span>
                    <span className={`text-xs ${product.stock <= product.minStock ? 'text-warning' : 'text-text-muted'}`}>
                      Stock: {product.stock}
                    </span>
                  </div>
                  {product.stock === 0 && (
                    <p className="text-xs text-danger mt-1">Agotado</p>
                  )}
                </motion.button>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center text-text-muted py-8">
                  <PackageOpen size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No se encontraron productos</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Cart
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onClear={clearCart}
              totalUSD={totalUSD}
              totalBS={totalBS}
              onCheckout={() => setShowPayment(true)}
              error={error}
              onClearError={clearError}
            />
          </div>
        </div>
      )}

      {showPayment && (
        <PaymentModal
          totalUSD={totalUSD}
          totalBS={totalBS}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          onConfirm={handleCheckout}
          onCancel={() => setShowPayment(false)}
          customers={customers}
          selectedCustomerId={customerId}
          onCustomerChange={setCustomer}
          isLoading={checkoutLoading}
        />
      )}

      {/* Modal de selección de documento (OBLIGATORIO) */}
      {completedSale && (
        <DocumentChoiceModal
          sale={completedSale}
          onClose={handleCloseDocumentChoice}
        />
      )}
    </motion.div>
  );
}