import Header from './components/Header/Header';
import MetricCards from './components/MetricCards/MetricCards';
import ParetoChart from './components/ParetoChart/ParetoChart';
import DispatchChart from './components/DispatchChart/DispatchChart';
import BatteryStrip from './components/BatteryStrip/BatteryStrip';
import EnergyBalance from './components/EnergyBalance/EnergyBalance';
import { useOptimizationStore } from './stores/optimizationStore';
import styles from './App.module.css';

function App() {
  const { isRunning, setIsRunning, setPopulation, progress, totalGenerations, setProgress } = useOptimizationStore();

  const runOptimization = () => {
    setIsRunning(true);
    setProgress(0);
    const worker = new Worker(new URL('./workers/optimizationWorker.ts?worker', import.meta.url), { type: 'module' });
    worker.onmessage = (e) => {
      if (e.data.type === 'progress') {
        setProgress(e.data.generation);
      } else if (e.data.type === 'complete') {
        setPopulation(e.data.data);
        setIsRunning(false);
        setProgress(0);
        worker.terminate();
      }
    };
  };

  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.controls}>
        <button onClick={runOptimization} disabled={isRunning}>
          {isRunning ? `Running... (Generation ${progress}/${totalGenerations})` : 'Run Optimization'}
        </button>
      </div>
      <div className={styles.main}>
        <MetricCards />
        <ParetoChart />
        <DispatchChart />
        <BatteryStrip />
        <EnergyBalance />
      </div>
    </div>
  );
}

export default App;