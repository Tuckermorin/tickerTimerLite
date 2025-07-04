// utils/generator.js
// Generates synthetic S&P 500 price data for market timing simulation

/**
 * Generates monthly S&P 500 prices using a random walk with realistic parameters
 * @param {number} months - Number of months to generate
 * @param {number} startPrice - Starting price (default: 4500)
 * @returns {Array} Array of price objects with date and price
 */
export const generateMonthlyPrices = (months = 24, startPrice = 4500) => {
  const prices = [];
  let currentPrice = startPrice;
  const currentDate = new Date();
  
  for (let i = 0; i < months; i++) {
    // Create date for this month (going backwards from current date)
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - (months - 1 - i));
    
    // Generate realistic monthly return
    // S&P 500 historical: ~10% annual return, ~15% annual volatility
    // Monthly: ~0.8% return, ~4.3% volatility
    const monthlyReturn = generateMonthlyReturn();
    
    if (i > 0) {
      currentPrice = prices[i - 1].price * (1 + monthlyReturn);
    }
    
    prices.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      price: Math.round(currentPrice * 100) / 100, // Round to 2 decimals
      month: i,
      return: i > 0 ? monthlyReturn : 0
    });
  }
  
  return prices;
};

/**
 * Generates a realistic monthly return for S&P 500
 * Uses normal distribution approximation with realistic parameters
 */
const generateMonthlyReturn = () => {
  // Box-Muller transformation for normal distribution
  const u1 = Math.random();
  const u2 = Math.random();
  const standardNormal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  
  // S&P 500 parameters (monthly)
  const meanReturn = 0.008; // ~0.8% monthly (10% annual)
  const volatility = 0.043; // ~4.3% monthly volatility
  
  return meanReturn + (standardNormal * volatility);
};

/**
 * Calculates portfolio performance for a given strategy
 * @param {Array} prices - Array of price data
 * @param {Object} strategy - Strategy object with timing and amount info
 * @param {number} initialCash - Starting cash amount
 * @returns {Object} Portfolio performance data
 */
export const calculatePortfolioPerformance = (prices, strategy, initialCash = 10000) => {
  let cash = initialCash;
  let shares = 0;
  const trades = [];
  const portfolioHistory = [];
  
  prices.forEach((priceData, index) => {
    const { price, date } = priceData;
    
    // Check if we should trade this month based on strategy
    const shouldTrade = shouldExecuteTrade(date, strategy, index);
    
    if (shouldTrade && strategy.amount > 0) {
      if (strategy.action === 'buy' && cash >= strategy.amount) {
        // Buy shares
        const sharesToBuy = strategy.amount / price;
        shares += sharesToBuy;
        cash -= strategy.amount;
        
        trades.push({
          date,
          action: 'buy',
          price,
          amount: strategy.amount,
          shares: sharesToBuy,
          totalShares: shares,
          cash
        });
      } else if (strategy.action === 'sell' && shares > 0) {
        // Sell shares (sell dollar amount worth of shares)
        const sharesToSell = Math.min(strategy.amount / price, shares);
        const saleAmount = sharesToSell * price;
        shares -= sharesToSell;
        cash += saleAmount;
        
        trades.push({
          date,
          action: 'sell',
          price,
          amount: saleAmount,
          shares: sharesToSell,
          totalShares: shares,
          cash
        });
      }
    }
    
    // Calculate current portfolio value
    const portfolioValue = cash + (shares * price);
    portfolioHistory.push({
      date,
      price,
      cash,
      shares,
      portfolioValue,
      totalReturn: portfolioValue - initialCash,
      totalReturnPercent: ((portfolioValue - initialCash) / initialCash) * 100
    });
  });
  
  const finalValue = portfolioHistory[portfolioHistory.length - 1];
  
  return {
    trades,
    portfolioHistory,
    finalCash: finalValue.cash,
    finalShares: finalValue.shares,
    finalValue: finalValue.portfolioValue,
    totalReturn: finalValue.totalReturn,
    totalReturnPercent: finalValue.totalReturnPercent
  };
};

/**
 * Determines if a trade should be executed based on strategy
 */
const shouldExecuteTrade = (date, strategy, monthIndex) => {
  if (!strategy || !strategy.timing) return false;
  
  const tradeDate = new Date(date);
  const dayOfMonth = tradeDate.getDate();
  
  // Simple timing strategies
  switch (strategy.timing) {
    case 'first':
      return dayOfMonth <= 5; // First few days of month
    case 'middle':
      return dayOfMonth >= 13 && dayOfMonth <= 17; // Middle of month
    case 'last':
      return dayOfMonth >= 25; // Last few days of month
    case 'monthly':
      return monthIndex % strategy.frequency === 0; // Every N months
    default:
      return true;
  }
};

/**
 * Calculates buy-and-hold comparison performance
 */
export const calculateBuyAndHold = (prices, initialCash = 10000) => {
  if (prices.length === 0) return null;
  
  const startPrice = prices[0].price;
  const endPrice = prices[prices.length - 1].price;
  const totalShares = initialCash / startPrice;
  const finalValue = totalShares * endPrice;
  
  return {
    initialCash,
    finalValue,
    totalReturn: finalValue - initialCash,
    totalReturnPercent: ((finalValue - initialCash) / initialCash) * 100,
    shares: totalShares
  };
};