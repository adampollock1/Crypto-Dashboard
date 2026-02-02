import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice, formatChange } from '../data/mockData';
import { TickerCoinSkeleton } from './Skeleton';

const TickerBar = ({ coins = [], loading = false }) => {
  // Duplicate coins for seamless infinite scroll effect
  const duplicatedCoins = [...coins, ...coins];

  return (
    <div className="relative overflow-hidden bg-[#1a2332]/50 border-b border-white/5">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0d1421] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0d1421] to-transparent z-10 pointer-events-none" />
      
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
              className="flex items-center gap-3 px-6 py-3 whitespace-nowrap border-r border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
            >
              {/* Coin icon - use API image or fallback */}
              {coin.image ? (
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                  loading="lazy"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3861fb] to-[#00d4aa] flex items-center justify-center text-[10px] font-bold text-white">
                  {coin.symbol?.charAt(0) || '?'}
                </div>
              )}
              
              {/* Coin info */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white group-hover:text-[#00d4aa] transition-colors">
                  {coin.symbol}
                </span>
                <span className="text-sm text-[#a1a7bb]">
                  {formatPrice(coin.price)}
                </span>
                
                {/* Change indicator */}
                <span
                  className={`flex items-center gap-0.5 text-sm font-medium ${
                    (coin.change24h || 0) >= 0 ? 'text-[#00d4aa]' : 'text-[#ea3943]'
                  }`}
                >
                  {(coin.change24h || 0) >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {formatChange(coin.change24h || 0)}
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
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default TickerBar;
