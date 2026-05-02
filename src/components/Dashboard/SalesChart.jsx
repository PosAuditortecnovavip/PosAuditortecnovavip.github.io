import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { name: 'Ene', ventas: 12000 },
  { name: 'Feb', ventas: 15000 },
  { name: 'Mar', ventas: 18000 },
  { name: 'Abr', ventas: 14000 },
  { name: 'May', ventas: 22000 },
  { name: 'Jun', ventas: 25000 },
];

export const SalesChart = () => {
  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-accent-purple/20 flex items-center justify-center">
            <TrendingUp className="text-accent-purple" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-white">Ventas Totales</h3>
        </div>
        <span className="text-accent-green text-sm font-medium">+5.7%</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Bar dataKey="ventas" fill="url(#colorVentas)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
