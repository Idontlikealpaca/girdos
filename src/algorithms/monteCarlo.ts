import { SOLAR_BASE } from './constants';

export function generateSolarScenarios(numScenarios: number = 80): number[][] {
  const scenarios: number[][] = [];
  for (let i = 0; i < numScenarios; i++) {
    const scenario: number[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const base = SOLAR_BASE[hour];
      const factor = 0.6 + Math.random() * 0.8; // Uniform [0.6, 1.4]
      scenario.push(base * factor);
    }
    scenarios.push(scenario);
  }
  return scenarios;
}

export function getAverageSolar(): number[] {
  const scenarios = generateSolarScenarios();
  const averages: number[] = [];
  for (let hour = 0; hour < 24; hour++) {
    let sum = 0;
    for (const scenario of scenarios) {
      sum += scenario[hour];
    }
    averages.push(sum / scenarios.length);
  }
  return averages;
}