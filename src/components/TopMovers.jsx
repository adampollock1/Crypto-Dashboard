import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Flame, ArrowRight } from 'lucide-react';
import { formatPrice, formatChange, formatNumber } from '../data/mockData';
import { TableRowSkeleton } from './Skeleton';

const TopMovers = ({ gainers = [], losers = [], loading = false }) => {
  const [activeTab, setActiveTab] = useState('gainers');

  const data = activeTab === 'gainers' ? gainers : losers;
  const isGainers = activeTab === 'gainers';

  return (
    <div className="group bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: isGainers 
            ? 'linear-gradient(135deg, rgba(0, 212, 170, 0.03) 0%, transparent 50%)'
            : 'linear-gradient(135deg, rgba(234, 57, 67, 0.03) 0%, transparent 50%)',
        }}
      />
      
      {/* Header with tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isGainers ? 'bg-[#00d4aa]/10' : 'bg-[#ea3943]/10'
          }`}>
            <Flame className={`w-5 h-5 ${isGainers ? 'text-[#00d4aa]' : 'text-[#ea3943]'}`} />
          </div>
          <h3 className="text-lg font-bold text-white">Top Movers</h3>
        </div>
        
        <div className="flex gap-1 bg-[#0d1421]/80 rounded-xl p-1.5 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('gainers')}
            className={`relative flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
              activeTab === 'gainers'
                ? 'text-white'
                : 'text-[#a1a7bb] hover:text-white'
            }`}
          >
            {activeTab === 'gainers' && (
              <span className="absolute inset-0 bg-gradient-to-r from-[#00d4aa] to-[#00d4aa]/80 rounded-lg" />
            )}
            <TrendingUp className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Gainers</span>
          </button>
          <button
            onClick={() => setActiveTab('losers')}
            className={`relative flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
              activeTab === 'losers'
                ? 'text-white'
                : 'text-[#a1a7bb] hover:text-white'
            }`}
          >
            {activeTab === 'losers' && (
              <span className="absolute inset-0 bg-gradient-to-r from-[#ea3943] to-[#ea3943]/80 rounded-lg" />
            )}
            <TrendingDown className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Losers</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative">
        <table className="w-full">
          <thead>
            <tr className="text-[#a1a7bb] text-xs">
              <th className="text-left font-medium pb-3 pl-2">#</th>
              <th className="text-left font-medium pb-3">Coin</th>
              <th className="text-right font-medium pb-3">Price</th>
              <th className="text-right font-medium pb-3">24h</th>
              <th className="text-right font-medium pb-3 pr-2 hidden sm:table-cell">Volume</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRowSkeleton key={i} />
              ))
            ) : (
              data.map((coin, index) => (
                <tr
                  key={coin.symbol}
                  className="border-t border-white/5 transition-all duration-200 hover:bg-white/[0.03] table-row-hover"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <td className="py-3 pl-2 text-[#a1a7bb] text-sm font-medium tabular-nums">{coin.rank}</td>
                  <td className="py-3">
                    <Link 
                      to={`/coin/${coin.id || coin.symbol.toLowerCase()}`}
                      className="flex items-center gap-3 group/coin"
                    >
                      {/* Coin icon */}
                      {coin.image ? (
                        <div className="relative">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-9 h-9 rounded-full ring-2 ring-white/10 transition-transform duration-200 group-hover/coin:scale-110"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/10 ${
                            isGainers
                              ? 'bg-gradient-to-br from-[#00d4aa] to-[#3861fb]'
                              : 'bg-gradient-to-br from-[#ea3943] to-[#f7931a]'
                          }`}
                        >
                          {coin.symbol?.charAt(0) || '?'}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold text-sm group-hover/coin:text-[#3861fb] transition-colors">
                          {coin.symbol}
                        </p>
                        <p className="text-[#a1a7bb] text-xs">{coin.name}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-white text-sm font-semibold tabular-nums">
                      {formatPrice(coin.price)}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-md ${
                        isGainers 
                          ? 'text-[#00d4aa] bg-[#00d4aa]/10' 
                          : 'text-[#ea3943] bg-[#ea3943]/10'
                      }`}
                    >
                      {isGainers ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      <span className="tabular-nums">{formatChange(Math.abs(coin.change24h || 0))}</span>
                    </span>
                  </td>
                  <td className="py-3 pr-2 text-right hidden sm:table-cell">
                    <span className="text-[#a1a7bb] text-sm tabular-nums">
                      {formatNumber(coin.volume || 0)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View All Link */}
      <div className="mt-5 pt-4 border-t border-white/5 text-center relative">
        <Link 
          to={`/movers/${isGainers ? 'gainers' : 'losers'}`}
          className={`group/link inline-flex items-center gap-2 text-sm font-medium transition-colors ${
            isGainers ? 'text-[#00d4aa] hover:text-[#00ffcc]' : 'text-[#ea3943] hover:text-[#ff5555]'
          }`}
        >
          View All {isGainers ? 'Gainers' : 'Losers'}
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default TopMovers;
