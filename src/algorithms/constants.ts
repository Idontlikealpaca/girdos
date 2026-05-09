// System parameters
export const DEMAND_PROFILE = [18,16,15,14,14,15,20,28,38,48,52,55,53,52,50,47,44,40,42,44,38,30,24,20]; // kW
export const SOLAR_BASE = [0,0,0,0,0,0,2,8,18,30,38,42,44,42,38,30,18,8,2,0,0,0,0,0]; // kW
export const BATTERY_CAPACITY = 100; // kWh
export const BATTERY_MAX_POWER = 30; // kW
export const SOC_MIN = 0.1;
export const SOC_MAX = 0.95;
export const TOU_RATES = {
  peak: 160, // ₩/kWh, 9-12, 13-18
  mid: 112, // ₩/kWh, 7-9, 18-23
  off: 67, // ₩/kWh, others
};
export const CARBON_FACTOR = 0.4596; // kgCO₂/kWh