import { useState } from 'react';
import { FearGreedSkeleton } from './Skeleton';
import { Gauge, TrendingUp, TrendingDown } from 'lucide-react';

const FearGreedIndex = ({ data, loading = false }) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  
  // Show skeleton while loading
  if (loading || !data) {
    return <FearGreedSkeleton />;
  }

  const { value, history = [] } = data;

  // Calculate the rotation for the gauge needle (-90 to 90 degrees)
  const rotation = (value / 100) * 180 - 90;

  // Get color based on value
  const getColor = (val) => {
    if (val <= 25) return '#ea3943'; // Extreme Fear - Red
    if (val <= 45) return '#f7931a'; // Fear - Orange
    if (val <= 55) return '#f3d42f'; // Neutral - Yellow
    if (val <= 75) return '#a3d963'; // Greed - Light Green
    return '#00d4aa'; // Extreme Greed - Green
  };

  // Get sentiment label
  const getSentiment = (val) => {
    if (val <= 25) return 'Extreme Fear';
    if (val <= 45) return 'Fear';
    if (val <= 55) return 'Neutral';
    if (val <= 75) return 'Greed';
    return 'Extreme Greed';
  };

  // Get emoji for sentiment
  const getEmoji = (val) => {
    if (val <= 25) return '😱';
    if (val <= 45) return '😰';
    if (val <= 55) return '😐';
    if (val <= 75) return '😊';
    return '🤑';
  };

  const color = getColor(value);
  const sentiment = getSentiment(value);

  // Calculate trend from history
  const previousValue = history.length > 1 ? history[history.length - 2]?.value : value;
  const trend = value - previousValue;

  return (
    <div className="group bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden">
      {/* Dynamic gradient overlay based on sentiment */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 100%, ${color}10 0%, transparent 60%)`,
        }}
      />
      
      {/* Header */}
      <div className="mb-4 relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#ea3943]/20 to-[#00d4aa]/20 rounded-lg flex items-center justify-center">
            <Gauge className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-[#a1a7bb] text-sm font-medium">Fear & Greed Index</h3>
        </div>
        <p className="text-xl font-bold text-white">Market Sentiment</p>
      </div>

      {/* Gauge */}
      <div className="relative flex flex-col items-center">
        {/* Semi-circle gauge background */}
        <div className="relative w-52 h-26 overflow-hidden">
          {/* Gradient arc with glow */}
          <div
            className="absolute inset-0 rounded-t-full"
            style={{
              background: `conic-gradient(
                from 180deg,
                #ea3943 0deg,
                #f7931a 45deg,
                #f3d42f 90deg,
                #a3d963 135deg,
                #00d4aa 180deg
              )`,
              filter: 'blur(0.5px)',
            }}
          />
          
          {/* Outer glow ring */}
          <div
            className="absolute -inset-1 rounded-t-full opacity-30"
            style={{
              background: `conic-gradient(
                from 180deg,
                #ea3943 0deg,
                #f7931a 45deg,
                #f3d42f 90deg,
                #a3d963 135deg,
                #00d4aa 180deg
              )`,
              filter: 'blur(8px)',
            }}
          />
          
          {/* Inner cut-out with subtle shadow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-18 bg-[#1a2332] rounded-t-full shadow-inner" />
          
          {/* Tick marks */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24">
            {[0, 25, 50, 75, 100].map((tick) => {
              const tickRotation = (tick / 100) * 180 - 90;
              return (
                <div
                  key={tick}
                  className="absolute bottom-0 left-1/2 origin-bottom"
                  style={{
                    transform: `translateX(-50%) rotate(${tickRotation}deg)`,
                  }}
                >
                  <div className="w-0.5 h-3 bg-white/30 rounded-full" style={{ marginBottom: '68px' }} />
                </div>
              );
            })}
          </div>
          
          {/* Needle with spring animation */}
          <div
            className="absolute bottom-0 left-1/2 origin-bottom"
            style={{
              transform: `translateX(-50%) rotate(${rotation}deg)`,
              transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Needle glow */}
            <div 
              className="absolute w-1.5 h-18 rounded-full blur-sm opacity-60"
              style={{ backgroundColor: color, left: '-1px' }}
            />
            {/* Needle body */}
            <div className="w-1 h-18 bg-white rounded-full shadow-lg" />
            {/* Needle base */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg ring-2 ring-white/20" />
          </div>
        </div>

        {/* Value display with glow */}
        <div className="mt-5 text-center relative">
          {/* Glow effect behind value */}
          <div 
            className="absolute inset-0 blur-xl opacity-30"
            style={{ backgroundColor: color }}
          />
          <div className="relative">
            <span
              className="text-5xl font-bold tabular-nums"
              style={{ 
                color,
                textShadow: `0 0 30px ${color}50`,
              }}
            >
              {value}
            </span>
            <div className="flex items-center justify-center gap-2 mt-2">
              <p
                className="text-lg font-semibold"
                style={{ color }}
              >
                {sentiment}
              </p>
              {trend !== 0 && (
                <span className={`flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                  trend > 0 
                    ? 'bg-[#00d4aa]/10 text-[#00d4aa]' 
                    : 'bg-[#ea3943]/10 text-[#ea3943]'
                }`}>
                  {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(trend)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between w-full mt-5 text-xs relative">
          <span className="text-[#ea3943] font-medium">Extreme Fear</span>
          <span className="text-[#00d4aa] font-medium">Extreme Greed</span>
        </div>
      </div>

      {/* Historical mini chart */}
      <div className="mt-6 pt-5 border-t border-white/5 relative">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-[#a1a7bb] font-medium">Last 7 Days</p>
          {hoveredBar !== null && history[hoveredBar] && (
            <p className="text-xs font-medium" style={{ color: getColor(history[hoveredBar].value) }}>
              {history[hoveredBar].date}: {history[hoveredBar].value}
            </p>
          )}
        </div>
        <div className="flex items-end justify-between h-14 gap-1.5">
          {history.map((day, index) => {
            const isToday = index === history.length - 1;
            const isHovered = index === hoveredBar;
            return (
              <div
                key={day.date}
                className="relative flex-1 rounded-t cursor-pointer group/bar"
                style={{
                  height: `${Math.max((day.value / 100) * 100, 10)}%`,
                  backgroundColor: getColor(day.value),
                  opacity: isHovered ? 1 : isToday ? 1 : 0.5,
                  transform: isHovered ? 'scaleY(1.1)' : 'scaleY(1)',
                  transformOrigin: 'bottom',
                  transition: 'all 0.2s ease',
                  boxShadow: isHovered ? `0 0 10px ${getColor(day.value)}50` : 'none',
                }}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0d1421] rounded-lg text-xs whitespace-nowrap z-10 border border-white/10 shadow-xl">
                    <span className="font-semibold" style={{ color: getColor(day.value) }}>{day.value}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Day labels */}
        <div className="flex justify-between mt-2 text-[10px] text-[#a1a7bb]">
          <span>7d ago</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default FearGreedIndex;
