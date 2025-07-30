// utils/economicEvents.js
// Economic events from 1984-2025 with vague, timeless descriptions

export const economicEvents = {
  1984: [
    { month: 11, event: "Conservative President Re-elected", sentiment: "positive" }
  ],
  1985: [
    { month: 9, event: "Major Trade Agreement Signed", sentiment: "positive" }
  ],
  1986: [
    { month: 4, event: "Major Industrial Accident Overseas", sentiment: "negative" },
    { month: 11, event: "Political Scandal Breaks", sentiment: "negative" }
  ],
  1987: [
    { month: 10, event: "Major Market Crash - Black Monday", sentiment: "very_negative" }
  ],
  1988: [
    { month: 11, event: "Establishment Candidate Wins Election", sentiment: "neutral" }
  ],
  1989: [
    { month: 11, event: "Major Political Barrier Falls in Europe", sentiment: "positive" }
  ],
  1990: [
    { month: 8, event: "Middle East Conflict Begins", sentiment: "negative" },
    { month: 7, event: "Recession Officially Declared", sentiment: "negative" }
  ],
  1991: [
    { month: 1, event: "Middle East War Begins", sentiment: "negative" },
    { month: 3, event: "War Ends Successfully", sentiment: "positive" }
  ],
  1992: [
    { month: 11, event: "Democratic President Elected", sentiment: "neutral" }
  ],
  1993: [
    { month: 2, event: "Major Terrorist Attack on Financial Center", sentiment: "negative" }
  ],
  1994: [
    { month: 2, event: "Federal Reserve Raises Interest Rates", sentiment: "negative" },
    { month: 12, event: "Major International Trade Agreement", sentiment: "positive" }
  ],
  1995: [
    { month: 4, event: "Domestic Terrorist Attack", sentiment: "negative" }
  ],
  1996: [
    { month: 11, event: "Incumbent President Re-elected", sentiment: "neutral" }
  ],
  1997: [
    { month: 10, event: "Asian Financial Crisis Spreads", sentiment: "negative" }
  ],
  1998: [
    { month: 8, event: "Russian Financial Crisis", sentiment: "negative" },
    { month: 9, event: "Major Hedge Fund Collapses", sentiment: "negative" }
  ],
  1999: [
    { month: 12, event: "Y2K Preparations Complete", sentiment: "neutral" }
  ],
  2000: [
    { month: 3, event: "Technology Bubble Peaks", sentiment: "negative" },
    { month: 11, event: "Contested Presidential Election", sentiment: "negative" }
  ],
  2001: [
    { month: 3, event: "Economic Recession Begins", sentiment: "negative" },
    { month: 9, event: "Major Terrorist Attack on Financial District", sentiment: "very_negative" }
  ],
  2002: [
    { month: 7, event: "Major Corporate Accounting Scandal", sentiment: "negative" }
  ],
  2003: [
    { month: 3, event: "Military Conflict in Middle East", sentiment: "negative" }
  ],
  2004: [
    { month: 11, event: "Republican President Re-elected", sentiment: "neutral" }
  ],
  2005: [
    { month: 8, event: "Major Natural Disaster Hits Gulf Coast", sentiment: "negative" }
  ],
  2006: [
    { month: 6, event: "Housing Market Shows Signs of Stress", sentiment: "negative" }
  ],
  2007: [
    { month: 8, event: "Credit Market Turmoil Begins", sentiment: "negative" }
  ],
  2008: [
    { month: 3, event: "Major Investment Bank Acquired in Fire Sale", sentiment: "negative" },
    { month: 9, event: "Major Investment Bank Collapses", sentiment: "very_negative" },
    { month: 10, event: "Government Bank Bailout Program", sentiment: "negative" },
    { month: 11, event: "Democratic President Elected", sentiment: "neutral" }
  ],
  2009: [
    { month: 2, event: "Economic Stimulus Package Passed", sentiment: "positive" },
    { month: 3, event: "Market Hits Multi-Year Low", sentiment: "negative" }
  ],
  2010: [
    { month: 5, event: "European Debt Crisis Intensifies", sentiment: "negative" }
  ],
  2011: [
    { month: 8, event: "U.S. Credit Rating Downgraded", sentiment: "negative" },
    { month: 9, event: "European Banking Crisis", sentiment: "negative" }
  ],
  2012: [
    { month: 11, event: "Democratic President Re-elected", sentiment: "neutral" }
  ],
  2013: [
    { month: 5, event: "Central Bank Hints at Policy Change", sentiment: "negative" }
  ],
  2014: [
    { month: 10, event: "Oil Prices Begin Major Decline", sentiment: "mixed" }
  ],
  2015: [
    { month: 8, event: "Chinese Market Turmoil", sentiment: "negative" },
    { month: 12, event: "Federal Reserve Raises Rates for First Time in Years", sentiment: "neutral" }
  ],
  2016: [
    { month: 6, event: "Major European Political Referendum", sentiment: "negative" },
    { month: 11, event: "Unexpected Presidential Election Result", sentiment: "mixed" }
  ],
  2017: [
    { month: 12, event: "Major Tax Reform Legislation Passed", sentiment: "positive" }
  ],
  2018: [
    { month: 2, event: "Interest Rate Fears Spike", sentiment: "negative" },
    { month: 10, event: "Technology Stocks Sell-Off", sentiment: "negative" }
  ],
  2019: [
    { month: 8, event: "Trade War Escalates", sentiment: "negative" },
    { month: 9, event: "Central Bank Cuts Rates", sentiment: "positive" }
  ],
  2020: [
    { month: 3, event: "Global Pandemic Declared", sentiment: "very_negative" },
    { month: 3, event: "Unprecedented Monetary Stimulus", sentiment: "positive" },
    { month: 11, event: "Democratic President Elected", sentiment: "neutral" }
  ],
  2021: [
    { month: 1, event: "Political Unrest at Capitol", sentiment: "negative" },
    { month: 3, event: "Major Fiscal Stimulus Package", sentiment: "positive" }
  ],
  2022: [
    { month: 2, event: "Major European Military Conflict", sentiment: "negative" },
    { month: 6, event: "Inflation Reaches Multi-Decade High", sentiment: "negative" }
  ],
  2023: [
    { month: 3, event: "Regional Banking Crisis", sentiment: "negative" },
    { month: 11, event: "AI Technology Breakthrough", sentiment: "positive" }
  ],
  2024: [
    { month: 11, event: "Republican President Elected", sentiment: "neutral" }
  ],
  2025: [
    { month: 1, event: "New Administration Takes Office", sentiment: "neutral" }
  ]
};

