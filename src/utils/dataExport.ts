import { UserSettings, MealEntry } from '../types';

interface ExportOptions {
  format: 'csv' | 'json';
}

export class DataExporter {
  static exportMealEntries(entries: MealEntry[], options: ExportOptions = { format: 'csv' }) {
    const data = entries.map(entry => ({
      date: entry.date,
      mealType: entry.type,
      foods: entry.foods.map(food => ({
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        servings: `${food.numberOfServings} ${food.servingUnit}`
      }))
    }));

    if (options.format === 'csv') {
      return this.convertToCSV(data);
    }

    return JSON.stringify(data, null, 2);
  }

  static exportUserSettings(settings: UserSettings, options: ExportOptions = { format: 'csv' }) {
    const data = {
      dailyCalorieGoal: settings.dailyCalorieGoal,
      proteinTarget: settings.proteinTarget,
      carbsTarget: settings.carbsTarget,
      fatTarget: settings.fatTarget
    };

    if (options.format === 'csv') {
      return this.convertToCSV([data]);
    }

    return JSON.stringify(data, null, 2);
  }

  private static convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          JSON.stringify(row[header])
        ).join(',')
      )
    ];

    return csvRows.join('\n');
  }

  static downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
} 