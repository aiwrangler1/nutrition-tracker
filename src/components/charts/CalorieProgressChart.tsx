import React from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

interface CalorieProgressChartProps {
  dailyGoal: number;
  consumedCalories: number;
}

const CalorieProgressChart: React.FC<CalorieProgressChartProps> = ({ 
  dailyGoal, 
  consumedCalories 
}) => {
  const data = {
    labels: ['Calories'],
    datasets: [
      {
        label: 'Consumed',
        data: [consumedCalories],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Remaining',
        data: [Math.max(dailyGoal - consumedCalories, 0)],
        backgroundColor: 'rgba(201, 203, 207, 0.6)',
        borderColor: 'rgba(201, 203, 207, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: dailyGoal,
        title: {
          display: true,
          text: 'Calories'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Daily Calorie Progress'
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default CalorieProgressChart; 