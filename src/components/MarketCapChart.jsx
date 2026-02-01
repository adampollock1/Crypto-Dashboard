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
import { TrendingUp, TrendingDown } from 'lucide-react';
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

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a2332] border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-[#a1a7bb] text-xs mb-1">{payload[0].payload.formattedDate}</p>
          <p className="text-white font-semibold">
            {formatNumber(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[#a1a7bb] text-sm font-medium">Total Crypto Market Cap</h3>
            <span
              className={`flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
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
              {isPositive ? '+' : ''}{(stats.totalMarketCapChange || 0).toFixed(2)}%
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {formatNumber(stats.totalMarketCap || 0)}
          </p>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex gap-1 bg-[#0d1421] rounded-lg p-1">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-[#3861fb] text-white'
                  : 'text-[#a1a7bb] hover:text-white hover:bg-white/5'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="marketCapGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3861fb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3861fb" stopOpacity={0} />
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
              tick={{ fill: '#a1a7bb', fontSize: 11 }}
              dy={10}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a7bb', fontSize: 11 }}
              dx={-10}
              tickFormatter={(value) => `${(value / 1e12).toFixed(1)}T`}
              domain={['dataMin - 100000000000', 'dataMax + 100000000000']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3861fb"
              strokeWidth={2}
              fill="url(#marketCapGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketCapChart;
