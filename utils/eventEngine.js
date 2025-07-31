// utils/eventEngine.js
// Simplified event engine for 10 random news flashes per game

import { getRandomEventsForGame } from './economicEvents';

export class EventEngine {
  constructor(gameData, gameMode, hasEconomicEvents) {
    this.gameData = gameData;
    this.gameMode = gameMode;
    this.hasEconomicEvents = hasEconomicEvents;
    this.events = [];
    this.triggeredEvents = new Set();
    
    if (hasEconomicEvents) {
      this.initializeEvents();
    }
  }

  initializeEvents() {
    console.log('Initializing event engine with 10 random events...');
    
    // Determine game length
    const gameLength = this.gameMode === 'speedrun' ? 120 : 240; // 10 or 20 years in months
    
    // Get exactly 10 random events spread throughout the game
    this.events = getRandomEventsForGame(gameLength);
    
    console.log(`EventEngine: Initialized with ${this.events.length} events:`);
    this.events.forEach((event, index) => {
      console.log(`  ${index + 1}. Month ${event.triggerMonth}: ${event.event}`);
    });
  }

  // Check if any events should be triggered this month
  checkForEvents(currentMonth) {
    if (!this.hasEconomicEvents) {
      return null;
    }
    
    // Find events that should trigger this month
    const eventsToTrigger = this.events.filter(event => 
      event.triggerMonth === currentMonth && 
      !this.triggeredEvents.has(event.triggerMonth)
    );
    
    if (eventsToTrigger.length > 0) {
      console.log(`Triggering event at month ${currentMonth}:`, eventsToTrigger[0]);
      
      // Mark this event as triggered
      this.triggeredEvents.add(eventsToTrigger[0].triggerMonth);
      
      // Return the first event
      return eventsToTrigger[0];
    }
    
    return null;
  }

  // Get triggered events count
  getTriggeredCount() {
    return this.triggeredEvents.size;
  }

  // Get all events for debugging
  getAllEvents() {
    return this.events;
  }

  // Reset the engine
  reset() {
    this.triggeredEvents.clear();
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
    type: event.type,
    triggerMonth: event.triggerMonth
  };
};