import { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Product, Sale, Transaction } from '../../types';

const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

interface Props {
  products: Product[];
  sales: Sale[];                // ventas del día (o todas, según se pase)
  transactions: Transaction[];  // egresos
}

export default function DashboardCharts({ products, sales, transactions }: Props) {
  // Ventas por categoría (basado en los items vendidos)
  const salesByCategory = useMemo(() => {
    const catMap: Record<string, number> = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const category = product?.category || 'Sin categoría';
        catMap[category] = (catMap[category] || 0) + item.subtotalUSD;
      });
    });
    return Object.entries(catMap).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
  }, [sales, products]);

  // Ingresos (ventas) vs Egresos por día (últimos 7 días)
  const financeByDay = useMemo(() => {
    const days: Record<string, { income: number; expense: number }> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      days[key] = { income: 0, expense: 0 };
    }

    // Sumar ventas por día como ingreso
    sales.forEach(sale => {
      const day = sale.createdAt.split('T')[0];
      if (days[day] !== undefined) {
        days[day].income += sale.totalUSD;
      }
    });

    // Sumar egresos por día
    transactions.forEach(t => {
      const day = t.createdAt.split('T')[0];
      if (days[day] !== undefined) {
        days[day].expense += t.amountUSD;
      }
    });

    return Object.entries(days).map(([date, vals]) => ({
      date: date.slice(5), // MM-DD
      Ingresos: parseFloat(vals.income.toFixed(2)),
      Egresos: parseFloat(vals.expense.toFixed(2)),
    }));
  }, [sales, transactions]);

  // Distribución del inventario por categoría (valor costo)
  const inventoryByCategory = useMemo(() => {
    const catMap: Record<string, number> = {};
    products.forEach(p => {
      const val = p.costUSD * p.stock;
      catMap[p.category] = (catMap[p.category] || 0) + val;
    });
    return Object.entries(catMap).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
  }, [products]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Ventas por categoría */}
      <div className="glass-card p-4 md:p-6">
        <h3 className="text-lg font-bold mb-4">Ventas Hoy por Categoría</h3>
        {salesByCategory.length === 0 ? (
          <p className="text-text-muted text-sm">Sin ventas registradas hoy.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={salesByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {salesByCategory.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Ingresos vs Egresos */}
      <div className="glass-card p-4 md:p-6">
        <h3 className="text-lg font-bold mb-4">Ingresos (ventas) vs Egresos (7 días)</h3>
        {financeByDay.length === 0 ? (
          <p className="text-text-muted text-sm">Sin movimientos.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={financeByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Egresos" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Valor inventario por categoría */}
      <div className="glass-card p-4 md:p-6 lg:col-span-2">
        <h3 className="text-lg font-bold mb-4">Valor del Inventario por Categoría (costo)</h3>
        {inventoryByCategory.length === 0 ? (
          <p className="text-text-muted text-sm">Inventario vacío.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={inventoryByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {inventoryByCategory.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}