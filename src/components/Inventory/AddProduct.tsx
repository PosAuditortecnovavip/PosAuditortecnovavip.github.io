import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Product } from '../../types';

interface Props {
  product?: Product | null;
  onSave: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const categories = ['Protección', 'Cargadores', 'Audio', 'Accesorios'];

export default function AddProduct({ product, onSave, onCancel }: Props) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [costUSD, setCostUSD] = useState('');
  const [priceUSD, setPriceUSD] = useState('');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('');

  useEffect(() => {
    if (product) {
      setCode(product.code || '');
      setName(product.name || '');
      setCategory(product.category || categories[0]);
      setCostUSD(product.costUSD?.toString() || '');
      setPriceUSD(product.priceUSD?.toString() || '');
      setStock(product.stock?.toString() || '');
      setMinStock(product.minStock?.toString() || '');
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(costUSD);
    const price = parseFloat(priceUSD);
    const qty = parseInt(stock);
    const minQty = parseInt(minStock);
    if (!code || !name || isNaN(cost) || isNaN(price) || isNaN(qty) || isNaN(minQty)) return;

    onSave({
      code,
      name,
      category,
      costUSD: cost,
      priceUSD: price,
      stock: qty,
      minStock: minQty,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="glass-card p-5 md:p-6 space-y-5"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">{product ? 'Editar Producto' : 'Nuevo Producto'}</h3>
        <button type="button" onClick={onCancel} className="text-text-muted hover:text-text-primary p-2" aria-label="Cerrar formulario">
          <X size={22} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="product-code" className="block text-sm font-medium text-text-secondary mb-1">Código</label>
          <input id="product-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ej. VT-016" required className="w-full bg-surface/50 border border-border rounded-xl p-3.5 text-base text-text-primary outline-none focus:border-primary transition" />
        </div>
        <div>
          <label htmlFor="product-name" className="block text-sm font-medium text-text-secondary mb-1">Nombre del producto</label>
          <input id="product-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Vidrio Templado iPhone 15" required className="w-full bg-surface/50 border border-border rounded-xl p-3.5 text-base text-text-primary outline-none focus:border-primary transition" />
        </div>
        <div>
          <label htmlFor="product-category" className="block text-sm font-medium text-text-secondary mb-1">Categoría</label>
          <select id="product-category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-surface/50 border border-border rounded-xl p-3.5 text-base text-text-primary outline-none focus:border-primary transition">
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="product-cost" className="block text-sm font-medium text-text-secondary mb-1">Costo USD</label>
          <input id="product-cost" type="number" step="0.01" min="0" value={costUSD} onChange={(e) => setCostUSD(e.target.value)} placeholder="0.00" required className="w-full bg-surface/50 border border-border rounded-xl p-3.5 text-base text-text-primary outline-none focus:border-primary transition" />
        </div>
        <div>
          <label htmlFor="product-price" className="block text-sm font-medium text-text-secondary mb-1">Precio venta USD</label>
          <input id="product-price" type="number" step="0.01" min="0" value={priceUSD} onChange={(e) => setPriceUSD(e.target.value)} placeholder="0.00" required className="w-full bg-surface/50 border border-border rounded-xl p-3.5 text-base text-text-primary outline-none focus:border-primary transition" />
        </div>
        <div>
          <label htmlFor="product-stock" className="block text-sm font-medium text-text-secondary mb-1">Stock inicial</label>
          <input id="product-stock" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" required className="w-full bg-surface/50 border border-border rounded-xl p-3.5 text-base text-text-primary outline-none focus:border-primary transition" />
        </div>
        <div>
          <label htmlFor="product-minstock" className="block text-sm font-medium text-text-secondary mb-1">Stock mínimo</label>
          <input id="product-minstock" type="number" min="0" value={minStock} onChange={(e) => setMinStock(e.target.value)} placeholder="0" required className="w-full bg-surface/50 border border-border rounded-xl p-3.5 text-base text-text-primary outline-none focus:border-primary transition" />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 py-3.5 bg-gradient-to-r from-primary to-accent rounded-xl font-bold text-white text-base md:text-lg transition hover:from-primary-dark hover:to-accent-light focus:outline-none focus:ring-2 focus:ring-primary">
          {product ? 'Guardar cambios' : 'Guardar Producto'}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-3.5 border border-border rounded-xl text-base md:text-lg text-text-secondary hover:bg-surface/50 transition">Cancelar</button>
      </div>
    </motion.form>
  );
}