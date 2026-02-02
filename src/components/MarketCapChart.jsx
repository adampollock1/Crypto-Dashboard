import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { marketCapHistory, marketStats as mockMarketStats, formatNumber } from '../data/mockData';

const timeFilters = ['7D', '30D', '3M', '1Y', 'ALL'];

const MarketCapChart = ({ marketStats }) => {
  const [activeFilter, setActiveFilter] = useState('30D');

  // Use provided marketStats or fall back to mock data
  const stats = marketStats || mockMarketStats;

  // Filter data based on selected time range
  const getFilteredData = () => {
    const days = {
      '7D': 7,
      '30D': 30,
      '3M': 90,
      '1Y': 365,
      'ALL': marketCapHistory.length,
    };
    return marketCapHistory.slice(-days[activeFilter]);
  };

  const data = getFilteredData();
  const isPositive = (stats.totalMarketCapChange || 0) >= 0;

  // Custom tooltip with glassmorphism
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card-solid rounded-xl p-4 shadow-2xl shadow-black/30 border border-white/10 min-w-[140px]">
          <p className="text-[#a1a7bb] text-xs mb-2 font-medium">{payload[0].payload.formattedDate}</p>
          <p className="text-white font-bold text-lg tabular-nums">
            {formatNumber(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="group bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3861fb]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#3861fb]/10 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#3861fb]" />
            </div>
            <h3 className="text-[#a1a7bb] text-sm font-medium">Total Crypto Market Cap</h3>
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
              <span className="tabular-nums">{isPositive ? '+' : ''}{(stats.totalMarketCapChange || 0).toFixed(2)}%</span>
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight">
            {formatNumber(stats.totalMarketCap || 0)}
          </p>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex gap-1 bg-[#0d1421]/80 rounded-xl p-1.5 backdrop-blur-sm">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`relative px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
                activeFilter === filter
                  ? 'text-white'
                  : 'text-[#a1a7bb] hover:text-white'
              }`}
            >
              {activeFilter === filter && (
                <span className="absolute inset-0 bg-gradient-to-r from-[#3861fb] to-[#3861fb]/80 rounded-lg" />
              )}
              <span className="relative z-10">{filter}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="marketCapGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3861fb" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#3861fb" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#3861fb" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="marketCapStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3861fb" />
                <stop offset="50%" stopColor="#00d4aa" />
                <stop offset="100%" stopColor="#3861fb" />
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
              tick={{ fill: '#a1a7bb', fontSize: 11, fontWeight: 500 }}
              dy={10}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a7bb', fontSize: 11, fontWeight: 500 }}
              dx={-10}
              tickFormatter={(value) => `${(value / 1e12).toFixed(1)}T`}
              domain={['dataMin - 100000000000', 'dataMax + 100000000000']}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3861fb', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3861fb"
              strokeWidth={2.5}
              fill="url(#marketCapGradient)"
              dot={false}
              activeDot={{ r: 6, fill: '#3861fb', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketCapChart;
