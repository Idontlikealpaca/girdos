import React from 'react';
import { useOptimizationStore } from '../../stores/optimizationStore';
import styles from './BatteryStrip.module.css';

const BatteryStrip: React.FC = () => {
  const { selectedSolution } = useOptimizationStore();

  if (!selectedSolution) return <div className={styles.container}>Select a solution</div>;

  return (
    <div className={styles.container}>
      <h3>Battery Dispatch</h3>
      <div className={styles.strip}>
        {selectedSolution.chromosome.map((cmd, h) => {
          const power = cmd * 30; // kW
          const height = Math.abs(power) * 2; // Scale for display
          const color = power > 0 ? '#639922' : '#8B4513'; // Charge green, discharge brown
          return (
            <div key={h} className={styles.hour}>
              <div
                className={styles.bar}
                style={{
                  height: `${height}px`,
                  backgroundColor: color,
                  marginTop: power > 0 ? `${50 - height}px` : '0px',
                }}
              />
              <span>{h}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BatteryStrip;