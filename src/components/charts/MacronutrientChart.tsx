import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MacronutrientChartProps {
  protein: number;
  carbs: number;
  fat: number;
}

const MacronutrientChart: React.FC<MacronutrientChartProps> = ({ 
  protein, 
  carbs, 
  fat 
}) => {
  const data = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [protein, carbs, fat],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',   // Blue for Protein
          'rgba(255, 206, 86, 0.6)',   // Yellow for Carbs
          'rgba(255, 99, 132, 0.6)'    // Red for Fat
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Daily Macronutrient Breakdown'
      }
    }
  };

  return <Pie data={data} options={options} />;
};

export default MacronutrientChart; 