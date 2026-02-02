import { useState, useEffect } from 'react';
import { Fuel, Zap, Clock, Flame, RefreshCw } from 'lucide-react';
import { gasData as mockGasData, USE_MOCK_DATA } from '../data/mockData';
import { fetchGasPrice } from '../services/api';

const GasTracker = () => {
  const [gasData, setGasData] = useState(mockGasData);
  const [loading, setLoading] = useState(true);
  const [isUsingMockData, setIsUsingMockData] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadGasData = async () => {
    setLoading(true);
    try {
      const data = await fetchGasPrice();
      if (data) {
        setGasData(data);
        setIsUsingMockData(false);
        setLastUpdated(new Date());
      } else {
        setGasData(mockGasData);
        setIsUsingMockData(true);
      }
    } catch (err) {
      console.error('Failed to fetch gas prices:', err);
      setGasData(mockGasData);
      setIsUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGasData();
    const interval = setInterval(loadGasData, 15000);
    return () => clearInterval(interval);
  }, []);

  const gasLevels = [
    {
      type: 'slow',
      label: 'Slow',
      icon: Clock,
      data: gasData.slow,
      color: '#3861fb',
      gradient: 'from-[#3861fb]/20 to-[#3861fb]/10',
    },
    {
      type: 'standard',
      label: 'Standard',
      icon: Fuel,
      data: gasData.standard,
      color: '#00d4aa',
      gradient: 'from-[#00d4aa]/20 to-[#00d4aa]/10',
    },
    {
      type: 'fast',
      label: 'Fast',
      icon: Zap,
      data: gasData.fast,
      color: '#f7931a',
      gradient: 'from-[#f7931a]/20 to-[#f7931a]/10',
    },
  ];

  return (
    <div className="group bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f7931a]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#f7931a]/20 to-[#f7931a]/10 rounded-xl flex items-center justify-center">
            <Flame className="w-5 h-5 text-[#f7931a]" />
          </div>
          <div>
            <h3 className="text-[#a1a7bb] text-sm font-medium">ETH Gas Tracker</h3>
            <p className="text-lg font-bold text-white">Gas Prices</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-[#a1a7bb] px-2.5 py-1.5 bg-[#0d1421]/50 rounded-lg">
            <span className="text-[#f7931a]">Base:</span>
            <span className="text-white font-medium tabular-nums">{gasData.baseFee} Gwei</span>
          </div>
          <button
            onClick={loadGasData}
            disabled={loading}
            className="p-2 text-[#a1a7bb] hover:text-white hover:bg-white/10 rounded-lg transition-all btn-icon disabled:opacity-50"
            title="Refresh gas prices"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Gas Cards */}
      <div className="grid grid-cols-3 gap-3 relative">
        {gasLevels.map(({ type, label, icon: Icon, data, color, gradient }) => (
          <div
            key={type}
            className="group/card relative bg-[#0d1421]/80 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Hover gradient */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover/card:opacity-100 transition-opacity duration-300`}
            />
            
            <div className="relative">
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover/card:scale-110"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>

              {/* Label */}
              <p className="text-[#a1a7bb] text-xs font-medium mb-1 uppercase tracking-wide">{label}</p>

              {/* Price */}
              <p className="text-white text-2xl font-bold mb-1 tabular-nums">
                {loading ? (
                  <span className="inline-block w-12 h-7 bg-[#242d3d] rounded shimmer" />
                ) : (
                  <>
                    {data.price}
                    <span className="text-sm font-normal text-[#a1a7bb] ml-1">Gwei</span>
                  </>
                )}
              </p>

              {/* Time */}
              <p className="text-xs text-[#a1a7bb] mb-3">{data.time}</p>

              {/* Cost */}
              <div className="pt-3 border-t border-white/5">
                <p className="text-xs text-[#a1a7bb]">
                  Est. Cost:{' '}
                  {loading ? (
                    <span className="inline-block w-10 h-3 bg-[#242d3d] rounded shimmer" />
                  ) : (
                    <span className="text-white font-semibold tabular-nums">${data.costUsd.toFixed(2)}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#a1a7bb] relative">
        <span>
          {gasData.lastBlock ? (
            <span className="tabular-nums">Last Block: #{gasData.lastBlock.toLocaleString()}</span>
          ) : (
            <>Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}</>
          )}
        </span>
        <span className="flex items-center gap-2 px-2.5 py-1 bg-[#0d1421]/50 rounded-full">
          <span className={`w-2 h-2 rounded-full pulse-dot ${USE_MOCK_DATA ? 'bg-[#00d4aa]' : isUsingMockData ? 'bg-[#f7931a]' : 'bg-[#00d4aa]'}`} />
          <span className="font-medium">{USE_MOCK_DATA ? 'Live' : isUsingMockData ? 'Demo' : 'Live'}</span>
        </span>
      </div>
    </div>
  );
};

export default GasTracker;
