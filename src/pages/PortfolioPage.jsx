import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit2, TrendingUp, TrendingDown, Wallet, X, PiggyBank, Percent, Search, Coins } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { fetchTopCoins } from '../services/api';
import { formatPrice, formatChange, formatNumber } from '../data/mockData';

const PortfolioPage = () => {
  const { holdings, removeHolding, updateHolding } = usePortfolio();
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingHolding, setEditingHolding] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch current prices for all holdings
  useEffect(() => {
    const fetchPrices = async () => {
      if (holdings.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const coins = await fetchTopCoins(100);
        const priceMap = {};
        coins.forEach((coin) => {
          priceMap[coin.id] = {
            price: coin.price,
            change24h: coin.change24h,
            image: coin.image,
          };
        });
        setPrices(priceMap);
      } catch (err) {
        console.error('Failed to fetch prices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [holdings]);

  // Calculate portfolio metrics
  const portfolioMetrics = holdings.reduce(
    (acc, holding) => {
      const currentPrice = prices[holding.coinId]?.price || holding.buyPrice;
      const currentValue = holding.quantity * currentPrice;
      const costBasis = holding.quantity * holding.buyPrice;
      const pnl = currentValue - costBasis;

      acc.totalValue += currentValue;
      acc.totalCost += costBasis;
      acc.totalPnl += pnl;

      return acc;
    },
    { totalValue: 0, totalCost: 0, totalPnl: 0 }
  );

  const pnlPercentage = portfolioMetrics.totalCost > 0
    ? ((portfolioMetrics.totalPnl / portfolioMetrics.totalCost) * 100)
    : 0;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#3861fb]/20 to-[#00d4aa]/20 rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5 text-[#3861fb]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Portfolio</h1>
            <p className="text-[#a1a7bb] text-sm">Track your cryptocurrency holdings</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#3861fb] to-[#3861fb]/80 hover:from-[#4a73ff] hover:to-[#3861fb] text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-[#3861fb]/20"
        >
          <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
          Add Asset
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Value Card */}
        <div className="group relative bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3861fb]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#3861fb]/20 to-[#3861fb]/10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Wallet className="w-7 h-7 text-[#3861fb]" />
            </div>
            <div className="flex-1">
              <p className="text-[#a1a7bb] text-sm font-medium mb-1">Total Value</p>
              <p className="text-3xl font-bold text-white tabular-nums tracking-tight">
                ${portfolioMetrics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-[#a1a7bb] text-xs mt-1">
                Cost basis: ${portfolioMetrics.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Total P&L Card */}
        <div className="group relative bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${portfolioMetrics.totalPnl >= 0 ? '#00d4aa10' : '#ea394310'} 0%, transparent 60%)`,
            }}
          />
          <div className="relative flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
              portfolioMetrics.totalPnl >= 0 
                ? 'bg-gradient-to-br from-[#00d4aa]/20 to-[#00d4aa]/10' 
                : 'bg-gradient-to-br from-[#ea3943]/20 to-[#ea3943]/10'
            }`}>
              <PiggyBank className={`w-7 h-7 ${
                portfolioMetrics.totalPnl >= 0 ? 'text-[#00d4aa]' : 'text-[#ea3943]'
              }`} />
            </div>
            <div className="flex-1">
              <p className="text-[#a1a7bb] text-sm font-medium mb-1">Total P&L</p>
              <p className={`text-3xl font-bold tabular-nums tracking-tight ${
                portfolioMetrics.totalPnl >= 0 ? 'text-[#00d4aa]' : 'text-[#ea3943]'
              }`}>
                {portfolioMetrics.totalPnl >= 0 ? '+' : ''}
                ${portfolioMetrics.totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div className={`inline-flex items-center gap-1 mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                portfolioMetrics.totalPnl >= 0 
                  ? 'bg-[#00d4aa]/10 text-[#00d4aa]' 
                  : 'bg-[#ea3943]/10 text-[#ea3943]'
              }`}>
                {portfolioMetrics.totalPnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>Unrealized</span>
              </div>
            </div>
          </div>
        </div>

        {/* P&L Percentage Card */}
        <div className="group relative bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${pnlPercentage >= 0 ? '#00d4aa10' : '#ea394310'} 0%, transparent 60%)`,
            }}
          />
          <div className="relative flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
              pnlPercentage >= 0 
                ? 'bg-gradient-to-br from-[#00d4aa]/20 to-[#00d4aa]/10' 
                : 'bg-gradient-to-br from-[#ea3943]/20 to-[#ea3943]/10'
            }`}>
              <Percent className={`w-7 h-7 ${
                pnlPercentage >= 0 ? 'text-[#00d4aa]' : 'text-[#ea3943]'
              }`} />
            </div>
            <div className="flex-1">
              <p className="text-[#a1a7bb] text-sm font-medium mb-1">Return Rate</p>
              <p className={`text-3xl font-bold tabular-nums tracking-tight ${
                pnlPercentage >= 0 ? 'text-[#00d4aa]' : 'text-[#ea3943]'
              }`}>
                {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
              </p>
              <div className={`inline-flex items-center gap-1 mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                pnlPercentage >= 0 
                  ? 'bg-[#00d4aa]/10 text-[#00d4aa]' 
                  : 'bg-[#ea3943]/10 text-[#ea3943]'
              }`}>
                {pnlPercentage >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>All-time</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      {holdings.length === 0 ? (
        <div className="bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl p-12 border border-white/5 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Coins className="w-64 h-64" />
          </div>
          
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-[#3861fb]/20 to-[#00d4aa]/20 rounded-2xl flex items-center justify-center mx-auto mb-5 animate-float">
              <Wallet className="w-10 h-10 text-[#3861fb]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No holdings yet</h3>
            <p className="text-[#a1a7bb] mb-8 max-w-sm mx-auto">
              Start building your portfolio by adding your first cryptocurrency asset.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3861fb] to-[#3861fb]/80 hover:from-[#4a73ff] hover:to-[#3861fb] text-white font-medium rounded-xl transition-all shadow-lg shadow-[#3861fb]/20"
            >
              <Plus className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
              Add Your First Asset
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[#a1a7bb] text-xs border-b border-white/5 bg-[#0d1421]/50">
                  <th className="text-left font-medium p-4">Asset</th>
                  <th className="text-right font-medium p-4">Price</th>
                  <th className="text-right font-medium p-4">24h</th>
                  <th className="text-right font-medium p-4">Holdings</th>
                  <th className="text-right font-medium p-4">Avg. Buy</th>
                  <th className="text-right font-medium p-4">P&L</th>
                  <th className="text-right font-medium p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding, index) => {
                  const currentPrice = prices[holding.coinId]?.price || holding.buyPrice;
                  const change24h = prices[holding.coinId]?.change24h || 0;
                  const currentValue = holding.quantity * currentPrice;
                  const costBasis = holding.quantity * holding.buyPrice;
                  const pnl = currentValue - costBasis;
                  const pnlPercent = costBasis > 0 ? ((pnl / costBasis) * 100) : 0;

                  return (
                    <tr
                      key={holding.coinId}
                      className="group border-t border-white/5 transition-all duration-200 hover:bg-white/[0.03] table-row-hover"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {/* Asset */}
                      <td className="p-4">
                        <Link to={`/coin/${holding.coinId}`} className="flex items-center gap-3 group/coin">
                          <div className="relative">
                            <img
                              src={holding.image || prices[holding.coinId]?.image}
                              alt={holding.name}
                              className="w-10 h-10 rounded-full ring-2 ring-white/10 transition-transform duration-200 group-hover/coin:scale-110"
                            />
                          </div>
                          <div>
                            <p className="text-white font-medium group-hover/coin:text-[#3861fb] transition-colors">
                              {holding.name}
                            </p>
                            <p className="text-[#a1a7bb] text-sm uppercase tracking-wide">{holding.symbol}</p>
                          </div>
                        </Link>
                      </td>
                      {/* Current Price */}
                      <td className="p-4 text-right">
                        <span className="text-white font-semibold tabular-nums">{formatPrice(currentPrice)}</span>
                      </td>
                      {/* 24h Change */}
                      <td className="p-4 text-right">
                        <span className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-md ${
                          change24h >= 0 
                            ? 'text-[#00d4aa] bg-[#00d4aa]/10' 
                            : 'text-[#ea3943] bg-[#ea3943]/10'
                        }`}>
                          {change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span className="tabular-nums">{formatChange(Math.abs(change24h))}</span>
                        </span>
                      </td>
                      {/* Holdings */}
                      <td className="p-4 text-right">
                        <p className="text-white font-semibold tabular-nums">
                          ${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-[#a1a7bb] text-sm tabular-nums">
                          {holding.quantity} <span className="text-[#a1a7bb]/60">{holding.symbol?.toUpperCase()}</span>
                        </p>
                      </td>
                      {/* Avg Buy */}
                      <td className="p-4 text-right">
                        <span className="text-white tabular-nums">{formatPrice(holding.buyPrice)}</span>
                      </td>
                      {/* P&L */}
                      <td className="p-4 text-right">
                        <p className={`font-semibold tabular-nums ${pnl >= 0 ? 'text-[#00d4aa]' : 'text-[#ea3943]'}`}>
                          {pnl >= 0 ? '+' : ''}${pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-sm tabular-nums ${pnlPercent >= 0 ? 'text-[#00d4aa]' : 'text-[#ea3943]'}`}>
                          {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                        </p>
                      </td>
                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingHolding(holding)}
                            className="p-2 text-[#a1a7bb] hover:text-white hover:bg-white/10 rounded-lg transition-all btn-icon"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeHolding(holding.coinId)}
                            className="p-2 text-[#a1a7bb] hover:text-[#ea3943] hover:bg-[#ea3943]/10 rounded-lg transition-all btn-icon"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingHolding) && (
        <HoldingModal
          holding={editingHolding}
          onClose={() => {
            setShowAddModal(false);
            setEditingHolding(null);
          }}
          onSave={(data) => {
            if (editingHolding) {
              updateHolding(editingHolding.coinId, data);
            }
            setShowAddModal(false);
            setEditingHolding(null);
          }}
        />
      )}
    </main>
  );
};

function HoldingModal({ holding, onClose, onSave }) {
  const { addHolding } = usePortfolio();
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(holding?.coinId || '');
  const [quantity, setQuantity] = useState(holding?.quantity?.toString() || '');
  const [buyPrice, setBuyPrice] = useState(holding?.buyPrice?.toString() || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(!holding);

  useEffect(() => {
    if (!holding) {
      const loadCoins = async () => {
        try {
          const data = await fetchTopCoins(100);
          setCoins(data);
        } catch (err) {
          console.error('Failed to load coins:', err);
        } finally {
          setLoading(false);
        }
      };
      loadCoins();
    }
  }, [holding]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quantity || !buyPrice) return;

    if (holding) {
      onSave({
        quantity: parseFloat(quantity),
        buyPrice: parseFloat(buyPrice),
      });
    } else {
      const coin = coins.find((c) => c.id === selectedCoin);
      if (!coin) return;

      addHolding({
        coinId: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        quantity: parseFloat(quantity),
        buyPrice: parseFloat(buyPrice),
      });
      onClose();
    }
  };

  const selectedCoinData = coins.find((c) => c.id === selectedCoin);

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-backdrop-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#1a2332] rounded-2xl p-6 w-full max-w-md border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50 animate-modal-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {holding ? (
              <>
                <img src={holding.image} alt={holding.name} className="w-10 h-10 rounded-full ring-2 ring-white/10" />
                <div>
                  <h3 className="text-lg font-bold text-white">Edit {holding.name}</h3>
                  <p className="text-[#a1a7bb] text-sm">{holding.symbol?.toUpperCase()}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-gradient-to-br from-[#3861fb]/20 to-[#00d4aa]/20 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-[#3861fb]" />
                </div>
                <h3 className="text-lg font-bold text-white">Add New Asset</h3>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#a1a7bb] hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!holding && (
              <div>
                <label className="block text-[#a1a7bb] text-sm font-medium mb-2">Select Coin</label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a7bb]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search coins..."
                    className="w-full pl-10 pr-4 py-3 bg-[#0d1421] border border-white/10 rounded-xl text-white placeholder-[#a1a7bb] focus:outline-none focus:border-[#3861fb] focus:ring-2 focus:ring-[#3861fb]/20 transition-all"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto bg-[#0d1421] rounded-xl border border-white/10">
                  {loading ? (
                    <div className="p-4 text-center text-[#a1a7bb]">
                      <div className="w-5 h-5 border-2 border-[#3861fb] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading coins...
                    </div>
                  ) : filteredCoins.length === 0 ? (
                    <div className="p-4 text-center text-[#a1a7bb]">No coins found</div>
                  ) : (
                    filteredCoins.slice(0, 20).map((coin) => (
                      <button
                        key={coin.id}
                        type="button"
                        onClick={() => {
                          setSelectedCoin(coin.id);
                          setBuyPrice(coin.price.toString());
                        }}
                        className={`w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors ${
                          selectedCoin === coin.id ? 'bg-[#3861fb]/20 border-l-2 border-l-[#3861fb]' : 'border-l-2 border-l-transparent'
                        }`}
                      >
                        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full ring-2 ring-white/10" />
                        <div className="text-left flex-1">
                          <p className="text-white font-medium">{coin.name}</p>
                          <p className="text-[#a1a7bb] text-xs uppercase tracking-wide">{coin.symbol}</p>
                        </div>
                        <span className="text-white font-medium tabular-nums">{formatPrice(coin.price)}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-[#a1a7bb] text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-[#0d1421] border border-white/10 rounded-xl text-white placeholder-[#a1a7bb] focus:outline-none focus:border-[#3861fb] focus:ring-2 focus:ring-[#3861fb]/20 transition-all tabular-nums"
                required
              />
            </div>

            <div>
              <label className="block text-[#a1a7bb] text-sm font-medium mb-2">Buy Price (USD)</label>
              <input
                type="number"
                step="any"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-[#0d1421] border border-white/10 rounded-xl text-white placeholder-[#a1a7bb] focus:outline-none focus:border-[#3861fb] focus:ring-2 focus:ring-[#3861fb]/20 transition-all tabular-nums"
                required
              />
            </div>

            {/* Total Value Preview */}
            <div className="bg-[#0d1421]/50 rounded-xl p-4 border border-white/5">
              <p className="text-[#a1a7bb] text-sm mb-1">Total Value</p>
              <p className="text-2xl font-bold text-white tabular-nums">
                ${((parseFloat(quantity) || 0) * (parseFloat(buyPrice) || 0)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-[#242d3d] text-[#a1a7bb] hover:text-white font-medium rounded-xl transition-all hover:bg-[#2a3548]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!holding && !selectedCoin}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#3861fb] to-[#3861fb]/80 hover:from-[#4a73ff] hover:to-[#3861fb] text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#3861fb]/20"
            >
              {holding ? 'Save Changes' : 'Add Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PortfolioPage;
