import React from 'react';
import { useOptimizationStore } from '../../stores/optimizationStore';
import { DEMAND_PROFILE, SOLAR_BASE } from '../../algorithms/constants';
import styles from './EnergyBalance.module.css';

const EnergyBalance: React.FC = () => {
  const { selectedSolution } = useOptimizationStore();

  if (!selectedSolution) return <div className={styles.container}>Select a solution</div>;

  let totalDemand = 0;
  let totalSolar = 0;
  let totalBatteryDischarge = 0;
  let totalGridPurchase = 0;

  for (let h = 0; h < 24; h++) {
    const demand = DEMAND_PROFILE[h];
    const solar = SOLAR_BASE[h];
    const battery = selectedSolution.chromosome[h] * 30;
    const grid = demand - solar - battery;

    totalDemand += demand;
    totalSolar += solar;
    if (battery < 0) totalBatteryDischarge += -battery;
    if (grid > 0) totalGridPurchase += grid;
  }

  const selfSufficiency = ((totalSolar + totalBatteryDischarge) / totalDemand) * 100;

  return (
    <div className={styles.container}>
      <h3>Energy Balance</h3>
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <h4>Self-Sufficiency</h4>
          <p>{selfSufficiency.toFixed(1)}%</p>
        </div>
        <div className={styles.metric}>
          <h4>Solar Generation</h4>
          <p>{totalSolar.toFixed(1)} kWh</p>
        </div>
        <div className={styles.metric}>
          <h4>Battery Discharge</h4>
          <p>{totalBatteryDischarge.toFixed(1)} kWh</p>
        </div>
        <div className={styles.metric}>
          <h4>Grid Purchase</h4>
          <p>{totalGridPurchase.toFixed(1)} kWh</p>
        </div>
      </div>
    </div>
  );
};

export default EnergyBalance;