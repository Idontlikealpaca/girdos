import { create } from 'zustand';
import { Solution } from '../algorithms/evaluate';
import { Population } from '../algorithms/nsgaII';

interface OptimizationState {
  population: Population | null;
  selectedSolution: Solution | null;
  isRunning: boolean;
  progress: number;
  totalGenerations: number;
  setPopulation: (population: Population) => void;
  setSelectedSolution: (solution: Solution) => void;
  setIsRunning: (running: boolean) => void;
  setProgress: (progress: number) => void;
}

export const useOptimizationStore = create<OptimizationState>((set) => ({
  population: null,
  selectedSolution: null,
  isRunning: false,
  progress: 0,
  totalGenerations: 40,
  setPopulation: (population) => set({ population }),
  setSelectedSolution: (selectedSolution) => set({ selectedSolution }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setProgress: (progress) => set({ progress }),
}));