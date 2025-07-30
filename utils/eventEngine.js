// utils/eventEngine.js
// Logic for triggering economic events during gameplay

import { getRandomEventsForGame } from './economicEvents';

export class EventEngine {
  constructor(gameData, gameMode, hasEconomicEvents) {
    this.gameData = gameData;
    this.gameMode = gameMode;
    this.hasEconomicEvents = hasEconomicEvents;
    this.events = [];
    this.currentMonth = 0;
    this.triggeredEvents = new Set();
    
    if (hasEconomicEvents) {
      this.initializeEvents();
    }
  }

  initializeEvents() {
    // Get random events for this game period
    const allEvents = getRandomEventsForGame(this.gameData, this.gameMode);
    
    // Map events to specific months in the game
    this.events = allEvents.map(event => {
      // Find the corresponding month in the game data
      const gameDataArray = this.gameMode === 'diversified' ? this.gameData.SP500 : this.gameData;
      const eventDate = new Date(event.date);
      
      // Find the closest month in the game data
      let closestMonth = 0;
      let closestDiff = Infinity;
      
      gameDataArray.forEach((dataPoint, index) => {
        const dataDate = new Date(dataPoint.date);
        const diff = Math.abs(dataDate.getTime() - eventDate.getTime());
        
        if (diff < closestDiff) {
          closestDiff = diff;
          closestMonth = index;
        }
      });
      
      // Add some randomness (±2 months) to avoid predictability
      const randomOffset = Math.floor(Math.random() * 5) - 2; // -2 to +2
      const finalMonth = Math.max(0, Math.min(
        gameDataArray.length - 1,
        closestMonth + randomOffset
      ));
      
      return {
        ...event,
        triggerMonth: finalMonth
      };
    });
    
    // Sort events by trigger month
    this.events.sort((a, b) => a.triggerMonth - b.triggerMonth);
    
    console.log(`EventEngine: Initialized with ${this.events.length} events`);
  }

  // Check if any events should be triggered this month
  checkForEvents(currentMonth) {
    if (!this.hasEconomicEvents) return null;
    
    this.currentMonth = currentMonth;
    
    // Find events that should trigger this month
    const eventsToTrigger = this.events.filter(event => 
      event.triggerMonth === currentMonth && 
      !this.triggeredEvents.has(event.triggerMonth)
    );
    
    if (eventsToTrigger.length > 0) {
      // Mark these events as triggered
      eventsToTrigger.forEach(event => {
        this.triggeredEvents.add(event.triggerMonth);
      });
      
      // Return the first event (in case multiple events are scheduled for the same month)
      return eventsToTrigger[0];
    }
    
    return null;
  }

  // Get all events for debugging/testing
  getAllEvents() {
    return this.events;
  }

  // Get triggered events count
  getTriggeredCount() {
    return this.triggeredEvents.size;
  }

  // Reset the engine (for new games)
  reset() {
    this.triggeredEvents.clear();
    this.currentMonth = 0;
  }
}

// Helper function to create event engine
export const createEventEngine = (gameData, gameMode, hasEconomicEvents) => {
  return new EventEngine(gameData, gameMode, hasEconomicEvents);
};

// Helper function to format event for display
export const formatEventForDisplay = (event) => {
  if (!event) return null;
  
  return {
    event: event.event,
    sentiment: event.sentiment,
    month: event.triggerMonth,
    year: event.year,
    originalDate: event.date
  };
};