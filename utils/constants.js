// utils/constants.js
// Fixed constants with 1.5x speed for speed run

export const INITIAL_CAPITAL = 10000;
export const ANNUAL_BONUS = 5000;

// Fixed speeds - speedrun should be 1.5x faster (667ms vs 1000ms)
export const SPEEDS = { 
  speedrun: 667,  // 667ms intervals (1.5x faster than 1000ms)
  classic: 1000,  // 1000ms intervals (normal)
  diversified: 1000 // 1000ms intervals (normal)
};

// Fixed durations in months
export const DURATIONS = { 
  speedrun: 120,  // 10 years * 12 months
  classic: 240,   // 20 years * 12 months  
  diversified: 240 // 20 years * 12 months
};