import { motion } from 'framer-motion';
import { PackageOpen, TrendingUp } from 'lucide-react';
import { useInventory } from '../../hooks/useInventory';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import InventoryList from './InventoryList';
import MovementForm from './Movementform';
import MovementHistory from './MovementHistory';

export default function Inventory() {
  const {
    products,
    movements,
    selectedProduct,
    setSelectedProduct,
    addMovement,
    totalValueUSD,
    productMovements,
    refresh,
  } = useInventory();
  const { formatUSD } = useExchangeRate();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Gestión de Inventario</h1>
          <p className="text-text-secondary mt-1 text-sm md:text-base">Control total de productos y movimientos</p>
        </div>
        <div className="glass-card px-4 py-2 flex items-center gap-3 self-start">
          <TrendingUp size={18} className="text-success" />
          <div>
            <p className="text-xs text-text-muted">Valor total (costo)</p>
            <p className="font-bold text-lg">{formatUSD(totalValueUSD)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <InventoryList
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
            refresh={refresh}
          />
        </div>

        {/* Panel de acciones */}
        <div className="space-y-4">
          {selectedProduct && (
            <MovementForm
              product={selectedProduct}
              onSubmit={(type, quantity, reason) => {
                addMovement(selectedProduct.id, type, quantity, reason);
                setSelectedProduct(null); // Opcional: cerrar después de registrar
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
            movements={selectedProduct ? productMovements(selectedProduct.id) : movements}
            productName={selectedProduct?.name}
          />
        </div>
      </div>
    </motion.div>
  );
}