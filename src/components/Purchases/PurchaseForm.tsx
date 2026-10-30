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
    <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass-card p-5 md:p-6 space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">Registrar Compra</h3>
        <button type="button" onClick={onCancel} className="text-text-muted hover:text-text-primary p-2" aria-label="Cerrar"><X size={22} /></button>
      </div>

      <SupplierSelector suppliers={suppliers} selectedSupplierName={supplier} onChange={setSupplier} onNewSupplier={handleNewSupplier} />

      <div className="border border-border/50 rounded-xl p-4 space-y-4">
        <h4 className="font-bold text-base">Agregar producto</h4>

        <div className="flex gap-2">
          <button type="button" onClick={() => setIsNewProduct(false)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${!isNewProduct ? 'bg-primary/20 border-2 border-primary text-primary' : 'bg-surface/30 border-2 border-transparent'}`}>Producto existente</button>
          <button type="button" onClick={() => setIsNewProduct(true)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${isNewProduct ? 'bg-primary/20 border-2 border-primary text-primary' : 'bg-surface/30 border-2 border-transparent'}`}>Producto nuevo</button>
        </div>

        {!isNewProduct ? (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Producto</label>
            <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary">
              <option value="">Seleccione un producto</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-text-secondary mb-1">Código</label><input value={productCode} onChange={(e) => setProductCode(e.target.value)} placeholder="Ej. VT-020" className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary" /></div>
            <div><label className="block text-sm font-medium text-text-secondary mb-1">Nombre</label><input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Ej. Audífono senc Tecno" className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary" /></div>
            <div><label className="block text-sm font-medium text-text-secondary mb-1">Categoría</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-text-secondary mb-1">Precio venta USD</label><input type="number" step="0.01" min="0" value={priceUSD} onChange={(e) => setPriceUSD(e.target.value)} placeholder="0.00" className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary" /></div>
            <div><label className="block text-sm font-medium text-text-secondary mb-1">Stock mínimo</label><input type="number" min="0" value={minStock} onChange={(e) => setMinStock(e.target.value)} placeholder="0" className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary" /></div>
          </div>
        )}

        {similarWarning.length > 0 && (
          <div className="bg-warning/10 border border-warning/40 rounded-lg p-3 space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning">Productos similares encontrados:</p>
                <ul className="list-disc pl-4 text-text-secondary">
                  {similarWarning.map(p => <li key={p.id}>{p.name} ({p.code}) — Stock: {p.stock}</li>)}
                </ul>
                <p className="text-xs text-text-muted mt-1">¿Está seguro de que desea crear un nuevo producto o prefiere usar uno existente?</p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => { setSimilarWarning([]); setForceCreate(false); }} className="flex-1 py-2 bg-surface/50 border border-border rounded-lg text-sm hover:bg-surface/70 transition">Usar existente</button>
              <button type="button" onClick={handleForceCreate} className="flex-1 py-2 bg-warning text-white rounded-lg text-sm font-bold hover:bg-warning/80 transition">Crear de todas formas</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-text-secondary mb-1">Cantidad</label><input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary" /></div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1">Costo unitario USD</label><input type="number" step="0.01" min="0" value={unitCostUSD} onChange={(e) => setUnitCostUSD(e.target.value)} placeholder="0.00" className="w-full bg-surface border border-border rounded-xl p-3.5 text-base outline-none focus:border-primary" /></div>
        </div>

        <button type="button" onClick={handleAddItem} className="w-full py-2.5 bg-primary/20 text-primary hover:bg-primary/30 rounded-xl font-bold text-sm flex items-center justify-center gap-2"><Plus size={16} /> Agregar a la compra</button>
      </div>

      <div className="space-y-2">
        <h4 className="font-bold text-base">Productos en esta compra ({items.length})</h4>
        {items.length === 0 ? <p className="text-text-muted text-sm">Aún no hay productos.</p> : items.map((item, index) => (
          <div key={index} className="flex justify-between items-center bg-surface/30 rounded-lg p-3 text-sm">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.productName}</p>
              <p className="text-text-muted text-xs">{item.productCode} · {item.quantity} × ${item.unitCostUSD.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <span className="font-bold text-primary">${(item.quantity * item.unitCostUSD).toFixed(2)}</span>
              <button type="button" onClick={() => handleRemoveItem(index)} className="text-danger hover:bg-danger/10 p-1.5 rounded"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && <div className="bg-surface/30 rounded-xl p-3 text-base"><strong>Total de la compra:</strong> ${totalUSD.toFixed(2)}</div>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving || items.length === 0} className="flex-1 py-3.5 bg-gradient-to-r from-primary to-accent rounded-xl font-bold text-white text-base transition hover:from-primary-dark hover:to-accent-light disabled:opacity-50">{saving ? 'Guardando...' : 'Registrar Compra'}</button>
        <button type="button" onClick={onCancel} className="px-5 py-3.5 border border-border rounded-xl text-base text-text-secondary hover:bg-surface/50 transition">Cancelar</button>
      </div>
    </motion.form>
  );
}
