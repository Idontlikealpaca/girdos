import { evaluateSolution, Solution } from './evaluate';

export interface Population {
  solutions: Solution[];
  generation: number;
}

export function dominates(a: Solution, b: Solution): boolean {
  const [a1, a2, a3] = a.objectives;
  const [b1, b2, b3] = b.objectives;
  return (a1 <= b1 && a2 <= b2 && a3 <= b3) && (a1 < b1 || a2 < b2 || a3 < b3);
}

function nonDominatedSort(population: Solution[]): number[][] {
  const fronts: number[][] = [];
  const dominationCount: number[] = new Array(population.length).fill(0);
  const dominatedSolutions: number[][] = population.map(() => []);

  for (let i = 0; i < population.length; i++) {
    for (let j = 0; j < population.length; j++) {
      if (i !== j) {
        if (dominates(population[i], population[j])) {
          dominatedSolutions[i].push(j);
        } else if (dominates(population[j], population[i])) {
          dominationCount[i]++;
        }
      }
    }
    if (dominationCount[i] === 0) {
      if (!fronts[0]) fronts[0] = [];
      fronts[0].push(i);
    }
  }

  let frontIndex = 0;
  while (fronts[frontIndex] && fronts[frontIndex].length > 0) {
    const nextFront: number[] = [];
    for (const i of fronts[frontIndex]) {
      for (const j of dominatedSolutions[i]) {
        dominationCount[j]--;
        if (dominationCount[j] === 0) {
          nextFront.push(j);
        }
      }
    }
    frontIndex++;
    if (nextFront.length > 0) fronts[frontIndex] = nextFront;
  }

  return fronts;
}

function crowdingDistance(front: number[], population: Solution[]): number[] {
  const distances: number[] = new Array(front.length).fill(0);
  const n = front.length;
  if (n <= 2) return distances;

  for (let m = 0; m < 3; m++) {
    const sorted = front.sort((a, b) => population[a].objectives[m] - population[b].objectives[m]);
    distances[0] = Infinity;
    distances[n - 1] = Infinity;
    const maxObj = population[sorted[n - 1]].objectives[m];
    const minObj = population[sorted[0]].objectives[m];
    const range = maxObj - minObj;
    if (range === 0) continue;
    for (let i = 1; i < n - 1; i++) {
      distances[i] += (population[sorted[i + 1]].objectives[m] - population[sorted[i - 1]].objectives[m]) / range;
    }
  }
  return distances;
}

function tournamentSelection(population: Solution[], fronts: number[][], crowdingDistances: number[][]): [number, number] {
  const select = (): number => {
    const i = Math.floor(Math.random() * population.length);
    const j = Math.floor(Math.random() * population.length);
    const frontI = fronts.findIndex(f => f.includes(i));
    const frontJ = fronts.findIndex(f => f.includes(j));
    if (frontI < frontJ) return i;
    if (frontI > frontJ) return j;
    const distI = crowdingDistances[frontI][fronts[frontI].indexOf(i)];
    const distJ = crowdingDistances[frontJ][fronts[frontJ].indexOf(j)];
    return distI > distJ ? i : j;
  };
  return [select(), select()];
}

function crossover(parent1: number[], parent2: number[]): [number[], number[]] {
  const point1 = Math.floor(Math.random() * 24);
  const point2 = Math.floor(Math.random() * 24);
  const start = Math.min(point1, point2);
  const end = Math.max(point1, point2);
  const child1 = [...parent1];
  const child2 = [...parent2];
  for (let i = start; i <= end; i++) {
    child1[i] = parent2[i];
    child2[i] = parent1[i];
  }
  return [child1, child2];
}

function mutate(chromosome: number[], rate: number = 0.12, sigma: number = 0.3): number[] {
  return chromosome.map(gene => {
    if (Math.random() < rate) {
      const mutation = (Math.random() - 0.5) * 2 * sigma;
      return Math.max(-1, Math.min(1, gene + mutation));
    }
    return gene;
  });
}

export function runNSGAII(popSize: number = 80, generations: number = 40, solarProfile: number[]): Population {
  // Initialize population
  let population: Solution[] = [];
  for (let i = 0; i < popSize; i++) {
    const chromosome = Array.from({ length: 24 }, () => (Math.random() - 0.5) * 2);
    population.push(evaluateSolution(chromosome, solarProfile));
  }

  for (let gen = 0; gen < generations; gen++) {
    const fronts = nonDominatedSort(population);
    const crowdingDistances = fronts.map(front => crowdingDistance(front, population));

    const offspring: Solution[] = [];
    while (offspring.length < popSize) {
      const [p1, p2] = tournamentSelection(population, fronts, crowdingDistances);
      const [c1, c2] = crossover(population[p1].chromosome, population[p2].chromosome);
      offspring.push(evaluateSolution(mutate(c1), solarProfile));
      if (offspring.length < popSize) {
        offspring.push(evaluateSolution(mutate(c2), solarProfile));
      }
    }

    // Combine and select
    const combined = [...population, ...offspring];
    const combinedFronts = nonDominatedSort(combined);
    const combinedDistances = combinedFronts.map(front => crowdingDistance(front, combined));

    const newPopulation: Solution[] = [];
    for (const front of combinedFronts) {
      if (newPopulation.length + front.length <= popSize) {
        newPopulation.push(...front.map(i => combined[i]));
      } else {
        const remaining = popSize - newPopulation.length;
        const sortedFront = front
          .map((i, idx) => ({ i, dist: combinedDistances[combinedFronts.indexOf(front)][idx] }))
          .sort((a, b) => b.dist - a.dist)
          .slice(0, remaining)
          .map(item => combined[item.i]);
        newPopulation.push(...sortedFront);
        break;
      }
    }
    population = newPopulation;
  }

  return { solutions: population, generation: generations };
}