<<<<<<< HEAD
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
      className="glass-card p-5 space-y-5"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">
          {product ? 'Editar Producto' : 'Nuevo Producto'}
        </h3>
        <button type="button" onClick={onCancel} className="text-text-muted hover:text-text-primary p-2">
          <X size={22} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código (ej. VT-016)"
          required
          className="bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del producto"
          required
          className="bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          min="0"
          value={costUSD}
          onChange={(e) => setCostUSD(e.target.value)}
          placeholder="Costo USD"
          required
          className="bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
        />
        <input
          type="number"
          step="0.01"
          min="0"
          value={priceUSD}
          onChange={(e) => setPriceUSD(e.target.value)}
          placeholder="Precio venta USD"
          required
          className="bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
        />
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock inicial"
          required
          className="bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
        />
        <input
          type="number"
          min="0"
          value={minStock}
          onChange={(e) => setMinStock(e.target.value)}
          placeholder="Stock mínimo"
          required
          className="bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 py-4 bg-gradient-to-r from-primary to-accent rounded-xl font-bold text-white text-base sm:text-lg transition hover:from-primary-dark hover:to-accent-light"
        >
          {product ? 'Guardar cambios' : 'Guardar Producto'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-4 border border-border rounded-xl text-base sm:text-lg hover:bg-surface/50 transition"
        >
          Cancelar
        </button>
      </div>
    </motion.form>
  );
=======
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
      className="glass-card p-5 space-y-5"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">
          {product ? 'Editar Producto' : 'Nuevo Producto'}
        </h3>
        <button type="button" onClick={onCancel} className="text-text-muted hover:text-text-primary p-2">
          <X size={22} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código (ej. VT-016)"
          required
          className="bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del producto"
          required
          className="bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          min="0"
          value={costUSD}
          onChange={(e) => setCostUSD(e.target.value)}
          placeholder="Costo USD"
          required
          className="bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
        />
        <input
          type="number"
          step="0.01"
          min="0"
          value={priceUSD}
          onChange={(e) => setPriceUSD(e.target.value)}
          placeholder="Precio venta USD"
          required
          className="bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
        />
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock inicial"
          required
          className="bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
        />
        <input
          type="number"
          min="0"
          value={minStock}
          onChange={(e) => setMinStock(e.target.value)}
          placeholder="Stock mínimo"
          required
          className="bg-surface/50 border border-border rounded-xl p-4 text-base text-text-primary outline-none focus:border-primary"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 py-4 bg-gradient-to-r from-primary to-accent rounded-xl font-bold text-white text-base sm:text-lg transition hover:from-primary-dark hover:to-accent-light"
        >
          {product ? 'Guardar cambios' : 'Guardar Producto'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-4 border border-border rounded-xl text-base sm:text-lg hover:bg-surface/50 transition"
        >
          Cancelar
        </button>
      </div>
    </motion.form>
  );
>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
}