<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PackageOpen, TrendingUp, Plus, RefreshCw } from 'lucide-react';
import { useInventory } from '../../hooks/useInventory';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import InventoryList from './InventoryList';
import MovementForm from './Movementform';
import MovementHistory from './MovementHistory';
import AddProduct from './AddProduct';
import { Product } from '../../types';

export default function Inventory() {
  const {
    products,
    movements,
    selectedProduct,
    setSelectedProduct,
    addNewProduct,
    editProduct,
    removeProduct,
    addMovement,
    totalValueUSD,
    productMovements,
    refresh,
    loading,
  } = useInventory();
  const { formatUSD } = useExchangeRate();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productHistory, setProductHistory] = useState(movements);

  useEffect(() => {
    if (selectedProduct) {
      productMovements(selectedProduct.id).then(setProductHistory).catch(console.error);
    } else {
      setProductHistory(movements);
    }
  }, [selectedProduct, movements, productMovements]);

  const handleAddProduct = async (productData: any) => {
    await addNewProduct(productData);
    setShowAddProduct(false);
  };

  const handleEditProduct = async (productData: any) => {
    if (!editingProduct) return;
    await editProduct(editingProduct.id, productData);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
      await removeProduct(product.id);
    }
  };

  const openAdd = () => {
    setEditingProduct(null);
    setShowAddProduct(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setShowAddProduct(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Gestión de Inventario</h1>
          <p className="text-text-secondary mt-1 text-sm md:text-base">Control total de productos y movimientos</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-card px-4 py-2 flex items-center gap-3">
            <TrendingUp size={18} className="text-success" />
            <div>
              <p className="text-xs text-text-muted">Valor total (costo)</p>
              <p className="font-bold text-lg">{formatUSD(totalValueUSD)}</p>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="glass-card px-4 py-2 flex items-center gap-2 text-sm font-medium text-primary hover:bg-primary/10 transition"
          >
            <Plus size={16} />
            Nuevo producto
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8 text-text-muted">
          <RefreshCw size={24} className="mx-auto mb-2 animate-spin" />
          <p>Cargando inventario...</p>
        </div>
      )}

      {!loading && (
        <>
          {showAddProduct && (
            <AddProduct
              product={editingProduct}
              onSave={editingProduct ? handleEditProduct : handleAddProduct}
              onCancel={() => {
                setShowAddProduct(false);
                setEditingProduct(null);
              }}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <InventoryList
                products={products}
                selectedProduct={selectedProduct}
                onSelectProduct={setSelectedProduct}
                refresh={refresh}
                onEditProduct={openEdit}
                onDeleteProduct={handleDeleteProduct}
              />
            </div>

            <div className="space-y-4">
              {selectedProduct && (
                <MovementForm
                  product={selectedProduct}
                  onSubmit={(type, quantity, reason) => {
                    addMovement(selectedProduct.id, type, quantity, reason);
                    setSelectedProduct(null);
                  }}
                  onCancel={() => setSelectedProduct(null)}
                />
              )}
              {!selectedProduct && (
                <div className="glass-card p-4 text-center text-text-muted text-sm">
                  <PackageOpen size={32} className="mx-auto mb-2 opacity-50" />
                  Seleccione un producto para registrar un movimiento
                </div>
              )}
              <MovementHistory
                movements={selectedProduct ? productHistory : movements}
                productName={selectedProduct?.name}
              />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
=======
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PackageOpen, TrendingUp, Plus, RefreshCw } from 'lucide-react';
import { useInventory } from '../../hooks/useInventory';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import InventoryList from './InventoryList';
import MovementForm from './Movementform';
import MovementHistory from './MovementHistory';
import AddProduct from './AddProduct';
import { Product } from '../../types';

export default function Inventory() {
  const {
    products,
    movements,
    selectedProduct,
    setSelectedProduct,
    addNewProduct,
    editProduct,
    removeProduct,
    addMovement,
    totalValueUSD,
    productMovements,
    refresh,
    loading,
  } = useInventory();
  const { formatUSD } = useExchangeRate();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productHistory, setProductHistory] = useState(movements);

  useEffect(() => {
    if (selectedProduct) {
      productMovements(selectedProduct.id).then(setProductHistory).catch(console.error);
    } else {
      setProductHistory(movements);
    }
  }, [selectedProduct, movements, productMovements]);

  const handleAddProduct = async (productData: any) => {
    await addNewProduct(productData);
    setShowAddProduct(false);
  };

  const handleEditProduct = async (productData: any) => {
    if (!editingProduct) return;
    await editProduct(editingProduct.id, productData);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
      await removeProduct(product.id);
    }
  };

  const openAdd = () => {
    setEditingProduct(null);
    setShowAddProduct(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setShowAddProduct(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Gestión de Inventario</h1>
          <p className="text-text-secondary mt-1 text-sm md:text-base">Control total de productos y movimientos</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-card px-4 py-2 flex items-center gap-3">
            <TrendingUp size={18} className="text-success" />
            <div>
              <p className="text-xs text-text-muted">Valor total (costo)</p>
              <p className="font-bold text-lg">{formatUSD(totalValueUSD)}</p>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="glass-card px-4 py-2 flex items-center gap-2 text-sm font-medium text-primary hover:bg-primary/10 transition"
          >
            <Plus size={16} />
            Nuevo producto
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8 text-text-muted">
          <RefreshCw size={24} className="mx-auto mb-2 animate-spin" />
          <p>Cargando inventario...</p>
        </div>
      )}

      {!loading && (
        <>
          {showAddProduct && (
            <AddProduct
              product={editingProduct}
              onSave={editingProduct ? handleEditProduct : handleAddProduct}
              onCancel={() => {
                setShowAddProduct(false);
                setEditingProduct(null);
              }}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <InventoryList
                products={products}
                selectedProduct={selectedProduct}
                onSelectProduct={setSelectedProduct}
                refresh={refresh}
                onEditProduct={openEdit}
                onDeleteProduct={handleDeleteProduct}
              />
            </div>

            <div className="space-y-4">
              {selectedProduct && (
                <MovementForm
                  product={selectedProduct}
                  onSubmit={(type, quantity, reason) => {
                    addMovement(selectedProduct.id, type, quantity, reason);
                    setSelectedProduct(null);
                  }}
                  onCancel={() => setSelectedProduct(null)}
                />
              )}
              {!selectedProduct && (
                <div className="glass-card p-4 text-center text-text-muted text-sm">
                  <PackageOpen size={32} className="mx-auto mb-2 opacity-50" />
                  Seleccione un producto para registrar un movimiento
                </div>
              )}
              <MovementHistory
                movements={selectedProduct ? productHistory : movements}
                productName={selectedProduct?.name}
              />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
}