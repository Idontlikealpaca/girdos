import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOptimizationStore } from '../../stores/optimizationStore';
import { Solution } from '../../algorithms/evaluate';
import { dominates } from '../../algorithms/nsgaII';
import styles from './ParetoChart.module.css';

const ParetoChart: React.FC = () => {
  const { population, selectedSolution, setSelectedSolution } = useOptimizationStore();

  if (!population) return <div className={styles.container}>No data</div>;

  // Identify Pareto front
  const isPareto = (sol: Solution) => {
    for (const other of population.solutions) {
      if (other !== sol && dominates(other, sol)) return false;
    }
    return true;
  };

  const data = population.solutions.map((sol: Solution) => ({
    x: sol.objectives[0], // cost
    y: sol.objectives[1], // carbon
    z: sol.objectives[2], // degradation
    isPareto: isPareto(sol),
    isSelected: sol === selectedSolution,
    solution: sol,
  }));

  const xs = data.map(d => d.x);
  const ys = data.map(d => d.y);
  const pad = (min: number, max: number) => {
    const margin = (max - min) * 0.1 || max * 0.05;
    return [Math.floor(min - margin), Math.ceil(max + margin)];
  };
  const xDomain = pad(Math.min(...xs), Math.max(...xs));
  const yDomain = pad(Math.min(...ys), Math.max(...ys));

  const handleClick = (data: any) => {
    if (data && data.solution) {
      setSelectedSolution(data.solution);
    }
  };

  return (
    <div className={styles.container}>
      <h3>Pareto Front</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid stroke="#1e1e1e" />
          <XAxis type="number" dataKey="x" name="Cost (₩)" stroke="#d4d4d4" domain={xDomain} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
          <YAxis type="number" dataKey="y" name="Carbon (kgCO₂)" stroke="#d4d4d4" domain={yDomain} />
          <Tooltip
            contentStyle={{ backgroundColor: '#080808', border: '1px solid #1e1e1e' }}
            labelStyle={{ color: '#d4d4d4' }}
            formatter={(value: number, name: string) => [
              name === 'Cost (₩)' ? `₩${value.toFixed(0)}` : `${value.toFixed(1)}`,
              name,
            ]}
          />
          <Scatter
            data={data}
            dataKey="z"
            fill="#2a2a2a"
            shape={(props: any) => {
              const { cx, cy, payload } = props;
              const size = payload.isSelected ? 10 : 5;
              const fill = payload.isPareto ? '#639922' : '#4a4a4a';
              const stroke = payload.isSelected ? '#ffffff' : 'none';
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={size}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                  onClick={() => handleClick(payload)}
                  style={{ cursor: 'pointer' }}
                />
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ParetoChart;
