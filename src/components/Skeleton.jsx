import { USE_MOCK_DATA } from '../data/mockData';

/**
 * Reusable Skeleton Loader Components
 * Used to show loading states while data is being fetched
 */

// Base skeleton with shimmer animation
export const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`animate-pulse bg-[#242d3d] rounded ${className}`}
    {...props}
  />
);

// Skeleton for stat cards
export const StatCardSkeleton = () => (
  <div className="bg-[#1a2332] rounded-xl p-4 border border-white/5">
    <Skeleton className="h-3 w-20 mb-2" />
    <Skeleton className="h-7 w-28 mb-1" />
    <Skeleton className="h-3 w-16" />
  </div>
);

// Skeleton for ticker bar coins
export const TickerCoinSkeleton = () => (
  <div className="flex items-center gap-3 px-6 py-3 whitespace-nowrap border-r border-white/5">
    <Skeleton className="w-6 h-6 rounded-full" />
    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-10" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-14" />
    </div>
  </div>
);

// Simple skeleton for chart area only
export const ChartSkeleton = ({ height = 'h-80' }) => (
  <div className={`${height} w-full bg-[#242d3d] rounded-lg animate-pulse flex items-center justify-center`}>
    <div className="text-[#a1a7bb] text-sm">Loading chart...</div>
  </div>
);

// Skeleton for chart cards
export const ChartCardSkeleton = ({ height = 'h-64' }) => (
  <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
    <div className="flex items-center justify-between mb-6">
      <div>
        <Skeleton className="h-4 w-40 mb-2" />
        <Skeleton className="h-8 w-28" />
      </div>
      <Skeleton className="h-8 w-44 rounded-lg" />
    </div>
    <Skeleton className={`${height} w-full rounded-lg`} />
  </div>
);

// Skeleton for Fear & Greed gauge
export const FearGreedSkeleton = () => (
  <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
    <Skeleton className="h-4 w-32 mb-2" />
    <Skeleton className="h-6 w-40 mb-6" />
    <div className="flex flex-col items-center">
      <Skeleton className="w-48 h-24 rounded-t-full" />
      <Skeleton className="h-10 w-16 mt-4" />
      <Skeleton className="h-5 w-20 mt-2" />
    </div>
    <div className="mt-6 pt-4 border-t border-white/5">
      <Skeleton className="h-3 w-20 mb-3" />
      <div className="flex items-end justify-between h-12 gap-1">
        {[...Array(7)].map((_, i) => (
          <Skeleton 
            key={i} 
            className="flex-1 rounded-t" 
            style={{ height: `${30 + Math.random() * 70}%` }} 
          />
        ))}
      </div>
    </div>
  </div>
);

// Skeleton for table rows
export const TableRowSkeleton = () => (
  <tr className="border-t border-white/5">
    <td className="py-3"><Skeleton className="h-4 w-4" /></td>
    <td className="py-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div>
          <Skeleton className="h-4 w-12 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </td>
    <td className="py-3 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
    <td className="py-3 text-right"><Skeleton className="h-4 w-14 ml-auto" /></td>
    <td className="py-3 text-right hidden sm:table-cell"><Skeleton className="h-4 w-16 ml-auto" /></td>
  </tr>
);

// Skeleton for Top Movers table
export const TopMoversSkeleton = () => (
  <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-6 w-28" />
      <Skeleton className="h-8 w-40 rounded-lg" />
    </div>
    <table className="w-full">
      <thead>
        <tr className="text-[#a1a7bb] text-xs">
          <th className="text-left font-medium pb-3">#</th>
          <th className="text-left font-medium pb-3">Coin</th>
          <th className="text-right font-medium pb-3">Price</th>
          <th className="text-right font-medium pb-3">24h</th>
          <th className="text-right font-medium pb-3 hidden sm:table-cell">Volume</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </tbody>
    </table>
  </div>
);

// Loading indicator with status text
export const LoadingIndicator = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center gap-2 text-[#a1a7bb] text-sm py-4">
    <div className="w-4 h-4 border-2 border-[#3861fb] border-t-transparent rounded-full animate-spin" />
    <span>{message}</span>
  </div>
);

// Data status badge (shows data source status)
export const DataStatusBadge = ({ isUsingMockData, lastUpdated, error }) => {
  // Show error only if not in demo mode
  if (error && !USE_MOCK_DATA) {
    return (
      <div className="flex items-center gap-2 text-xs px-3 py-1.5 bg-[#ea3943]/10 text-[#ea3943] rounded-full">
        <span className="w-2 h-2 bg-[#ea3943] rounded-full" />
        <span>API Error - Using cached data</span>
      </div>
    );
  }

  // In demo mode (USE_MOCK_DATA=true), always show as live
  // Only show "Demo Mode" if API failed and we're not intentionally using mock data
  if (isUsingMockData && !USE_MOCK_DATA) {
    return (
      <div className="flex items-center gap-2 text-xs px-3 py-1.5 bg-[#f7931a]/10 text-[#f7931a] rounded-full">
        <span className="w-2 h-2 bg-[#f7931a] rounded-full" />
        <span>Demo Mode</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs px-3 py-1.5 bg-[#00d4aa]/10 text-[#00d4aa] rounded-full">
      <span className="w-2 h-2 bg-[#00d4aa] rounded-full animate-pulse" />
      <span>
        Live Data
        {lastUpdated && (
          <span className="text-[#a1a7bb] ml-1">
            · Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </span>
    </div>
  );
};

export default Skeleton;
