import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice, formatChange } from '../data/mockData';
import { TickerCoinSkeleton } from './Skeleton';

const TickerBar = ({ coins = [], loading = false }) => {
  // Duplicate coins for seamless infinite scroll effect
  const duplicatedCoins = [...coins, ...coins];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#1a2332]/80 via-[#1a2332]/60 to-[#1a2332]/80 backdrop-blur-sm border-b border-white/5">
      {/* Top highlight line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Gradient fade edges - enhanced */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0d1421] via-[#0d1421]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0d1421] via-[#0d1421]/80 to-transparent z-10 pointer-events-none" />
      
      {/* Scrolling ticker */}
      <div className="flex animate-scroll">
        {loading ? (
          // Show skeleton loaders while loading
          [...Array(8)].map((_, index) => (
            <TickerCoinSkeleton key={index} />
          ))
        ) : (
          duplicatedCoins.map((coin, index) => (
            <Link
              key={`${coin.id}-${index}`}
              to={`/coin/${coin.id}`}
              className="group relative flex items-center gap-3 px-6 py-3.5 whitespace-nowrap border-r border-white/5 transition-all duration-200 cursor-pointer"
            >
              {/* Hover background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              
              {/* Coin logo */}
              <div className="relative flex-shrink-0">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full ring-2 ring-white/10 transition-transform duration-200 group-hover:scale-110 object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to first letter if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback icon (hidden by default, shown on image error) */}
                <div 
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3861fb] to-[#00d4aa] items-center justify-center text-[10px] font-bold text-white ring-2 ring-white/10 transition-transform duration-200 group-hover:scale-110 absolute inset-0"
                  style={{ display: 'none' }}
                >
                  {coin.symbol?.charAt(0) || '?'}
                </div>
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-full bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10 scale-150" />
              </div>
              
              {/* Coin info */}
              <div className="flex items-center gap-2.5 relative">
                <span className="text-sm font-semibold text-white group-hover:text-[#00d4aa] transition-colors duration-200 uppercase tracking-wide">
                  {coin.symbol}
                </span>
                <span className="text-sm text-[#a1a7bb] tabular-nums font-medium">
                  {formatPrice(coin.price)}
                </span>
                
                {/* Change indicator - enhanced */}
                <span
                  className={`flex items-center gap-1 text-sm font-semibold px-1.5 py-0.5 rounded-md transition-all duration-200 ${
                    (coin.change24h || 0) >= 0 
                      ? 'text-[#00d4aa] group-hover:bg-[#00d4aa]/10' 
                      : 'text-[#ea3943] group-hover:bg-[#ea3943]/10'
                  }`}
                >
                  {(coin.change24h || 0) >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span className="tabular-nums">{formatChange(coin.change24h || 0)}</span>
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Add keyframes for animation in a style tag */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 45s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default TickerBar;
