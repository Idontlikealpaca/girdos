import React from 'react';
import { useOptimizationStore } from '../../stores/optimizationStore';
import styles from './MetricCards.module.css';

const MetricCards: React.FC = () => {
  const { selectedSolution } = useOptimizationStore();

  if (!selectedSolution) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h3>Cost</h3>
          <p>-</p>
        </div>
        <div className={styles.card}>
          <h3>Carbon</h3>
          <p>-</p>
        </div>
        <div className={styles.card}>
          <h3>Degradation</h3>
          <p>-</p>
        </div>
      </div>
    );
  }

  const [cost, carbon, degradation] = selectedSolution.objectives;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3>Cost</h3>
        <p>₩{cost.toFixed(0)}</p>
      </div>
      <div className={styles.card}>
        <h3>Carbon</h3>
        <p>{carbon.toFixed(2)} kgCO₂</p>
      </div>
      <div className={styles.card}>
        <h3>Degradation</h3>
        <p>{degradation.toFixed(2)} kWh</p>
      </div>
    </div>
  );
};

export default MetricCards;