import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Product } from '../../types';

interface Props {
  products: Product[];
  onSubmit: (data: {
    productId?: string; productCode: string; productName: string;
    category: string; supplier: string; quantity: number;
    unitCostUSD: number; priceUSD: number; minStock: number;
  }) => Promise<void>;
  onCancel: () => void;
}

const categories = ['Protección', 'Cargadores', 'Audio', 'Accesorios'];

export default function PurchaseForm({ products, onSubmit, onCancel }: Props) {
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [supplier, setSupplier] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitCostUSD, setUnitCostUSD] = useState('');
  const [priceUSD, setPriceUSD] = useState('');
  const [minStock, setMinStock] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity); const cost = parseFloat(unitCostUSD); const price = parseFloat(priceUSD); const min = parseInt(minStock);
    if (!supplier || isNaN(qty) || qty <= 0 || isNaN(cost) || cost <= 0) { alert('Complete los campos obligatorios.'); return; }
    if (isNewProduct && (!productCode || !productName || isNaN(price) || isNaN(min))) { alert('Complete los datos del nuevo producto.'); return; }
    setSaving(true);
    try {
      await onSubmit({
        productId: isNewProduct ? undefined : selectedProductId || undefined,
        productCode: isNewProduct ? productCode : selectedProduct?.code || '',
        productName: isNewProduct ? productName : selectedProduct?.name || '',
        category: isNewProduct ? category : selectedProduct?.category || categories[0],
        supplier, quantity: qty, unitCostUSD: cost,
        priceUSD: isNewProduct ? price : selectedProduct?.priceUSD || cost,
        minStock: isNewProduct ? min : selectedProduct?.minStock || 5,
      });
    } finally { setSaving(false); }
  };

  return (
    <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass-card p-5 md:p-6 space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">Registrar Compra</h3>
        <button type="button" onClick={onCancel} className="text-text-muted hover:text-text-primary p-2" aria-label="Cerrar"><X size={22} /></button>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={() => setIsNewProduct(false)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${!isNewProduct ? 'bg-primary/20 border-2 border-primary text-primary' : 'bg-surface/30 border-2 border-transparent'}`}>Producto existente</button>
        <button type="button" onClick={() => setIsNewProduct(true)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${isNewProduct ? 'bg-primary/20 border-2 border-primary text-primary' : 'bg-surface/30 border-2 border-transparent'}`}>Producto nuevo</button>
      </div>

      {!isNewProduct && (
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Producto</label>
          <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary" required>
            <option value="">Seleccione un producto</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
          </select>
        </div>
      )}

      {isNewProduct && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-text-secondary mb-1">Código</label><input value={productCode} onChange={(e) => setProductCode(e.target.value)} placeholder="Ej. VT-020" className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary" required /></div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1">Nombre</label><input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Ej. Vidrio Templado iPhone 16" className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary" required /></div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1">Categoría</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1">Precio venta USD</label><input type="number" step="0.01" min="0" value={priceUSD} onChange={(e) => setPriceUSD(e.target.value)} placeholder="0.00" className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary" required /></div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1">Stock mínimo</label><input type="number" min="0" value={minStock} onChange={(e) => setMinStock(e.target.value)} placeholder="0" className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary" required /></div>
        </div>
      )}

      <div><label className="block text-sm font-medium text-text-secondary mb-1">Proveedor</label><input value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="Ej. Distribuidora XYZ" className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary" required /></div>

      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-text-secondary mb-1">Cantidad</label><input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary" required /></div>
        <div><label className="block text-sm font-medium text-text-secondary mb-1">Costo unitario USD</label><input type="number" step="0.01" min="0" value={unitCostUSD} onChange={(e) => setUnitCostUSD(e.target.value)} placeholder="0.00" className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary" required /></div>
      </div>

      {quantity && unitCostUSD && <div className="bg-surface/30 rounded-xl p-3 text-sm"><strong>Total de la compra:</strong> ${(parseInt(quantity) * parseFloat(unitCostUSD) || 0).toFixed(2)}</div>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="flex-1 py-3.5 bg-gradient-to-r from-primary to-accent rounded-xl font-bold text-white text-base transition hover:from-primary-dark hover:to-accent-light disabled:opacity-50">{saving ? 'Guardando...' : 'Registrar Compra'}</button>
        <button type="button" onClick={onCancel} className="px-5 py-3.5 border border-border rounded-xl text-base text-text-secondary hover:bg-surface/50 transition">Cancelar</button>
      </div>
    </motion.form>
  );
}