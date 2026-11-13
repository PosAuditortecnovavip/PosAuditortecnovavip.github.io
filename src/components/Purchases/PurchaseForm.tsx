import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Product } from '../../types';
import { PurchaseItemInput } from '../../services/purchaseService';
import SupplierSelector from './SupplierSelector';
import { useSuppliers } from '../../hooks/useSuppliers';

interface Props {
  products: Product[];
  onSubmit: (data: { supplier: string; items: PurchaseItemInput[] }) => Promise<void>;
  onCancel: () => void;
}

const categories = ['Protección', 'Cargadores', 'Audio', 'Accesorios'];

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const isSimilar = (a: string, b: string) => {
  const na = normalize(a); const nb = normalize(b);
  if (!na || !nb) return false;
  if (na === nb || na.includes(nb) || nb.includes(na)) return true;
  const maxLen = Math.max(na.length, nb.length);
  if (maxLen < 5) return false;
  let matches = 0;
  const shorter = na.length < nb.length ? na : nb;
  const longer = na.length < nb.length ? nb : na;
  for (let i = 0; i < shorter.length; i++) if (longer.includes(shorter[i])) matches++;
  return matches / shorter.length > 0.85;
};

export default function PurchaseForm({ products, onSubmit, onCancel }: Props) {
  const { suppliers, add } = useSuppliers();
  const [supplier, setSupplier] = useState('');
  const [items, setItems] = useState<PurchaseItemInput[]>([]);
  const [saving, setSaving] = useState(false);

  const [isNewProduct, setIsNewProduct] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [quantity, setQuantity] = useState('');
  const [unitCostUSD, setUnitCostUSD] = useState('');
  const [priceUSD, setPriceUSD] = useState('');
  const [minStock, setMinStock] = useState('');

  const [similarWarning, setSimilarWarning] = useState<Product[]>([]);
  const [forceCreate, setForceCreate] = useState(false);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleNewSupplier = async (name: string, phone: string, email: string) => {
    await add({ name, phone, email });
  };

  const handleAddItem = () => {
    const qty = parseInt(quantity);
    const cost = parseFloat(unitCostUSD);

    if (isNewProduct) {
      if (!productCode || !productName || isNaN(qty) || qty <= 0 || isNaN(cost) || cost <= 0 || isNaN(parseFloat(priceUSD)) || isNaN(parseInt(minStock))) {
        alert('Complete todos los datos del nuevo producto.');
        return;
      }

      if (!forceCreate) {
        const similar = products.filter(p => isSimilar(p.name, productName) || isSimilar(p.code, productCode));
        if (similar.length > 0) {
          setSimilarWarning(similar);
          return;
        }
      }

      setItems(prev => [...prev, {
        productCode, productName, category, quantity: qty, unitCostUSD: cost,
        priceUSD: parseFloat(priceUSD), minStock: parseInt(minStock),
      }]);
      setProductCode(''); setProductName(''); setQuantity(''); setUnitCostUSD(''); setPriceUSD(''); setMinStock('');
      setSimilarWarning([]); setForceCreate(false);
    } else {
      if (!selectedProduct || isNaN(qty) || qty <= 0 || isNaN(cost) || cost <= 0) {
        alert('Seleccione producto y complete cantidad/costo.');
        return;
      }
      setItems(prev => [...prev, {
        productId: selectedProduct.id, productCode: selectedProduct.code,
        productName: selectedProduct.name, category: selectedProduct.category,
        quantity: qty, unitCostUSD: cost, priceUSD: selectedProduct.priceUSD, minStock: selectedProduct.minStock,
      }]);
      setSelectedProductId(''); setQuantity(''); setUnitCostUSD('');
    }
  };

  const handleForceCreate = () => {
    setForceCreate(true);
    setTimeout(() => {
      const qty = parseInt(quantity); const cost = parseFloat(unitCostUSD);
      if (!isNaN(qty) && qty > 0 && !isNaN(cost) && cost > 0) {
        setItems(prev => [...prev, {
          productCode, productName, category, quantity: qty, unitCostUSD: cost,
          priceUSD: parseFloat(priceUSD), minStock: parseInt(minStock),
        }]);
        setProductCode(''); setProductName(''); setQuantity(''); setUnitCostUSD(''); setPriceUSD(''); setMinStock('');
        setSimilarWarning([]); setForceCreate(false);
      }
    }, 100);
  };

  const handleRemoveItem = (index: number) => setItems(prev => prev.filter((_, i) => i !== index));

  const totalUSD = items.reduce((s, i) => s + i.unitCostUSD * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier || items.length === 0) { alert('Indique proveedor y agregue al menos un producto.'); return; }
    setSaving(true);
    try { await onSubmit({ supplier, items }); }
    finally { setSaving(false); }
  };

  return (
    <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass-card p-5 md:p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-border/50 pb-4">
        <h3 className="font-bold text-xl text-primary uppercase">Registrar Compra de Varios Productos</h3>
        <button type="button" onClick={onCancel} className="text-text-muted hover:text-danger p-2 transition" aria-label="Cerrar"><X size={24} /></button>
      </div>

      <SupplierSelector suppliers={suppliers} selectedSupplierName={supplier} onChange={setSupplier} onNewSupplier={handleNewSupplier} />

      <div className="border border-primary/30 bg-primary/5 rounded-xl p-4 space-y-4">
        <h4 className="font-bold text-base text-primary flex items-center gap-2">
          <Plus size={18} /> Paso 1: Añadir productos a la lista
        </h4>

        <div className="flex gap-2">
          <button type="button" onClick={() => setIsNewProduct(false)} className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${!isNewProduct ? 'bg-primary text-white shadow-md' : 'bg-surface/50 border border-border text-text-secondary'}`}>Producto existente</button>
          <button type="button" onClick={() => setIsNewProduct(true)} className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${isNewProduct ? 'bg-primary text-white shadow-md' : 'bg-surface/50 border border-border text-text-secondary'}`}>Producto nuevo</button>
        </div>

        {!isNewProduct ? (
          <div>
            <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary">
              <option value="">Seleccione un producto del inventario</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-text-secondary mb-1">Código</label><input value={productCode} onChange={(e) => setProductCode(e.target.value)} placeholder="Ej. VT-020" className="w-full bg-surface border border-border rounded-xl p-3 text-sm outline-none focus:border-primary" /></div>
            <div><label className="block text-xs font-medium text-text-secondary mb-1">Nombre</label><input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Ej. Audífono senc Tecno" className="w-full bg-surface border border-border rounded-xl p-3 text-sm outline-none focus:border-primary" /></div>
            <div><label className="block text-xs font-medium text-text-secondary mb-1">Categoría</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-surface border border-border rounded-xl p-3 text-sm outline-none focus:border-primary">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="block text-xs font-medium text-text-secondary mb-1">Precio venta USD</label><input type="number" step="0.01" min="0" value={priceUSD} onChange={(e) => setPriceUSD(e.target.value)} placeholder="0.00" className="w-full bg-surface border border-border rounded-xl p-3 text-sm outline-none focus:border-primary" /></div>
            <div><label className="block text-xs font-medium text-text-secondary mb-1">Stock mínimo</label><input type="number" min="0" value={minStock} onChange={(e) => setMinStock(e.target.value)} placeholder="0" className="w-full bg-surface border border-border rounded-xl p-3 text-sm outline-none focus:border-primary" /></div>
          </div>
        )}

        {similarWarning.length > 0 && (
          <div className="bg-warning/10 border border-warning/40 rounded-lg p-3 space-y-2 mt-2">
            <div className="flex items-start gap-2">
              <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning">Productos similares encontrados:</p>
                <ul className="list-disc pl-4 text-text-secondary">
                  {similarWarning.map(p => <li key={p.id}>{p.name} ({p.code}) — Stock: {p.stock}</li>)}
                </ul>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => { setSimilarWarning([]); setForceCreate(false); }} className="flex-1 py-2 bg-surface/50 border border-border rounded-lg text-sm hover:bg-surface/70 transition">Usar existente</button>
              <button type="button" onClick={handleForceCreate} className="flex-1 py-2 bg-warning text-white rounded-lg text-sm font-bold hover:bg-warning/80 transition">Crear de todas formas</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div><label className="block text-xs font-medium text-text-secondary mb-1">Cantidad a comprar</label><input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className="w-full bg-surface border border-border rounded-xl p-3 text-base font-bold outline-none focus:border-primary" /></div>
          <div><label className="block text-xs font-medium text-text-secondary mb-1">Costo unitario USD</label><input type="number" step="0.01" min="0" value={unitCostUSD} onChange={(e) => setUnitCostUSD(e.target.value)} placeholder="0.00" className="w-full bg-surface border border-border rounded-xl p-3 text-base font-bold outline-none focus:border-primary" /></div>
        </div>

        <button type="button" onClick={handleAddItem} className="w-full py-4 bg-orange-500 text-white hover:bg-orange-600 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition shadow-lg shadow-orange-500/30 mt-2 border-2 border-orange-400">
          <Plus size={24} /> AÑADIR A LA LISTA
        </button>
      </div>

      <div className="bg-surface-dark/50 p-4 rounded-xl border border-border">
        <h4 className="font-bold text-lg mb-3 flex items-center gap-2">Paso 2: Lista de compra <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">{items.length}</span></h4>
        
        {items.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-4">No has agregado productos aún. Usa el botón naranja de arriba.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-surface rounded-lg p-3 text-sm border border-border/50">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base truncate">{item.productName}</p>
                  <p className="text-text-muted text-xs">{item.productCode} · {item.quantity} unid. × ${item.unitCostUSD.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3 ml-2">
                  <span className="font-bold text-primary text-lg">${(item.quantity * item.unitCostUSD).toFixed(2)}</span>
                  <button type="button" onClick={() => handleRemoveItem(index)} className="text-danger hover:bg-danger/10 p-2 rounded-lg bg-surface/50 transition"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-4 bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
            <p className="text-sm font-medium text-text-secondary">Total a pagar al proveedor:</p>
            <p className="font-extrabold text-primary text-3xl">${totalUSD.toFixed(2)}</p>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving || items.length === 0} className="flex-1 py-4 bg-gradient-to-r from-primary to-accent rounded-xl font-bold text-white text-lg transition hover:from-primary-dark hover:to-accent-light disabled:opacity-50 shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
          {saving ? 'Guardando Compra...' : 'REGISTRAR COMPRA COMPLETA'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-4 border border-border rounded-xl text-base font-medium text-text-secondary hover:bg-surface/50 transition">Cancelar</button>
      </div>
    </motion.form>
  );
}
