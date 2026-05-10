// optimizationWorker.ts
import { runNSGAII } from '../algorithms/nsgaII';
import { getAverageSolar } from '../algorithms/monteCarlo';

self.onmessage = () => {
  const solarProfile = getAverageSolar();
  const result = runNSGAII(80, 40, solarProfile, (generation) => {
    self.postMessage({
      type: 'progress',
      generation: generation,
      totalGenerations: 40
    });
  });
  self.postMessage({
    type: 'complete',
    data: result
  });
};