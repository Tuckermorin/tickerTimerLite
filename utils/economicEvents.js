// utils/economicEvents.js
// Economic events with configurable count for different game modes

export const economicEvents = [
  // Presidential Elections (every 4 years)
  { event: "A Conservative Republican candidate wins the presidential election", sentiment: "positive", type: "election" },
  { event: "A Progressive Democrat candidate wins the presidential election", sentiment: "mixed", type: "election" },
  { event: "An incumbent president is re-elected for a second term", sentiment: "neutral", type: "election" },
  { event: "A business-friendly candidate wins in a surprise victory", sentiment: "positive", type: "election" },
  { event: "Political uncertainty as election results are contested", sentiment: "negative", type: "election" },
  
  // Federal Reserve Actions
  { event: "Federal Reserve cuts interest rates to stimulate the economy", sentiment: "positive", type: "fed" },
  { event: "Federal Reserve raises interest rates to combat inflation", sentiment: "negative", type: "fed" },
  { event: "Federal Reserve signals more aggressive rate cuts ahead", sentiment: "very_positive", type: "fed" },
  { event: "Federal Reserve indicates prolonged period of higher rates", sentiment: "negative", type: "fed" },
  { event: "Emergency Fed meeting called amid economic uncertainty", sentiment: "very_negative", type: "fed" },
  
  // Economic Crises
  { event: "Major investment bank files for bankruptcy", sentiment: "very_negative", type: "crisis" },
  { event: "Housing market shows signs of significant stress", sentiment: "negative", type: "crisis" },
  { event: "Technology bubble concerns grow as valuations soar", sentiment: "negative", type: "crisis" },
  { event: "Credit markets experience severe disruption", sentiment: "very_negative", type: "crisis" },
  { event: "Government announces major financial sector bailout", sentiment: "mixed", type: "crisis" },
  
  // Geopolitical Events
  { event: "Military conflict erupts in strategically important region", sentiment: "negative", type: "geopolitical" },
  { event: "Major trade agreement signed with key economic partners", sentiment: "positive", type: "geopolitical" },
  { event: "Trade war escalates with major economic power", sentiment: "negative", type: "geopolitical" },
  { event: "Terrorist attack rocks major financial center", sentiment: "very_negative", type: "geopolitical" },
  { event: "International crisis resolved through diplomacy", sentiment: "positive", type: "geopolitical" },
  
  // Economic Indicators
  { event: "Unemployment rate hits multi-decade low", sentiment: "positive", type: "economic" },
  { event: "Inflation reaches highest level in decades", sentiment: "negative", type: "economic" },
  { event: "GDP growth exceeds all expectations", sentiment: "positive", type: "economic" },
  { event: "Economic recession officially declared", sentiment: "very_negative", type: "economic" },
  { event: "Corporate earnings disappoint across multiple sectors", sentiment: "negative", type: "economic" },
  
  // Market Events
  { event: "Market volatility spikes to extreme levels", sentiment: "negative", type: "market" },
  { event: "New market highs reached amid strong investor confidence", sentiment: "positive", type: "market" },
  { event: "Major market correction underway", sentiment: "negative", type: "market" },
  { event: "Institutional investors flee to safe haven assets", sentiment: "negative", type: "market" },
  { event: "Market sentiment improves on economic optimism", sentiment: "positive", type: "market" }
];

// Helper function to get random events for a game with configurable count
export const getRandomEventsForGame = (gameLength, eventCount = 10) => {
  // Always include some key event types for longer games
  if (eventCount >= 5) {
    const guaranteedTypes = ['election', 'fed', 'crisis'];
    const guaranteedEvents = [];
    
    // Get at least one of each guaranteed type
    guaranteedTypes.forEach(type => {
      const typeEvents = economicEvents.filter(e => e.type === type);
      if (typeEvents.length > 0) {
        const randomEvent = typeEvents[Math.floor(Math.random() * typeEvents.length)];
        guaranteedEvents.push(randomEvent);
      }
    });
    
    // Fill the rest randomly up to the desired event count
    const remainingSlots = eventCount - guaranteedEvents.length;
    const availableEvents = economicEvents.filter(event => 
      !guaranteedEvents.some(ge => ge.event === event.event)
    );
    
    const shuffled = availableEvents.sort(() => 0.5 - Math.random());
    const additionalEvents = shuffled.slice(0, remainingSlots);
    
    const allSelectedEvents = [...guaranteedEvents, ...additionalEvents];
    
    // Assign random months to events, ensuring they're spread out
    return allSelectedEvents.map((event, index) => {
      // Spread events across the game timeline
      const monthSpacing = Math.floor(gameLength / eventCount);
      const baseMonth = monthSpacing * index + Math.floor(Math.random() * (monthSpacing * 0.8));
      const triggerMonth = Math.min(baseMonth, gameLength - 1);
      
      return {
        ...event,
        triggerMonth
      };
    }).sort((a, b) => a.triggerMonth - b.triggerMonth);
  } else {
    // For speed mode (5 events), just pick 5 random events
    const shuffled = economicEvents.sort(() => 0.5 - Math.random());
    const selectedEvents = shuffled.slice(0, eventCount);
    
    // Spread them evenly across the timeline
    return selectedEvents.map((event, index) => {
      const monthSpacing = Math.floor(gameLength / eventCount);
      const triggerMonth = Math.min(
        monthSpacing * index + Math.floor(Math.random() * (monthSpacing * 0.8)),
        gameLength - 1
      );
      
      return {
        ...event,
        triggerMonth
      };
    }).sort((a, b) => a.triggerMonth - b.triggerMonth);
  }
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