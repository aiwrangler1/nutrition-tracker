import React from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
);

interface WeightTrackingChartProps {
  weightData: {
    date: string;
    weight: number;
  }[];
}

const WeightTrackingChart: React.FC<WeightTrackingChartProps> = ({ weightData }) => {
  const data = {
    labels: weightData.map(entry => entry.date),
    datasets: [
      {
        label: 'Weight',
        data: weightData.map(entry => entry.weight),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
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
        text: 'Weight Tracking'
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Weight (kg)'
        }
      }
    }
  };

  return <Line data={data} options={options} />;
};

export default WeightTrackingChart; 