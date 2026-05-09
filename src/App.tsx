import Header from './components/Header/Header';
import MetricCards from './components/MetricCards/MetricCards';
import ParetoChart from './components/ParetoChart/ParetoChart';
import DispatchChart from './components/DispatchChart/DispatchChart';
import BatteryStrip from './components/BatteryStrip/BatteryStrip';
import EnergyBalance from './components/EnergyBalance/EnergyBalance';
import { useOptimizationStore } from './stores/optimizationStore';
import styles from './App.module.css';

function App() {
  const { isRunning, setIsRunning, setPopulation } = useOptimizationStore();

  const runOptimization = () => {
    setIsRunning(true);
    const worker = new Worker(new URL('./workers/optimizationWorker.ts', import.meta.url));
    worker.onmessage = (e) => {
      setPopulation(e.data);
      setIsRunning(false);
      worker.terminate();
    };
  };

  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.controls}>
        <button onClick={runOptimization} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run Optimization'}
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