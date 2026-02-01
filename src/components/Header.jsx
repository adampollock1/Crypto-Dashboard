import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Search, 
  Menu, 
  X,
  BarChart3,
  Coins,
  Wallet,
  Star
} from 'lucide-react';
import { searchCoins } from '../services/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Dashboard', icon: BarChart3, href: '/' },
    { name: 'Cryptocurrencies', icon: Coins, href: '/coins' },
    { name: 'Portfolio', icon: Wallet, href: '/portfolio' },
    { name: 'Watchlist', icon: Star, href: '/watchlist' },
  ];

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchCoins(searchQuery);
          setSearchResults(results);
          setShowResults(true);
          setSelectedIndex(-1);
        } catch (err) {
          console.error('Search failed:', err);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle keyboard navigation in search results
  const handleKeyDown = (event) => {
    if (!showResults || searchResults.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          handleSelectCoin(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSearchQuery('');
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectCoin = (coin) => {
    navigate(`/coin/${coin.id}`);
    setSearchQuery('');
    setShowResults(false);
    setIsMenuOpen(false);
  };

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0d1421]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00d4aa] to-[#3861fb] rounded-xl flex items-center justify-center shadow-lg shadow-[#00d4aa]/20">
                <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-[#00d4aa] to-[#3861fb] rounded-xl blur opacity-30 -z-10"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">CryptoVue</h1>
              <p className="text-[10px] text-[#a1a7bb] -mt-0.5">Market Dashboard</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-[#1a2332] text-white'
                    : 'text-[#a1a7bb] hover:text-white hover:bg-[#1a2332]/50'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a7bb]" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search coins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                onKeyDown={handleKeyDown}
                className="w-64 pl-10 pr-12 py-2 bg-[#1a2332] border border-white/5 rounded-lg text-sm text-white placeholder-[#a1a7bb] focus:outline-none focus:border-[#00d4aa]/50 focus:ring-1 focus:ring-[#00d4aa]/20 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-[#a1a7bb] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] text-[#a1a7bb] bg-[#242d3d] rounded border border-white/10">
                    ⌘K
                  </kbd>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a2332] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                  {searchResults.map((coin, index) => (
                    <button
                      key={coin.id}
                      onClick={() => handleSelectCoin(coin)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        index === selectedIndex
                          ? 'bg-[#3861fb]/20'
                          : 'hover:bg-[#242d3d]'
                      }`}
                    >
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{coin.name}</p>
                        <p className="text-[#a1a7bb] text-xs">{coin.symbol}</p>
                      </div>
                      {coin.marketCapRank && (
                        <span className="text-[#a1a7bb] text-xs">
                          #{coin.marketCapRank}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {showResults && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a2332] border border-white/10 rounded-xl shadow-xl p-4 text-center z-50">
                  <p className="text-[#a1a7bb] text-sm">No coins found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#a1a7bb] hover:text-white hover:bg-[#1a2332] rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            {/* Mobile Search */}
            <div className="relative mb-4" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a7bb]" />
              <input
                type="text"
                placeholder="Search coins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1a2332] border border-white/5 rounded-lg text-sm text-white placeholder-[#a1a7bb] focus:outline-none focus:border-[#00d4aa]/50"
              />
              
              {/* Mobile Search Results */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a2332] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 max-h-64 overflow-y-auto">
                  {searchResults.map((coin, index) => (
                    <button
                      key={coin.id}
                      onClick={() => handleSelectCoin(coin)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        index === selectedIndex
                          ? 'bg-[#3861fb]/20'
                          : 'hover:bg-[#242d3d]'
                      }`}
                    >
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{coin.name}</p>
                        <p className="text-[#a1a7bb] text-xs">{coin.symbol}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-[#1a2332] text-white'
                      : 'text-[#a1a7bb] hover:text-white hover:bg-[#1a2332]/50'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
