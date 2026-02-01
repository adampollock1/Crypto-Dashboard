import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { dominanceData as mockDominanceData } from '../data/mockData';

const DominanceChart = ({ data }) => {
  // Use provided data or fall back to mock data
  const dominanceData = data || mockDominanceData;

  // Custom label render
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.1) return null; // Don't show label for small slices

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a2332] border border-white/10 rounded-lg p-3 shadow-xl">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: payload[0].payload.color }}
            />
            <span className="text-white font-medium">{payload[0].name}</span>
          </div>
          <p className="text-[#a1a7bb] text-sm mt-1">
            {payload[0].value.toFixed(1)}% Market Share
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-[#a1a7bb] text-sm font-medium mb-1">Market Dominance</h3>
        <p className="text-xl font-bold text-white">Bitcoin vs Altcoins</p>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dominanceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {dominanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {dominanceData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-[#a1a7bb]">{item.name}</span>
            <span className="text-sm font-medium text-white">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DominanceChart;
