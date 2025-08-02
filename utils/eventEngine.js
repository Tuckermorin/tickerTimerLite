// utils/eventEngine.js
// Fixed event engine with speed mode support (5 events instead of 10)

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
    // Determine game length and event count based on mode
    const gameLength = this.gameMode === 'speedrun' ? 120 : 240; // 10 or 20 years in months
    const eventCount = this.gameMode === 'speedrun' ? 5 : 10; // 5 events for speed mode, 10 for others
    
    console.log(`Initializing event engine with ${eventCount} random events for ${this.gameMode} mode...`);
    
    // Get random events for the game
    this.events = getRandomEventsForGame(gameLength, eventCount);
    
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

// Helper function to format event for display - FIXED VERSION
export const formatEventForDisplay = (event) => {
  if (!event) return null;
  
  return {
    event: event.event,
    sentiment: event.sentiment,
    type: event.type,
    triggerMonth: event.triggerMonth
  };
};