<<<<<<< HEAD
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

interface Props {
  weeklySales: { date: string; total: number }[];
  topProducts: { name: string; qty: number }[];
}

export default function AdvancedCharts({ weeklySales, topProducts }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="glass-card p-4 md:p-6">
        <h3 className="text-lg font-bold mb-4">Ventas diarias (7 días)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeklySales}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#06b6d4" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="glass-card p-4 md:p-6">
        <h3 className="text-lg font-bold mb-4">Productos más vendidos</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topProducts} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} width={120} />
            <Tooltip />
            <Bar dataKey="qty" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
=======
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

interface Props {
  weeklySales: { date: string; total: number }[];
  topProducts: { name: string; qty: number }[];
}

export default function AdvancedCharts({ weeklySales, topProducts }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="glass-card p-4 md:p-6">
        <h3 className="text-lg font-bold mb-4">Ventas diarias (7 días)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeklySales}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#06b6d4" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="glass-card p-4 md:p-6">
        <h3 className="text-lg font-bold mb-4">Productos más vendidos</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topProducts} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} width={120} />
            <Tooltip />
            <Bar dataKey="qty" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
}