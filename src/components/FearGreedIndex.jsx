import { FearGreedSkeleton } from './Skeleton';

const FearGreedIndex = ({ data, loading = false }) => {
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

  const color = getColor(value);
  const sentiment = getSentiment(value);

  return (
    <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-[#a1a7bb] text-sm font-medium mb-1">Fear & Greed Index</h3>
        <p className="text-lg font-bold text-white">Market Sentiment</p>
      </div>

      {/* Gauge */}
      <div className="relative flex flex-col items-center">
        {/* Semi-circle gauge background */}
        <div className="relative w-48 h-24 overflow-hidden">
          {/* Gradient arc */}
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
            }}
          />
          
          {/* Inner cut-out */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-[#1a2332] rounded-t-full" />
          
          {/* Needle */}
          <div
            className="absolute bottom-0 left-1/2 origin-bottom transition-transform duration-1000 ease-out"
            style={{
              transform: `translateX(-50%) rotate(${rotation}deg)`,
            }}
          >
            <div className="w-1 h-16 bg-white rounded-full shadow-lg" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
          </div>
        </div>

        {/* Value display */}
        <div className="mt-4 text-center">
          <span
            className="text-4xl font-bold"
            style={{ color }}
          >
            {value}
          </span>
          <p
            className="text-lg font-semibold mt-1"
            style={{ color }}
          >
            {sentiment}
          </p>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between w-full mt-4 text-xs text-[#a1a7bb]">
          <span>Extreme Fear</span>
          <span>Extreme Greed</span>
        </div>
      </div>

      {/* Historical mini chart */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <p className="text-xs text-[#a1a7bb] mb-3">Last 7 Days</p>
        <div className="flex items-end justify-between h-12 gap-1">
          {history.map((day, index) => (
            <div
              key={day.date}
              className="flex-1 rounded-t transition-all duration-200 hover:opacity-80 cursor-pointer"
              style={{
                height: `${(day.value / 100) * 100}%`,
                backgroundColor: getColor(day.value),
                opacity: index === history.length - 1 ? 1 : 0.6,
              }}
              title={`${day.date}: ${day.value} (${getSentiment(day.value)})`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FearGreedIndex;
