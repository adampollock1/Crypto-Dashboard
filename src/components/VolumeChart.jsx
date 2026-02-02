import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { volumeHistory, marketStats as mockMarketStats, formatNumber } from '../data/mockData';

const VolumeChart = ({ marketStats }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Use provided marketStats or fall back to mock data
  const stats = marketStats || mockMarketStats;

  // Get last 14 days of data for cleaner visualization
  const data = volumeHistory.slice(-14);
  const volumeChange = stats.total24hVolumeChange || 0;
  const isPositive = volumeChange >= 0;

  // Find max value for highlighting
  const maxValue = Math.max(...data.map(d => d.value));

  // Custom tooltip with glassmorphism
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const isMax = payload[0].value === maxValue;
      return (
        <div className="glass-card-solid rounded-xl p-4 shadow-2xl shadow-black/30 border border-white/10 min-w-[140px]">
          <p className="text-[#a1a7bb] text-xs mb-2 font-medium">{payload[0].payload.formattedDate}</p>
          <p className="text-white font-bold text-lg tabular-nums">
            {formatNumber(payload[0].value)}
          </p>
          {isMax && (
            <p className="text-[#00d4aa] text-xs font-medium mt-1">Highest Volume</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="group bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00d4aa]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Header */}
      <div className="mb-6 relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-[#00d4aa]/10 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-[#00d4aa]" />
          </div>
          <h3 className="text-[#a1a7bb] text-sm font-medium">24h Trading Volume</h3>
          {volumeChange !== 0 && (
            <span
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                isPositive
                  ? 'bg-[#00d4aa]/10 text-[#00d4aa]'
                  : 'bg-[#ea3943]/10 text-[#ea3943]'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="tabular-nums">{volumeChange.toFixed(2)}%</span>
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-white tabular-nums tracking-tight">
          {formatNumber(stats.total24hVolume || 0)}
        </p>
      </div>

      {/* Chart */}
      <div className="h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            onMouseMove={(e) => {
              if (e.activeTooltipIndex !== undefined) {
                setHoveredIndex(e.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3861fb" stopOpacity={1} />
                <stop offset="100%" stopColor="#3861fb" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="barGradientMax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d4aa" stopOpacity={1} />
                <stop offset="100%" stopColor="#00d4aa" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ffffff08"
              vertical={false}
            />
            <XAxis
              dataKey="formattedDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a7bb', fontSize: 10, fontWeight: 500 }}
              dy={10}
              interval={2}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a7bb', fontSize: 10, fontWeight: 500 }}
              dx={-10}
              tickFormatter={(value) => `${(value / 1e9).toFixed(0)}B`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 4 }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => {
                const isMax = entry.value === maxValue;
                const isHovered = index === hoveredIndex;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isMax ? 'url(#barGradientMax)' : 'url(#barGradient)'}
                    fillOpacity={isHovered ? 1 : isMax ? 1 : 0.7}
                    style={{
                      filter: isHovered ? 'brightness(1.1)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VolumeChart;
