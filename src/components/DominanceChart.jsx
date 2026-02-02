import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { dominanceData as mockDominanceData } from '../data/mockData';

const DominanceChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  // Use provided data or fall back to mock data
  const dominanceData = data || mockDominanceData;

  // Custom active shape for hover effect
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 3}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{
            filter: 'drop-shadow(0 0 8px ' + fill + ')',
            transition: 'all 0.3s ease',
          }}
        />
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill="#ffffff"
          className="text-sm font-bold"
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fill="#a1a7bb"
          className="text-xs"
        >
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
  };

  // Custom label render
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    if (activeIndex !== null) return null; // Don't show labels when hovering
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.1) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-semibold"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Custom tooltip with glassmorphism
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card-solid rounded-xl p-4 shadow-2xl shadow-black/30 border border-white/10 min-w-[150px]">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full ring-2 ring-white/20"
              style={{ backgroundColor: payload[0].payload.color }}
            />
            <span className="text-white font-semibold">{payload[0].name}</span>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {payload[0].value.toFixed(1)}%
          </p>
          <p className="text-[#a1a7bb] text-xs mt-1">Market Dominance</p>
        </div>
      );
    }
    return null;
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="group bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f7931a]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Header */}
      <div className="mb-4 relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-[#f7931a]/10 rounded-lg flex items-center justify-center">
            <PieChartIcon className="w-4 h-4 text-[#f7931a]" />
          </div>
          <h3 className="text-[#a1a7bb] text-sm font-medium">Market Dominance</h3>
        </div>
        <p className="text-xl font-bold text-white">Bitcoin vs Altcoins</p>
      </div>

      {/* Chart */}
      <div className="h-48 relative">
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
              paddingAngle={3}
              dataKey="value"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              style={{ outline: 'none' }}
            >
              {dominanceData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 relative">
        {dominanceData.map((item, index) => (
          <div 
            key={item.name} 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
              activeIndex === index ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              className="w-2.5 h-2.5 rounded-full ring-2 ring-white/10"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-[#a1a7bb]">{item.name}</span>
            <span className="text-sm font-semibold text-white tabular-nums">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DominanceChart;
