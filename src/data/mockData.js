// Mock data structured to match common crypto API response formats
// This creates a fully functional demo experience without API calls

// Configuration - set to true to always use mock data
export const USE_MOCK_DATA = true;

// Extended list of cryptocurrencies for the full coins page
export const allCoins = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', current_price: 104235.67, price_change_percentage_24h: 2.34, market_cap: 2.06e12, total_volume: 45.2e9, circulating_supply: 19700000, market_cap_rank: 1, image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', current_price: 3285.42, price_change_percentage_24h: -1.23, market_cap: 395.6e9, total_volume: 18.5e9, circulating_supply: 120300000, market_cap_rank: 2, image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'tether', symbol: 'USDT', name: 'Tether', current_price: 1.00, price_change_percentage_24h: 0.01, market_cap: 137.8e9, total_volume: 85.2e9, circulating_supply: 137800000000, market_cap_rank: 3, image: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', current_price: 3.12, price_change_percentage_24h: -0.45, market_cap: 178.9e9, total_volume: 12.3e9, circulating_supply: 57400000000, market_cap_rank: 4, image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', current_price: 252.18, price_change_percentage_24h: 4.56, market_cap: 122.3e9, total_volume: 8.5e9, circulating_supply: 485000000, market_cap_rank: 5, image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', current_price: 685.23, price_change_percentage_24h: 1.87, market_cap: 98.5e9, total_volume: 2.1e9, circulating_supply: 144000000, market_cap_rank: 6, image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', current_price: 0.38, price_change_percentage_24h: 5.67, market_cap: 56.2e9, total_volume: 4.2e9, circulating_supply: 147900000000, market_cap_rank: 7, image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' },
  { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin', current_price: 1.00, price_change_percentage_24h: 0.02, market_cap: 45.8e9, total_volume: 8.5e9, circulating_supply: 45800000000, market_cap_rank: 8, image: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', current_price: 1.02, price_change_percentage_24h: 3.21, market_cap: 35.8e9, total_volume: 1.2e9, circulating_supply: 35100000000, market_cap_rank: 9, image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
  { id: 'tron', symbol: 'TRX', name: 'TRON', current_price: 0.245, price_change_percentage_24h: 1.45, market_cap: 21.2e9, total_volume: 850e6, circulating_supply: 86500000000, market_cap_rank: 10, image: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', current_price: 38.45, price_change_percentage_24h: -2.34, market_cap: 15.8e9, total_volume: 520e6, circulating_supply: 411000000, market_cap_rank: 11, image: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', current_price: 24.85, price_change_percentage_24h: 2.89, market_cap: 15.4e9, total_volume: 890e6, circulating_supply: 620000000, market_cap_rank: 12, image: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
  { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', current_price: 0.0000245, price_change_percentage_24h: 8.92, market_cap: 14.4e9, total_volume: 1.2e9, circulating_supply: 589000000000000, market_cap_rank: 13, image: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', current_price: 7.85, price_change_percentage_24h: -1.56, market_cap: 11.2e9, total_volume: 380e6, circulating_supply: 1430000000, market_cap_rank: 14, image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png' },
  { id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash', current_price: 485.23, price_change_percentage_24h: 1.23, market_cap: 9.5e9, total_volume: 420e6, circulating_supply: 19600000, market_cap_rank: 15, image: 'https://assets.coingecko.com/coins/images/780/small/bitcoin-cash-circle.png' },
  { id: 'sui', symbol: 'SUI', name: 'Sui', current_price: 4.52, price_change_percentage_24h: 6.78, market_cap: 14.2e9, total_volume: 1.8e9, circulating_supply: 3140000000, market_cap_rank: 16, image: 'https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', current_price: 125.67, price_change_percentage_24h: 0.89, market_cap: 9.4e9, total_volume: 580e6, circulating_supply: 75000000, market_cap_rank: 17, image: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', current_price: 14.25, price_change_percentage_24h: -0.67, market_cap: 8.5e9, total_volume: 290e6, circulating_supply: 600000000, market_cap_rank: 18, image: 'https://assets.coingecko.com/coins/images/12504/small/uni.jpg' },
  { id: 'pepe', symbol: 'PEPE', name: 'Pepe', current_price: 0.0000234, price_change_percentage_24h: 15.67, market_cap: 9.8e9, total_volume: 2.3e9, circulating_supply: 420690000000000, market_cap_rank: 19, image: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg' },
  { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', current_price: 5.42, price_change_percentage_24h: 3.45, market_cap: 6.2e9, total_volume: 340e6, circulating_supply: 1150000000, market_cap_rank: 20, image: 'https://assets.coingecko.com/coins/images/10365/small/near.jpg' },
  { id: 'stellar', symbol: 'XLM', name: 'Stellar', current_price: 0.485, price_change_percentage_24h: 2.12, market_cap: 14.5e9, total_volume: 520e6, circulating_supply: 29900000000, market_cap_rank: 21, image: 'https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png' },
  { id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer', current_price: 12.85, price_change_percentage_24h: -3.21, market_cap: 6.1e9, total_volume: 180e6, circulating_supply: 475000000, market_cap_rank: 22, image: 'https://assets.coingecko.com/coins/images/14495/small/Internet_Computer_logo.png' },
  { id: 'ethereum-classic', symbol: 'ETC', name: 'Ethereum Classic', current_price: 28.45, price_change_percentage_24h: 1.78, market_cap: 4.2e9, total_volume: 210e6, circulating_supply: 148000000, market_cap_rank: 23, image: 'https://assets.coingecko.com/coins/images/453/small/ethereum-classic-logo.png' },
  { id: 'aptos', symbol: 'APT', name: 'Aptos', current_price: 8.45, price_change_percentage_24h: -5.34, market_cap: 4.0e9, total_volume: 450e6, circulating_supply: 475000000, market_cap_rank: 24, image: 'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png' },
  { id: 'render-token', symbol: 'RNDR', name: 'Render', current_price: 9.85, price_change_percentage_24h: 4.56, market_cap: 3.8e9, total_volume: 320e6, circulating_supply: 386000000, market_cap_rank: 25, image: 'https://assets.coingecko.com/coins/images/11636/small/rndr.png' },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos', current_price: 8.92, price_change_percentage_24h: 0.45, market_cap: 3.5e9, total_volume: 180e6, circulating_supply: 392000000, market_cap_rank: 26, image: 'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png' },
  { id: 'filecoin', symbol: 'FIL', name: 'Filecoin', current_price: 5.67, price_change_percentage_24h: -1.23, market_cap: 3.2e9, total_volume: 150e6, circulating_supply: 565000000, market_cap_rank: 27, image: 'https://assets.coingecko.com/coins/images/12817/small/filecoin.png' },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', current_price: 1.12, price_change_percentage_24h: -2.87, market_cap: 3.8e9, total_volume: 380e6, circulating_supply: 3400000000, market_cap_rank: 28, image: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg' },
  { id: 'hedera-hashgraph', symbol: 'HBAR', name: 'Hedera', current_price: 0.285, price_change_percentage_24h: 5.23, market_cap: 10.8e9, total_volume: 420e6, circulating_supply: 37900000000, market_cap_rank: 29, image: 'https://assets.coingecko.com/coins/images/3688/small/hbar.png' },
  { id: 'immutable-x', symbol: 'IMX', name: 'Immutable', current_price: 1.85, price_change_percentage_24h: -4.23, market_cap: 2.9e9, total_volume: 180e6, circulating_supply: 1570000000, market_cap_rank: 30, image: 'https://assets.coingecko.com/coins/images/17233/small/immutableX-symbol-BLK-RGB.png' },
  { id: 'optimism', symbol: 'OP', name: 'Optimism', current_price: 2.15, price_change_percentage_24h: -3.56, market_cap: 2.7e9, total_volume: 320e6, circulating_supply: 1260000000, market_cap_rank: 31, image: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png' },
  { id: 'injective-protocol', symbol: 'INJ', name: 'Injective', current_price: 24.56, price_change_percentage_24h: 3.78, market_cap: 2.3e9, total_volume: 180e6, circulating_supply: 93700000, market_cap_rank: 32, image: 'https://assets.coingecko.com/coins/images/12882/small/Secondary_Symbol.png' },
  { id: 'vechain', symbol: 'VET', name: 'VeChain', current_price: 0.0485, price_change_percentage_24h: 2.34, market_cap: 3.5e9, total_volume: 120e6, circulating_supply: 72200000000, market_cap_rank: 33, image: 'https://assets.coingecko.com/coins/images/1167/small/VET_Token_Icon.png' },
  { id: 'polygon', symbol: 'POL', name: 'Polygon', current_price: 0.485, price_change_percentage_24h: 1.89, market_cap: 4.8e9, total_volume: 280e6, circulating_supply: 9900000000, market_cap_rank: 34, image: 'https://assets.coingecko.com/coins/images/4713/small/polygon.png' },
  { id: 'algorand', symbol: 'ALGO', name: 'Algorand', current_price: 0.425, price_change_percentage_24h: 4.12, market_cap: 3.5e9, total_volume: 150e6, circulating_supply: 8200000000, market_cap_rank: 35, image: 'https://assets.coingecko.com/coins/images/4380/small/download.png' },
  { id: 'bonk', symbol: 'BONK', name: 'Bonk', current_price: 0.0000412, price_change_percentage_24h: 12.45, market_cap: 2.8e9, total_volume: 1.8e9, circulating_supply: 68000000000000, market_cap_rank: 36, image: 'https://assets.coingecko.com/coins/images/28600/small/bonk.jpg' },
  { id: 'fantom', symbol: 'FTM', name: 'Fantom', current_price: 0.785, price_change_percentage_24h: 5.67, market_cap: 2.2e9, total_volume: 280e6, circulating_supply: 2800000000, market_cap_rank: 37, image: 'https://assets.coingecko.com/coins/images/4001/small/Fantom_round.png' },
  { id: 'the-graph', symbol: 'GRT', name: 'The Graph', current_price: 0.285, price_change_percentage_24h: 3.45, market_cap: 2.7e9, total_volume: 120e6, circulating_supply: 9500000000, market_cap_rank: 38, image: 'https://assets.coingecko.com/coins/images/13397/small/Graph_Token.png' },
  { id: 'theta-token', symbol: 'THETA', name: 'Theta Network', current_price: 2.15, price_change_percentage_24h: 1.23, market_cap: 2.2e9, total_volume: 65e6, circulating_supply: 1000000000, market_cap_rank: 39, image: 'https://assets.coingecko.com/coins/images/2538/small/theta-token-logo.png' },
  { id: 'aave', symbol: 'AAVE', name: 'Aave', current_price: 285.45, price_change_percentage_24h: 2.89, market_cap: 4.2e9, total_volume: 320e6, circulating_supply: 14700000, market_cap_rank: 40, image: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png' },
  { id: 'floki', symbol: 'FLOKI', name: 'FLOKI', current_price: 0.000285, price_change_percentage_24h: 8.92, market_cap: 2.7e9, total_volume: 650e6, circulating_supply: 9500000000000, market_cap_rank: 41, image: 'https://assets.coingecko.com/coins/images/16746/small/FLOKI.png' },
  { id: 'maker', symbol: 'MKR', name: 'Maker', current_price: 1685.00, price_change_percentage_24h: 0.67, market_cap: 1.5e9, total_volume: 85e6, circulating_supply: 890000, market_cap_rank: 42, image: 'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png' },
  { id: 'flow', symbol: 'FLOW', name: 'Flow', current_price: 0.865, price_change_percentage_24h: 2.34, market_cap: 1.3e9, total_volume: 75e6, circulating_supply: 1540000000, market_cap_rank: 43, image: 'https://assets.coingecko.com/coins/images/13446/small/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.png' },
  { id: 'lido-dao', symbol: 'LDO', name: 'Lido DAO', current_price: 2.45, price_change_percentage_24h: -1.56, market_cap: 2.2e9, total_volume: 120e6, circulating_supply: 890000000, market_cap_rank: 44, image: 'https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png' },
  { id: 'worldcoin-wld', symbol: 'WLD', name: 'Worldcoin', current_price: 2.85, price_change_percentage_24h: 4.56, market_cap: 2.0e9, total_volume: 280e6, circulating_supply: 700000000, market_cap_rank: 45, image: 'https://assets.coingecko.com/coins/images/31069/small/worldcoin.jpeg' },
  { id: 'mantle', symbol: 'MNT', name: 'Mantle', current_price: 1.12, price_change_percentage_24h: 1.23, market_cap: 3.6e9, total_volume: 180e6, circulating_supply: 3220000000, market_cap_rank: 46, image: 'https://assets.coingecko.com/coins/images/30980/small/token-logo.png' },
  { id: 'ondo-finance', symbol: 'ONDO', name: 'Ondo', current_price: 1.45, price_change_percentage_24h: 5.67, market_cap: 2.0e9, total_volume: 420e6, circulating_supply: 1380000000, market_cap_rank: 47, image: 'https://assets.coingecko.com/coins/images/26580/small/ONDO.png' },
  { id: 'sei-network', symbol: 'SEI', name: 'Sei', current_price: 0.485, price_change_percentage_24h: 3.21, market_cap: 1.8e9, total_volume: 280e6, circulating_supply: 3700000000, market_cap_rank: 48, image: 'https://assets.coingecko.com/coins/images/28205/small/Sei_Logo_-_Transparent.png' },
  { id: 'jupiter-exchange-solana', symbol: 'JUP', name: 'Jupiter', current_price: 0.985, price_change_percentage_24h: 2.89, market_cap: 1.3e9, total_volume: 180e6, circulating_supply: 1350000000, market_cap_rank: 49, image: 'https://assets.coingecko.com/coins/images/34188/small/jup.png' },
  { id: 'kaspa', symbol: 'KAS', name: 'Kaspa', current_price: 0.145, price_change_percentage_24h: 6.78, market_cap: 3.5e9, total_volume: 120e6, circulating_supply: 24100000000, market_cap_rank: 50, image: 'https://assets.coingecko.com/coins/images/25751/small/kaspa-icon-exchanges.png' },
];

// Top cryptocurrencies for the ticker bar
export const topCoins = allCoins.slice(0, 20).map(coin => ({
  id: coin.id,
  symbol: coin.symbol,
  name: coin.name,
  price: coin.current_price,
  change24h: coin.price_change_percentage_24h,
  marketCap: coin.market_cap,
  volume: coin.total_volume,
  image: coin.image,
}));

// Generate market cap history data for the past 30 days
const generateMarketCapHistory = () => {
  const data = [];
  const baseValue = 3.2e12; // 3.2 trillion
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some realistic variation
    const variation = (Math.random() - 0.5) * 0.08; // ±4%
    const trendFactor = 1 + (30 - i) * 0.002; // Slight upward trend
    const value = baseValue * trendFactor * (1 + variation);
    
    data.push({
      date: date.toISOString().split('T')[0],
      timestamp: date.getTime(),
      value: Math.round(value / 1e9) * 1e9, // Round to billions
      formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return data;
};

// Generate 24h volume history
const generateVolumeHistory = () => {
  const data = [];
  const baseVolume = 120e9; // 120 billion base
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Volume has more variance
    const variation = (Math.random() - 0.3) * 0.5; // More volatility
    const value = baseVolume * (1 + variation);
    
    data.push({
      date: date.toISOString().split('T')[0],
      timestamp: date.getTime(),
      value: Math.round(value / 1e9) * 1e9,
      formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return data;
};

export const marketCapHistory = generateMarketCapHistory();
export const volumeHistory = generateVolumeHistory();

// Generate BTC dominance history for the past 30 days
const generateDominanceHistory = () => {
  const data = [];
  const baseDominance = 58.9; // Base BTC dominance %
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Slight variation in dominance (±2%)
    const variation = (Math.random() - 0.5) * 4;
    const trendFactor = (30 - i) * 0.05; // Slight upward trend
    const value = baseDominance + trendFactor + variation;
    
    data.push({
      date: date.toISOString().split('T')[0],
      timestamp: date.getTime(),
      value: parseFloat(value.toFixed(1)),
      formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return data;
};

// Generate active coins history for the past 30 days
const generateActiveCoinsHistory = () => {
  const data = [];
  const baseCoins = 2800; // Base active coins
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Gradual increase in active coins
    const growth = (30 - i) * 1.5; // ~1-2 new coins per day
    const variation = Math.floor((Math.random() - 0.5) * 20); // ±10 variance
    const value = Math.floor(baseCoins + growth + variation);
    
    data.push({
      date: date.toISOString().split('T')[0],
      timestamp: date.getTime(),
      value: value,
      formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return data;
};

export const dominanceHistory = generateDominanceHistory();
export const activeCoinsHistory = generateActiveCoinsHistory();

// Bitcoin dominance data
export const dominanceData = [
  { name: 'Bitcoin', value: 58.9, color: '#f7931a' },
  { name: 'Ethereum', value: 11.6, color: '#627eea' },
  { name: 'Others', value: 29.5, color: '#8884d8' }
];

// Fear and Greed Index
export const fearGreedIndex = {
  value: 72,
  label: 'Greed',
  previousValue: 68,
  previousLabel: 'Greed',
  // Historical values for the past week
  history: [
    { date: '2026-01-24', value: 65, label: 'Greed' },
    { date: '2026-01-25', value: 68, label: 'Greed' },
    { date: '2026-01-26', value: 70, label: 'Greed' },
    { date: '2026-01-27', value: 68, label: 'Greed' },
    { date: '2026-01-28', value: 65, label: 'Greed' },
    { date: '2026-01-29', value: 68, label: 'Greed' },
    { date: '2026-01-30', value: 72, label: 'Greed' }
  ]
};

// ETH Gas prices (in Gwei)
export const gasData = {
  slow: {
    price: 12,
    time: '~10 min',
    costUsd: 1.25
  },
  standard: {
    price: 18,
    time: '~3 min',
    costUsd: 1.89
  },
  fast: {
    price: 25,
    time: '~30 sec',
    costUsd: 2.62
  },
  baseFee: 11.5,
  lastBlock: 19234567
};

// Top gainers
export const topGainers = [
  { rank: 1, id: 'pepe', symbol: 'PEPE', name: 'Pepe', price: 0.0000234, change24h: 28.45, volume: 2.3e9, marketCap: 9.8e9, image: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg' },
  { rank: 2, id: 'bonk', symbol: 'BONK', name: 'Bonk', price: 0.0000412, change24h: 22.18, volume: 1.8e9, marketCap: 2.5e9, image: 'https://assets.coingecko.com/coins/images/28600/small/bonk.jpg' },
  { rank: 3, id: 'dogwifcoin', symbol: 'WIF', name: 'dogwifhat', price: 2.85, change24h: 18.92, volume: 980e6, marketCap: 2.8e9, image: 'https://assets.coingecko.com/coins/images/33566/small/dogwifhat.jpg' },
  { rank: 4, id: 'floki', symbol: 'FLOKI', name: 'Floki', price: 0.000285, change24h: 15.67, volume: 650e6, marketCap: 2.7e9, image: 'https://assets.coingecko.com/coins/images/16746/small/PNG_image.png' },
  { rank: 5, id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', price: 0.0000285, change24h: 12.34, volume: 1.2e9, marketCap: 16.8e9, image: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png' },
  { rank: 6, id: 'render-token', symbol: 'RNDR', name: 'Render', price: 10.25, change24h: 11.89, volume: 420e6, marketCap: 5.3e9, image: 'https://assets.coingecko.com/coins/images/11636/small/rndr.png' },
  { rank: 7, id: 'injective-protocol', symbol: 'INJ', name: 'Injective', price: 35.80, change24h: 10.45, volume: 380e6, marketCap: 3.4e9, image: 'https://assets.coingecko.com/coins/images/12882/small/Secondary_Symbol.png' },
  { rank: 8, id: 'fetch-ai', symbol: 'FET', name: 'Fetch.ai', price: 2.35, change24h: 9.78, volume: 290e6, marketCap: 2.0e9, image: 'https://assets.coingecko.com/coins/images/5681/small/Fetch.jpg' },
  { rank: 9, id: 'sui', symbol: 'SUI', name: 'Sui', price: 1.85, change24h: 8.92, volume: 520e6, marketCap: 2.3e9, image: 'https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg' },
  { rank: 10, id: 'sei-network', symbol: 'SEI', name: 'Sei', price: 0.78, change24h: 8.45, volume: 180e6, marketCap: 2.1e9, image: 'https://assets.coingecko.com/coins/images/28205/small/Sei_Logo_-_Transparent.png' },
  { rank: 11, id: 'the-graph', symbol: 'GRT', name: 'The Graph', price: 0.32, change24h: 7.89, volume: 145e6, marketCap: 3.0e9, image: 'https://assets.coingecko.com/coins/images/13397/small/Graph_Token.png' },
  { rank: 12, id: 'arweave', symbol: 'AR', name: 'Arweave', price: 42.50, change24h: 7.23, volume: 95e6, marketCap: 2.8e9, image: 'https://assets.coingecko.com/coins/images/4343/small/oRt6SiEN_400x400.jpg' },
  { rank: 13, id: 'stacks', symbol: 'STX', name: 'Stacks', price: 2.15, change24h: 6.78, volume: 120e6, marketCap: 3.1e9, image: 'https://assets.coingecko.com/coins/images/2069/small/Stacks_logo_full.png' },
  { rank: 14, id: 'theta-token', symbol: 'THETA', name: 'Theta Network', price: 2.45, change24h: 6.34, volume: 85e6, marketCap: 2.5e9, image: 'https://assets.coingecko.com/coins/images/2538/small/theta-token-logo.png' },
  { rank: 15, id: 'gala', symbol: 'GALA', name: 'Gala', price: 0.052, change24h: 5.89, volume: 210e6, marketCap: 1.8e9, image: 'https://assets.coingecko.com/coins/images/12493/small/GALA-COINGECKO.png' },
  { rank: 16, id: 'ondo-finance', symbol: 'ONDO', name: 'Ondo', price: 1.28, change24h: 5.45, volume: 165e6, marketCap: 1.7e9, image: 'https://assets.coingecko.com/coins/images/26580/small/ONDO.png' },
  { rank: 17, id: 'worldcoin-wld', symbol: 'WLD', name: 'Worldcoin', price: 4.85, change24h: 4.92, volume: 320e6, marketCap: 1.5e9, image: 'https://assets.coingecko.com/coins/images/31069/small/worldcoin.jpeg' },
  { rank: 18, id: 'conflux-token', symbol: 'CFX', name: 'Conflux', price: 0.24, change24h: 4.56, volume: 78e6, marketCap: 1.1e9, image: 'https://assets.coingecko.com/coins/images/13079/small/3vuYMbjN.png' },
  { rank: 19, id: 'beam-2', symbol: 'BEAM', name: 'Beam', price: 0.028, change24h: 4.12, volume: 95e6, marketCap: 1.4e9, image: 'https://assets.coingecko.com/coins/images/32417/small/chain-logo.png' },
  { rank: 20, id: 'aevo', symbol: 'AEVO', name: 'Aevo', price: 1.45, change24h: 3.89, volume: 62e6, marketCap: 0.9e9, image: 'https://assets.coingecko.com/coins/images/35893/small/aevo.png' }
];

// Top losers
export const topLosers = [
  { rank: 1, id: 'aptos', symbol: 'APT', name: 'Aptos', price: 8.45, change24h: -12.34, volume: 450e6, marketCap: 3.8e9, image: 'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png' },
  { rank: 2, id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', price: 1.12, change24h: -9.87, volume: 380e6, marketCap: 3.2e9, image: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg' },
  { rank: 3, id: 'optimism', symbol: 'OP', name: 'Optimism', price: 2.15, change24h: -8.56, volume: 320e6, marketCap: 2.5e9, image: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png' },
  { rank: 4, id: 'immutable-x', symbol: 'IMX', name: 'Immutable', price: 1.85, change24h: -7.23, volume: 180e6, marketCap: 2.8e9, image: 'https://assets.coingecko.com/coins/images/17233/small/immutableX-symbol-BLK-RGB.png' },
  { rank: 5, id: 'blur', symbol: 'BLUR', name: 'Blur', price: 0.42, change24h: -6.89, volume: 95e6, marketCap: 0.6e9, image: 'https://assets.coingecko.com/coins/images/28453/small/blur.png' },
  { rank: 6, id: 'lido-dao', symbol: 'LDO', name: 'Lido DAO', price: 2.35, change24h: -6.45, volume: 145e6, marketCap: 2.1e9, image: 'https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png' },
  { rank: 7, id: 'maker', symbol: 'MKR', name: 'Maker', price: 2850, change24h: -5.92, volume: 125e6, marketCap: 2.6e9, image: 'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png' },
  { rank: 8, id: 'aave', symbol: 'AAVE', name: 'Aave', price: 142, change24h: -5.67, volume: 185e6, marketCap: 2.1e9, image: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png' },
  { rank: 9, id: 'thorchain', symbol: 'RUNE', name: 'THORChain', price: 5.25, change24h: -5.23, volume: 165e6, marketCap: 1.8e9, image: 'https://assets.coingecko.com/coins/images/6595/small/Rune200x200.png' },
  { rank: 10, id: 'gmx', symbol: 'GMX', name: 'GMX', price: 48.50, change24h: -4.89, volume: 42e6, marketCap: 0.5e9, image: 'https://assets.coingecko.com/coins/images/18323/small/arbit.png' },
  { rank: 11, id: 'curve-dao-token', symbol: 'CRV', name: 'Curve DAO', price: 0.58, change24h: -4.56, volume: 95e6, marketCap: 0.7e9, image: 'https://assets.coingecko.com/coins/images/12124/small/Curve.png' },
  { rank: 12, id: 'synthetix-network-token', symbol: 'SNX', name: 'Synthetix', price: 3.25, change24h: -4.23, volume: 78e6, marketCap: 1.1e9, image: 'https://assets.coingecko.com/coins/images/3406/small/SNX.png' },
  { rank: 13, id: 'ens', symbol: 'ENS', name: 'Ethereum Name Service', price: 24.50, change24h: -3.89, volume: 85e6, marketCap: 0.8e9, image: 'https://assets.coingecko.com/coins/images/19785/small/acatxTm8_400x400.jpg' },
  { rank: 14, id: '1inch', symbol: '1INCH', name: '1inch', price: 0.52, change24h: -3.56, volume: 62e6, marketCap: 0.6e9, image: 'https://assets.coingecko.com/coins/images/13469/small/1inch-token.png' },
  { rank: 15, id: 'compound-governance-token', symbol: 'COMP', name: 'Compound', price: 68.50, change24h: -3.23, volume: 55e6, marketCap: 0.6e9, image: 'https://assets.coingecko.com/coins/images/10775/small/COMP.png' },
  { rank: 16, id: 'yearn-finance', symbol: 'YFI', name: 'yearn.finance', price: 8450, change24h: -2.89, volume: 35e6, marketCap: 0.3e9, image: 'https://assets.coingecko.com/coins/images/11849/small/yearn.jpg' },
  { rank: 17, id: 'balancer', symbol: 'BAL', name: 'Balancer', price: 4.25, change24h: -2.56, volume: 28e6, marketCap: 0.3e9, image: 'https://assets.coingecko.com/coins/images/11683/small/Balancer.png' },
  { rank: 18, id: 'zcash', symbol: 'ZEC', name: 'Zcash', price: 28.50, change24h: -2.23, volume: 45e6, marketCap: 0.5e9, image: 'https://assets.coingecko.com/coins/images/486/small/circle-zcash-color.png' },
  { rank: 19, id: 'decentraland', symbol: 'MANA', name: 'Decentraland', price: 0.48, change24h: -1.89, volume: 85e6, marketCap: 0.9e9, image: 'https://assets.coingecko.com/coins/images/878/small/decentraland-mana.png' },
  { rank: 20, id: 'the-sandbox', symbol: 'SAND', name: 'The Sandbox', price: 0.52, change24h: -1.56, volume: 95e6, marketCap: 1.2e9, image: 'https://assets.coingecko.com/coins/images/12129/small/sandbox_logo.jpg' }
];

// Market statistics
export const marketStats = {
  totalMarketCap: 3.45e12,
  totalMarketCapChange: 2.34,
  total24hVolume: 142.8e9,
  total24hVolumeChange: -5.67,
  btcDominance: 58.9,
  ethDominance: 11.6,
  activeCoins: 2847,
  activePairs: 12453
};

// Utility function to format large numbers
export const formatNumber = (num, decimals = 2) => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(decimals)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
  return `$${num.toFixed(decimals)}`;
};

// Format price based on value
export const formatPrice = (price) => {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.0001) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(8)}`;
};

// Format percentage change
export const formatChange = (change) => {
  const prefix = change >= 0 ? '+' : '';
  return `${prefix}${change.toFixed(2)}%`;
};

// Coin descriptions for detail pages
const coinDescriptions = {
  bitcoin: 'Bitcoin is the first successful internet money based on peer-to-peer technology. No single institution or person controls it. Bitcoin was designed to be transparent and free from central control. Bitcoin transactions are verified by network nodes through cryptography and recorded in a public distributed ledger called a blockchain.',
  ethereum: 'Ethereum is a decentralized platform that runs smart contracts: applications that run exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference. Ethereum enables developers to build and deploy decentralized applications.',
  solana: 'Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale today. Solana is known for its fast transaction speeds and low fees, making it popular for DeFi and NFT applications.',
  ripple: 'XRP is the native cryptocurrency of the XRP Ledger, an open-source, public blockchain designed to facilitate faster and cheaper cross-border payments compared to traditional banking systems.',
  cardano: 'Cardano is a blockchain platform for changemakers, innovators, and visionaries. It is a proof-of-stake blockchain platform that says its goal is to allow "changemakers, innovators and visionaries" to bring about positive global change.',
  dogecoin: 'Dogecoin is a cryptocurrency that was created as a joke in 2013 but has since grown into a legitimate digital currency with a strong community. It features the Shiba Inu dog from the "Doge" meme as its logo.',
  polkadot: 'Polkadot is a next-generation blockchain protocol that unites an entire network of purpose-built blockchains, allowing them to operate seamlessly together at scale.',
  chainlink: 'Chainlink is a decentralized oracle network that provides real-world data to smart contracts on the blockchain. It connects smart contracts with external data sources, APIs, and payment systems.',
  avalanche: 'Avalanche is a layer one blockchain that functions as a platform for decentralized applications and custom blockchain networks. It aims to be fast, low-cost, and eco-friendly.',
  uniswap: 'Uniswap is a decentralized cryptocurrency exchange that uses a set of smart contracts to create liquidity pools for trading tokens on the Ethereum blockchain.',
};

/**
 * Get paginated coins for the coins list page
 * @param {number} page - Page number (1-indexed)
 * @param {number} perPage - Items per page
 * @returns {Array} Paginated coin data
 */
export function getMockCoinsPage(page = 1, perPage = 50) {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  return allCoins.slice(startIndex, endIndex);
}

/**
 * Get coin details (mock data)
 * @param {string} id - Coin ID
 * @returns {Object|null} Coin details or null if not found
 */
export function getCoinDetailsFallback(id) {
  // Find coin in allCoins
  const coin = allCoins.find(c => c.id === id);
  
  if (coin) {
    const description = coinDescriptions[id] || `${coin.name} (${coin.symbol}) is a cryptocurrency ranked #${coin.market_cap_rank} by market capitalization. It is traded on various exchanges worldwide.`;
    
    return {
      id: coin.id,
      symbol: coin.symbol.toLowerCase(),
      name: coin.name,
      description: { en: description },
      image: {
        large: coin.image?.replace('/small/', '/large/') || coin.image,
        small: coin.image,
      },
      market_cap_rank: coin.market_cap_rank,
      market_data: {
        current_price: { usd: coin.current_price },
        market_cap: { usd: coin.market_cap },
        total_volume: { usd: coin.total_volume },
        price_change_percentage_24h: coin.price_change_percentage_24h,
        price_change_percentage_7d: coin.price_change_percentage_24h * 2.1,
        price_change_percentage_30d: coin.price_change_percentage_24h * 4.5,
        high_24h: { usd: coin.current_price * 1.025 },
        low_24h: { usd: coin.current_price * 0.975 },
        ath: { usd: coin.current_price * 1.35 },
        ath_change_percentage: { usd: -25.9 },
        circulating_supply: coin.circulating_supply,
      },
      links: { homepage: [] },
    };
  }
  
  return null;
}

/**
 * Generate price history for a coin (mock data)
 * @param {string} id - Coin ID
 * @param {number} days - Number of days of history
 * @returns {Array} Price history data
 */
export function getCoinHistoryFallback(id, days = 7) {
  const coin = allCoins.find(c => c.id === id);
  const basePrice = coin?.current_price || 100;
  
  const data = [];
  const now = new Date();
  const dataPoints = Math.min(days * 24, 168); // Hourly data, max 7 days
  
  for (let i = dataPoints; i >= 0; i--) {
    const date = new Date(now);
    date.setHours(date.getHours() - i);
    
    // Add some realistic variation
    const variation = (Math.random() - 0.5) * 0.06;
    const trendFactor = 1 + (dataPoints - i) * 0.0005;
    const price = basePrice * trendFactor * (1 + variation);
    
    data.push({
      date: date.toISOString(),
      price: price,
    });
  }
  
  return data;
}

/**
 * Search coins by name or symbol (mock data)
 * @param {string} query - Search query
 * @returns {Array} Matching coins
 */
export function searchCoinsMock(query) {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return allCoins
    .filter(coin => 
      coin.name.toLowerCase().includes(lowerQuery) ||
      coin.symbol.toLowerCase().includes(lowerQuery)
    )
    .slice(0, 10)
    .map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      marketCapRank: coin.market_cap_rank,
    }));
}
