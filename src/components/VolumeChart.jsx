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
import { TrendingUp, TrendingDown } from 'lucide-react';
import { volumeHistory, marketStats as mockMarketStats, formatNumber } from '../data/mockData';

const VolumeChart = ({ marketStats }) => {
  // Use provided marketStats or fall back to mock data
  const stats = marketStats || mockMarketStats;

  // Get last 14 days of data for cleaner visualization
  const data = volumeHistory.slice(-14);
  const volumeChange = stats.total24hVolumeChange || 0;
  const isPositive = volumeChange >= 0;

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

  // Find max value for highlighting
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-[#a1a7bb] text-sm font-medium">24h Trading Volume</h3>
          {volumeChange !== 0 && (
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
              {volumeChange.toFixed(2)}%
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-white">
          {formatNumber(stats.total24hVolume || 0)}
        </p>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ffffff08"
              vertical={false}
            />
            <XAxis
              dataKey="formattedDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a7bb', fontSize: 10 }}
              dy={10}
              interval={2}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a7bb', fontSize: 10 }}
              dx={-10}
              tickFormatter={(value) => `${(value / 1e9).toFixed(0)}B`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.value === maxValue ? '#00d4aa' : '#3861fb'}
                  fillOpacity={entry.value === maxValue ? 1 : 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VolumeChart;
