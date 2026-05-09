import { DEMAND_PROFILE, BATTERY_CAPACITY, BATTERY_MAX_POWER, SOC_MIN, SOC_MAX, TOU_RATES, CARBON_FACTOR } from './constants';

export interface Solution {
  chromosome: number[]; // 24 values in [-1, 1]
  objectives: [number, number, number]; // [cost, carbon, degradation]
  soc: number[]; // 25 values (initial + 24 hours)
}

export interface Population {
  solutions: Solution[];
  generation: number;
}

export function evaluateSolution(chromosome: number[], solarProfile: number[]): Solution {
  const soc: number[] = [0.5]; // Initial SoC 50%
  let cost = 0;
  let carbon = 0;
  let degradation = 0;

  for (let h = 0; h < 24; h++) {
    const demand = DEMAND_PROFILE[h];
    const solar = solarProfile[h];
    const batteryCommand = chromosome[h] * BATTERY_MAX_POWER; // -30 to 30 kW

    // Clamp battery command to max power and SoC constraints
    const maxDischarge = Math.min(BATTERY_MAX_POWER, (soc[h] - SOC_MIN) * BATTERY_CAPACITY);
    const maxCharge = Math.min(BATTERY_MAX_POWER, (SOC_MAX - soc[h]) * BATTERY_CAPACITY);
    let actualBattery = Math.max(-maxDischarge, Math.min(maxCharge, batteryCommand));

    // Energy balance
    const netDemand = demand - solar;
    const gridPower = netDemand - actualBattery; // Positive: buy from grid, Negative: sell to grid (assume possible)

    // Cost calculation
    const hour = h;
    let rate = TOU_RATES.off;
    if ((hour >= 9 && hour < 12) || (hour >= 13 && hour < 18)) rate = TOU_RATES.peak;
    else if ((hour >= 7 && hour < 9) || (hour >= 18 && hour < 23)) rate = TOU_RATES.mid;
    cost += Math.max(0, gridPower) * rate; // Only buying cost

    // Carbon
    carbon += Math.max(0, gridPower) * CARBON_FACTOR;

    // Degradation (simple: absolute energy throughput)
    degradation += Math.abs(actualBattery);

    // Update SoC
    const newSoc = soc[h] + actualBattery / BATTERY_CAPACITY;
    soc.push(Math.max(SOC_MIN, Math.min(SOC_MAX, newSoc)));
  }

  return {
    chromosome,
    objectives: [cost, carbon, degradation],
    soc,
  };
}