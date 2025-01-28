'use client';

import React, { useState, useEffect } from 'react';
import { Progress, Card, Row, Col, Typography, List, Spin } from 'antd';
import { withAuth } from '@/lib/auth/withAuth';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/auth/AuthContext';

const { Title, Text } = Typography;

interface DailyNutrition {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface MealEntry {
  id: string;
  food_name: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [nutrition, setNutrition] = useState<DailyNutrition>({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0
  });
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState({
    calorieGoal: 2000,
    proteinGoal: 150,
    carbGoal: 250,
    fatGoal: 70
  });

  useEffect(() => {
    const fetchDailyNutrition = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Fetch today's meals
        const today = new Date().toISOString().split('T')[0];
        const { data: mealData, error: mealError } = await supabase
          .from('meal_entries')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', `${today}T00:00:00`)
          .lte('created_at', `${today}T23:59:59`);

        // Fetch user goals
        const { data: goalsData, error: goalsError } = await supabase
          .from('user_goals')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (mealError) throw mealError;
        if (goalsError) throw goalsError;

        // Calculate totals
        const calculatedNutrition = mealData.reduce((acc, meal) => ({
          totalCalories: acc.totalCalories + meal.calories,
          totalProtein: acc.totalProtein + meal.protein,
          totalCarbs: acc.totalCarbs + meal.carbs,
          totalFat: acc.totalFat + meal.fat
        }), { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 });

        setNutrition(calculatedNutrition);
        setMeals(mealData);
        
        if (goalsData) {
          setGoals({
            calorieGoal: goalsData.daily_calorie_goal,
            proteinGoal: goalsData.daily_protein_goal,
            carbGoal: goalsData.daily_carb_goal,
            fatGoal: goalsData.daily_fat_goal
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyNutrition();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Title level={2}>Today's Nutrition</Title>
      
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Title level={4}>Calories</Title>
            <Progress 
              type="circle" 
              percent={Math.min(100, (nutrition.totalCalories / goals.calorieGoal) * 100)} 
              format={() => `${Math.round(nutrition.totalCalories)}/${goals.calorieGoal}`} 
            />
          </Card>
        </Col>
        <Col span={18}>
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Title level={4}>Protein</Title>
                <Progress 
                  percent={Math.min(100, (nutrition.totalProtein / goals.proteinGoal) * 100)} 
                  format={() => `${Math.round(nutrition.totalProtein)}g/${goals.proteinGoal}g`} 
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Title level={4}>Carbs</Title>
                <Progress 
                  percent={Math.min(100, (nutrition.totalCarbs / goals.carbGoal) * 100)} 
                  format={() => `${Math.round(nutrition.totalCarbs)}g/${goals.carbGoal}g`} 
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Title level={4}>Fat</Title>
                <Progress 
                  percent={Math.min(100, (nutrition.totalFat / goals.fatGoal) * 100)} 
                  format={() => `${Math.round(nutrition.totalFat)}g/${goals.fatGoal}g`} 
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Card title="Today's Meals">
        {meals.length === 0 ? (
          <Text type="secondary">No meals logged today</Text>
        ) : (
          <List
            dataSource={meals}
            renderItem={(meal) => (
              <List.Item>
                <List.Item.Meta
                  title={meal.food_name}
                  description={`${meal.servings} serving(s)`}
                />
                <div>
                  <Text>{meal.calories} cal | </Text>
                  <Text>{meal.protein}g P | </Text>
                  <Text>{meal.carbs}g C | </Text>
                  <Text>{meal.fat}g F</Text>
                </div>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default withAuth(Dashboard);
