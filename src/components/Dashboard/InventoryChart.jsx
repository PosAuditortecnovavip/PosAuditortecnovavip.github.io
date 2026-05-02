import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChartIcon } from 'lucide-react';

const data = [
  { name: 'Electrónicos', value: 40 },
  { name: 'Periféricos', value: 25 },
  { name: 'Componentes', value: 20 },
  { name: 'Accesorios', value: 15 },
];

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981'];

export const InventoryChart = () => {
  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <PieChartIcon className="text-purple-400" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-white">Distribución</h3>
        </div>
        <span className="text-xs text-gray-500">Por categoría</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              labelStyle={{ color: '#e5e7eb' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center space-x-4 mt-2">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
            <span className="text-xs text-gray-400">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};