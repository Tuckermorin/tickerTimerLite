// utils/constants.js
// Fixed constants with proper speed run timing

export const INITIAL_CAPITAL = 10000;
export const ANNUAL_BONUS = 5000;

// Fixed speeds - speedrun should be faster (lower number = faster)
export const SPEEDS = { 
  speedrun: 300,  // 300ms intervals (faster)
  classic: 1000,  // 1000ms intervals (normal)
  diversified: 1000 // 1000ms intervals (normal)
};

// Fixed durations in months
export const DURATIONS = { 
  speedrun: 120,  // 10 years * 12 months
  classic: 240,   // 20 years * 12 months  
  diversified: 240 // 20 years * 12 months
};