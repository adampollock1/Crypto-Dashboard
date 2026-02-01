import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
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
        // Fetch top 100 coins to get prices
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-[#a1a7bb]">Track your cryptocurrency holdings and performance.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#3861fb] hover:bg-[#3861fb]/80 text-white rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Asset
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#3861fb]/20 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-[#3861fb]" />
            </div>
            <div>
              <p className="text-[#a1a7bb] text-sm">Total Value</p>
              <p className="text-2xl font-bold text-white">
                ${portfolioMetrics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              portfolioMetrics.totalPnl >= 0 ? 'bg-[#00d4aa]/20' : 'bg-[#ea3943]/20'
            }`}>
              {portfolioMetrics.totalPnl >= 0 ? (
                <TrendingUp className="w-6 h-6 text-[#00d4aa]" />
              ) : (
                <TrendingDown className="w-6 h-6 text-[#ea3943]" />
              )}
            </div>
            <div>
              <p className="text-[#a1a7bb] text-sm">Total P&L</p>
              <p className={`text-2xl font-bold ${
                portfolioMetrics.totalPnl >= 0 ? 'text-[#00d4aa]' : 'text-[#ea3943]'
              }`}>
                {portfolioMetrics.totalPnl >= 0 ? '+' : ''}
                ${portfolioMetrics.totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              pnlPercentage >= 0 ? 'bg-[#00d4aa]/20' : 'bg-[#ea3943]/20'
            }`}>
              {pnlPercentage >= 0 ? (
                <TrendingUp className="w-6 h-6 text-[#00d4aa]" />
              ) : (
                <TrendingDown className="w-6 h-6 text-[#ea3943]" />
              )}
            </div>
            <div>
              <p className="text-[#a1a7bb] text-sm">P&L Percentage</p>
              <p className={`text-2xl font-bold ${
                pnlPercentage >= 0 ? 'text-[#00d4aa]' : 'text-[#ea3943]'
              }`}>
                {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      {holdings.length === 0 ? (
        <div className="bg-[#1a2332] rounded-2xl p-12 border border-white/5 text-center">
          <div className="w-16 h-16 bg-[#242d3d] rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-[#a1a7bb]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No holdings yet</h3>
          <p className="text-[#a1a7bb] mb-6">
            Start tracking your cryptocurrency portfolio by adding your first asset.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3861fb] hover:bg-[#3861fb]/80 text-white rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Your First Asset
          </button>
        </div>
      ) : (
        <div className="bg-[#1a2332] rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[#a1a7bb] text-xs border-b border-white/5">
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
                {holdings.map((holding) => {
                  const currentPrice = prices[holding.coinId]?.price || holding.buyPrice;
                  const change24h = prices[holding.coinId]?.change24h || 0;
                  const currentValue = holding.quantity * currentPrice;
                  const costBasis = holding.quantity * holding.buyPrice;
                  const pnl = currentValue - costBasis;
                  const pnlPercent = costBasis > 0 ? ((pnl / costBasis) * 100) : 0;

                  return (
                    <tr
                      key={holding.coinId}
                      className="border-t border-white/5 hover:bg-white/5 transition-colors"
                    >
                      {/* Asset */}
                      <td className="p-4">
                        <Link to={`/coin/${holding.coinId}`} className="flex items-center gap-3 group">
                          <img
                            src={holding.image || prices[holding.coinId]?.image}
                            alt={holding.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="text-white font-medium group-hover:text-[#3861fb] transition-colors">
                              {holding.name}
                            </p>
                            <p className="text-[#a1a7bb] text-sm uppercase">{holding.symbol}</p>
                          </div>
                        </Link>
                      </td>
                      {/* Current Price */}
                      <td className="p-4 text-right">
                        <span className="text-white font-medium">{formatPrice(currentPrice)}</span>
                      </td>
                      {/* 24h Change */}
                      <td className="p-4 text-right">
                        <span className={`font-medium ${change24h >= 0 ? 'text-[#00d4aa]' : 'text-[#ea3943]'}`}>
                          {change24h >= 0 ? '↑' : '↓'} {formatChange(Math.abs(change24h))}
                        </span>
                      </td>
                      {/* Holdings */}
                      <td className="p-4 text-right">
                        <p className="text-white font-medium">
                          ${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-[#a1a7bb] text-sm">
                          {holding.quantity} {holding.symbol?.toUpperCase()}
                        </p>
                      </td>
                      {/* Avg Buy */}
                      <td className="p-4 text-right">
                        <span className="text-white">{formatPrice(holding.buyPrice)}</span>
                      </td>
                      {/* P&L */}
                      <td className="p-4 text-right">
                        <p className={`font-medium ${pnl >= 0 ? 'text-[#00d4aa]' : 'text-[#ea3943]'}`}>
                          {pnl >= 0 ? '+' : ''}${pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-sm ${pnlPercent >= 0 ? 'text-[#00d4aa]' : 'text-[#ea3943]'}`}>
                          {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                        </p>
                      </td>
                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingHolding(holding)}
                            className="p-2 text-[#a1a7bb] hover:text-white hover:bg-[#242d3d] rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeHolding(holding.coinId)}
                            className="p-2 text-[#a1a7bb] hover:text-[#ea3943] hover:bg-[#ea3943]/10 rounded-lg transition-all"
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a2332] rounded-2xl p-6 w-full max-w-md border border-white/10 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-white mb-6">
          {holding ? `Edit ${holding.name}` : 'Add New Asset'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!holding && (
              <div>
                <label className="block text-[#a1a7bb] text-sm mb-2">Select Coin</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search coins..."
                  className="w-full px-4 py-3 bg-[#0d1421] border border-white/10 rounded-lg text-white placeholder-[#a1a7bb] focus:outline-none focus:border-[#3861fb] mb-2"
                />
                <div className="max-h-48 overflow-y-auto bg-[#0d1421] rounded-lg border border-white/10">
                  {loading ? (
                    <div className="p-4 text-center text-[#a1a7bb]">Loading coins...</div>
                  ) : (
                    filteredCoins.slice(0, 20).map((coin) => (
                      <button
                        key={coin.id}
                        type="button"
                        onClick={() => {
                          setSelectedCoin(coin.id);
                          setBuyPrice(coin.price.toString());
                        }}
                        className={`w-full flex items-center gap-3 p-3 hover:bg-[#242d3d] transition-colors ${
                          selectedCoin === coin.id ? 'bg-[#3861fb]/20' : ''
                        }`}
                      >
                        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                        <div className="text-left">
                          <p className="text-white font-medium">{coin.name}</p>
                          <p className="text-[#a1a7bb] text-sm">{coin.symbol}</p>
                        </div>
                        <span className="ml-auto text-white">{formatPrice(coin.price)}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-[#a1a7bb] text-sm mb-2">Quantity</label>
              <input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-[#0d1421] border border-white/10 rounded-lg text-white placeholder-[#a1a7bb] focus:outline-none focus:border-[#3861fb]"
                required
              />
            </div>

            <div>
              <label className="block text-[#a1a7bb] text-sm mb-2">Buy Price (USD)</label>
              <input
                type="number"
                step="any"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-[#0d1421] border border-white/10 rounded-lg text-white placeholder-[#a1a7bb] focus:outline-none focus:border-[#3861fb]"
                required
              />
            </div>

            <div className="pt-2">
              <p className="text-[#a1a7bb] text-sm">
                Total Value:{' '}
                <span className="text-white font-medium">
                  ${((parseFloat(quantity) || 0) * (parseFloat(buyPrice) || 0)).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-[#0d1421] text-[#a1a7bb] rounded-lg hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!holding && !selectedCoin}
              className="flex-1 px-4 py-3 bg-[#3861fb] text-white rounded-lg hover:bg-[#3861fb]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
