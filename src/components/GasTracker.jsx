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
        // Fallback to mock data
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
    // Refresh every 15 seconds
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
    },
    {
      type: 'standard',
      label: 'Standard',
      icon: Fuel,
      data: gasData.standard,
      color: '#00d4aa',
    },
    {
      type: 'fast',
      label: 'Fast',
      icon: Zap,
      data: gasData.fast,
      color: '#f7931a',
    },
  ];

  return (
    <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[#a1a7bb] text-sm font-medium mb-1">ETH Gas Tracker</h3>
          <p className="text-lg font-bold text-white">Current Gas Prices</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-[#a1a7bb]">
            <Flame className="w-4 h-4 text-[#f7931a]" />
            <span>Base: {gasData.baseFee} Gwei</span>
          </div>
          <button
            onClick={loadGasData}
            disabled={loading}
            className="p-1.5 text-[#a1a7bb] hover:text-white hover:bg-[#242d3d] rounded-lg transition-all disabled:opacity-50"
            title="Refresh gas prices"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Gas Cards */}
      <div className="grid grid-cols-3 gap-3">
        {gasLevels.map(({ type, label, icon: Icon, data, color }) => (
          <div
            key={type}
            className="bg-[#0d1421] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer group"
          >
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>

            {/* Label */}
            <p className="text-[#a1a7bb] text-xs font-medium mb-1">{label}</p>

            {/* Price */}
            <p className="text-white text-xl font-bold mb-1">
              {loading ? (
                <span className="inline-block w-12 h-6 bg-[#242d3d] rounded animate-pulse" />
              ) : (
                <>
                  {data.price}
                  <span className="text-sm font-normal text-[#a1a7bb] ml-1">Gwei</span>
                </>
              )}
            </p>

            {/* Time */}
            <p className="text-xs text-[#a1a7bb] mb-2">{data.time}</p>

            {/* Cost */}
            <div className="pt-2 border-t border-white/5">
              <p className="text-xs text-[#a1a7bb]">
                Est. Cost:{' '}
                {loading ? (
                  <span className="inline-block w-10 h-3 bg-[#242d3d] rounded animate-pulse" />
                ) : (
                  <span className="text-white font-medium">${data.costUsd.toFixed(2)}</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#a1a7bb]">
        <span>
          {gasData.lastBlock ? (
            <>Last Block: #{gasData.lastBlock.toLocaleString()}</>
          ) : (
            <>Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}</>
          )}
        </span>
        <span className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full animate-pulse ${USE_MOCK_DATA ? 'bg-[#00d4aa]' : isUsingMockData ? 'bg-[#f7931a]' : 'bg-[#00d4aa]'}`} />
          {USE_MOCK_DATA ? 'Live' : isUsingMockData ? 'Demo' : 'Live'}
        </span>
      </div>
    </div>
  );
};

export default GasTracker;
