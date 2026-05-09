import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useOptimizationStore } from '../../stores/optimizationStore';
import { DEMAND_PROFILE, SOLAR_BASE } from '../../algorithms/constants';
import styles from './DispatchChart.module.css';

const DispatchChart: React.FC = () => {
  const { selectedSolution } = useOptimizationStore();

  if (!selectedSolution) return <div className={styles.container}>Select a solution</div>;

  const data = [];
  for (let h = 0; h < 24; h++) {
    const demand = DEMAND_PROFILE[h];
    const solar = SOLAR_BASE[h]; // Use base for display
    const battery = selectedSolution.chromosome[h] * 30; // Assuming max power
    const grid = demand - solar - battery;
    const soc = selectedSolution.soc[h] * 100;

    data.push({
      hour: h,
      solar,
      grid: Math.max(0, grid), // Only positive for bar
      demand,
      soc,
    });
  }

  return (
    <div className={styles.container}>
      <h3>Dispatch Schedule</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid stroke="#1e1e1e" />
          <XAxis dataKey="hour" stroke="#d4d4d4" />
          <YAxis yAxisId="left" stroke="#d4d4d4" />
          <YAxis yAxisId="right" orientation="right" stroke="#185FA5" />
          <Tooltip
            contentStyle={{ backgroundColor: '#080808', border: '1px solid #1e1e1e' }}
            labelStyle={{ color: '#d4d4d4' }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="solar" stackId="a" fill="#639922" name="Solar" />
          <Bar yAxisId="left" dataKey="grid" stackId="a" fill="#8B4513" name="Grid" />
          <Line yAxisId="left" type="monotone" dataKey="demand" stroke="#ffffff" strokeWidth={2} name="Demand" />
          <Line yAxisId="right" type="monotone" dataKey="soc" stroke="#185FA5" strokeDasharray="5 5" name="SoC (%)" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DispatchChart;