// Helper function to get events for a specific time period
export const getEventsForPeriod = (startYear, startMonth, endYear, endMonth) => {
  const events = [];
  
  for (let year = startYear; year <= endYear; year++) {
    if (economicEvents[year]) {
      economicEvents[year].forEach(event => {
        // Check if event falls within the period
        if (year === startYear && event.month < startMonth) return;
        if (year === endYear && event.month > endMonth) return;
        
        events.push({
          ...event,
          year,
          date: `${year}-${event.month.toString().padStart(2, '0')}-01`
        });
      });
    }
  }
  
  return events;
};

// Helper function to get random events for a game period
export const getRandomEventsForGame = (gameData, gameMode = 'classic') => {
  if (!gameData) return [];
  
  // Get start and end dates from game data
  const dataArray = gameMode === 'diversified' ? gameData.SP500 : gameData;
  const startDate = new Date(dataArray[0].date);
  const endDate = new Date(dataArray[dataArray.length - 1].date);
  
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth() + 1;
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth() + 1;
  
  // Get all events in the period
  const allEvents = getEventsForPeriod(startYear, startMonth, endYear, endMonth);
  
  // Randomly select 30-60% of events to show
  const eventCount = Math.floor(allEvents.length * (0.3 + Math.random() * 0.3));
  const selectedEvents = [];
  
  // Shuffle and select events
  const shuffled = [...allEvents].sort(() => 0.5 - Math.random());
  for (let i = 0; i < Math.min(eventCount, shuffled.length); i++) {
    selectedEvents.push(shuffled[i]);
  }
  
  // Sort by date
  return selectedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Map sentiment to colors
export const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case 'very_positive': return '#38ef7d';
    case 'positive': return '#4facfe';
    case 'neutral': return '#8e8e93';
    case 'mixed': return '#ffce54';
    case 'negative': return '#ff6b6b';
    case 'very_negative': return '#ff4757';
    default: return '#8e8e93';
  }
};

// Map sentiment to icons
export const getSentimentIcon = (sentiment) => {
  switch (sentiment) {
    case 'very_positive': return 'trending-up';
    case 'positive': return 'arrow-up';
    case 'neutral': return 'remove';
    case 'mixed': return 'swap-horizontal';
    case 'negative': return 'arrow-down';
    case 'very_negative': return 'trending-down';
    default: return 'help';
  }
};