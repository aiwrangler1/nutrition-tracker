import React from 'react';
import { calculateProgress } from '../../utils/calculations';
import { useSettings } from '../../hooks/useSettings';

interface NutritionProps {
  consumed: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export default function NutritionSummary({ consumed }: NutritionProps) {
  const { settings } = useSettings();
  
  if (!settings) return null;

  const metrics = [
    {
      label: 'Calories',
      consumed: consumed.calories,
      target: settings.dailyCalorieGoal,
      unit: 'kcal',
      bgColor: 'bg-green-50',
      progressColor: 'bg-green-600',
    },
    {
      label: 'Protein',
      consumed: consumed.protein,
      target: settings.proteinTarget,
      unit: 'g',
      bgColor: 'bg-blue-50',
      progressColor: 'bg-blue-600',
    },
    {
      label: 'Carbs',
      consumed: consumed.carbs,
      target: settings.carbsTarget,
      unit: 'g',
      bgColor: 'bg-yellow-50',
      progressColor: 'bg-yellow-600',
    },
    {
      label: 'Fat',
      consumed: consumed.fat,
      target: settings.fatTarget,
      unit: 'g',
      bgColor: 'bg-red-50',
      progressColor: 'bg-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div key={metric.label} className={`${metric.bgColor} p-4 rounded-lg`}>
          <h3 className="text-sm font-medium text-gray-800">{metric.label}</h3>
          <div className="mt-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{metric.consumed} / {metric.target} {metric.unit}</span>
              <span>{calculateProgress(metric.consumed, metric.target)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div
                className={`${metric.progressColor} h-2.5 rounded-full`}
                style={{
                  width: `${calculateProgress(metric.consumed, metric.target)}%`
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}