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
  Star,
  Sparkles,
  LogIn,
  UserPlus
} from 'lucide-react';
import { searchCoins } from '../services/api';
import { topCoins } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import UserDropdown from './UserDropdown';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // Popular coins to show when search is focused but empty
  const popularCoins = topCoins.slice(0, 8).map(coin => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    image: coin.image,
    marketCapRank: topCoins.findIndex(c => c.id === coin.id) + 1
  }));

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
          setSelectedIndex(-1);
        } catch (err) {
          console.error('Search failed:', err);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle focus to show popular coins
  const handleFocus = () => {
    setShowResults(true);
    setIsSearchFocused(true);
  };

  const handleBlur = () => {
    setIsSearchFocused(false);
  };

  // Get display results - show popular coins if no search query, otherwise show search results
  const displayResults = searchQuery.length >= 2 ? searchResults : popularCoins;
  const isShowingPopular = searchQuery.length < 2;

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
    if (!showResults || displayResults.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev < displayResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && displayResults[selectedIndex]) {
          handleSelectCoin(displayResults[selectedIndex]);
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
    <header className="sticky top-0 z-50 glass-card-solid border-b border-white/5">
      {/* Subtle gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00d4aa]/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00d4aa] to-[#3861fb] rounded-xl flex items-center justify-center shadow-lg shadow-[#00d4aa]/20 transition-transform duration-300 group-hover:scale-105">
                <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-[#00d4aa] to-[#3861fb] rounded-xl blur opacity-30 -z-10 transition-opacity duration-300 group-hover:opacity-50" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight transition-colors duration-200 group-hover:text-[#00d4aa]">
                CryptoVue
              </h1>
              <p className="text-[10px] text-[#a1a7bb] -mt-0.5 tracking-wide">Market Dashboard</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(link.href)
                    ? 'text-white'
                    : 'text-[#a1a7bb] hover:text-white'
                }`}
              >
                {/* Active background */}
                {isActive(link.href) && (
                  <span className="absolute inset-0 bg-gradient-to-r from-[#1a2332] to-[#1a2332]/80 rounded-xl border border-white/10" />
                )}
                {/* Hover background */}
                <span className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                  isActive(link.href) ? 'opacity-0' : 'opacity-0 hover:opacity-100 bg-white/5'
                }`} />
                <link.icon className={`w-4 h-4 relative z-10 transition-transform duration-200 ${
                  isActive(link.href) ? '' : 'group-hover:scale-110'
                }`} />
                <span className="relative z-10">{link.name}</span>
                {/* Active indicator dot */}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00d4aa]" />
                )}
              </Link>
            ))}
          </nav>

          {/* Search Bar & User Area */}
          <div className="hidden md:flex items-center gap-4" ref={searchRef}>
            <div className="relative group">
              {/* Search glow effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#00d4aa]/50 to-[#3861fb]/50 rounded-xl blur transition-opacity duration-300 ${
                isSearchFocused ? 'opacity-50' : 'opacity-0'
              }`} />
              
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
                  isSearchFocused ? 'text-[#00d4aa]' : 'text-[#a1a7bb]'
                }`} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search coins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  className="w-64 pl-10 pr-14 py-2.5 bg-[#1a2332]/80 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder-[#a1a7bb] focus:outline-none focus:border-[#00d4aa]/50 focus:bg-[#1a2332] transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-[#00d4aa] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <kbd className={`hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-[#a1a7bb] bg-[#242d3d] rounded border border-white/10 transition-all duration-200 ${
                      isSearchFocused ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
                    }`}>
                      <span className="text-[11px]">⌘</span>K
                    </kbd>
                  )}
                </div>
              </div>

              {/* Search Results Dropdown */}
              {showResults && displayResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-card-solid rounded-xl shadow-2xl shadow-black/30 overflow-hidden z-50 animate-fade-in-scale">
                  {/* Header */}
                  <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-[#00d4aa]" />
                    <p className="text-[#a1a7bb] text-xs font-medium">
                      {isShowingPopular ? 'Popular Coins' : 'Search Results'}
                    </p>
                  </div>
                  <div className="stagger-children-fast">
                    {displayResults.map((coin, index) => (
                      <button
                        key={coin.id}
                        onClick={() => handleSelectCoin(coin)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                          index === selectedIndex
                            ? 'bg-[#3861fb]/20 border-l-2 border-l-[#3861fb]'
                            : 'hover:bg-white/5 border-l-2 border-l-transparent'
                        }`}
                      >
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-8 h-8 rounded-full ring-2 ring-white/10 transition-transform duration-200 hover:scale-110"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{coin.name}</p>
                          <p className="text-[#a1a7bb] text-xs uppercase tracking-wide">{coin.symbol}</p>
                        </div>
                        {coin.marketCapRank && (
                          <span className="text-[#a1a7bb] text-xs px-2 py-0.5 bg-white/5 rounded-full">
                            #{coin.marketCapRank}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {showResults && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-card-solid rounded-xl shadow-2xl shadow-black/30 p-6 text-center z-50 animate-fade-in-scale">
                  <Search className="w-8 h-8 text-[#a1a7bb] mx-auto mb-2 opacity-50" />
                  <p className="text-[#a1a7bb] text-sm">No coins found for "{searchQuery}"</p>
                </div>
              )}
            </div>

            {/* User Area */}
            {!isLoading && (
              isAuthenticated ? (
                <UserDropdown />
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#a1a7bb] hover:text-white rounded-xl hover:bg-white/5 transition-all duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00d4aa] to-[#00b894] rounded-xl hover:shadow-lg hover:shadow-[#00d4aa]/25 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign up
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 text-[#a1a7bb] hover:text-white bg-[#1a2332]/50 hover:bg-[#1a2332] rounded-xl transition-all duration-200 btn-icon"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5 animate-fade-in">
            {/* Mobile Search */}
            <div className="relative mb-4" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a7bb]" />
              <input
                type="text"
                placeholder="Search coins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-3 bg-[#1a2332]/80 border border-white/10 rounded-xl text-sm text-white placeholder-[#a1a7bb] focus:outline-none focus:border-[#00d4aa]/50 transition-all duration-300"
              />
              
              {/* Mobile Search Results */}
              {showResults && displayResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-card-solid rounded-xl shadow-2xl overflow-hidden z-50 max-h-64 overflow-y-auto animate-fade-in-scale">
                  {/* Header */}
                  <div className="px-4 py-2.5 border-b border-white/5 sticky top-0 bg-[#1a2332] flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-[#00d4aa]" />
                    <p className="text-[#a1a7bb] text-xs font-medium">
                      {isShowingPopular ? 'Popular Coins' : 'Search Results'}
                    </p>
                  </div>
                  {displayResults.map((coin, index) => (
                    <button
                      key={coin.id}
                      onClick={() => handleSelectCoin(coin)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                        index === selectedIndex
                          ? 'bg-[#3861fb]/20'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full ring-2 ring-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{coin.name}</p>
                        <p className="text-[#a1a7bb] text-xs uppercase tracking-wide">{coin.symbol}</p>
                      </div>
                      {coin.marketCapRank && (
                        <span className="text-[#a1a7bb] text-xs px-2 py-0.5 bg-white/5 rounded-full">
                          #{coin.marketCapRank}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1 stagger-children-fast">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-gradient-to-r from-[#1a2332] to-transparent text-white border-l-2 border-l-[#00d4aa]'
                      : 'text-[#a1a7bb] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className={`w-5 h-5 ${isActive(link.href) ? 'text-[#00d4aa]' : ''}`} />
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth Buttons */}
            {!isLoading && !isAuthenticated && (
              <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-[#1a2332] rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#00d4aa] to-[#00b894] rounded-xl hover:shadow-lg hover:shadow-[#00d4aa]/25 transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4" />
                  Create account
                </Link>
              </div>
            )}

            {/* Mobile User Info */}
            {!isLoading && isAuthenticated && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <Link
                  to="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-[#a1a7bb] hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#00d4aa] to-[#3861fb] rounded-full flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-white" />
                  </div>
                  My Account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
