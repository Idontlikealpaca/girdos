import { create } from 'zustand';
import { Solution } from '../algorithms/evaluate';
import { Population } from '../algorithms/nsgaII';

interface OptimizationState {
  population: Population | null;
  selectedSolution: Solution | null;
  isRunning: boolean;
  setPopulation: (population: Population) => void;
  setSelectedSolution: (solution: Solution) => void;
  setIsRunning: (running: boolean) => void;
}

export const useOptimizationStore = create<OptimizationState>((set) => ({
  population: null,
  selectedSolution: null,
  isRunning: false,
  setPopulation: (population) => set({ population }),
  setSelectedSolution: (selectedSolution) => set({ selectedSolution }),
  setIsRunning: (isRunning) => set({ isRunning }),
}));