'use client';

import React, { useState, useEffect } from 'react';
import { Progress, Card, Row, Col, Typography, List, Spin, Alert } from 'antd';
import { useAuth } from '@/lib/auth/AuthContext';
import useSWR from 'swr';
import { supabase } from '@/lib/supabaseClient';

const { Title, Text } = Typography;

interface DashboardData {
  nutrition: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  };
  meals: Array<{
    id: string;
    food_name: string;
    servings: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  goals: {
    calorieGoal: number;
    proteinGoal: number;
    carbGoal: number;
    fatGoal: number;
  };
}

const fetcher = async (url: string, userId: string) => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: mealData } = await supabase
    .from('meal_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`);

  const { data: goalsData } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', userId)
    .single();

  const nutrition = mealData?.reduce((acc, meal) => ({
    totalCalories: acc.totalCalories + meal.calories,
    totalProtein: acc.totalProtein + meal.protein,
    totalCarbs: acc.totalCarbs + meal.carbs,
    totalFat: acc.totalFat + meal.fat
  }), { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 });

  return {
    nutrition: nutrition || { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 },
    meals: mealData || [],
    goals: goalsData ? {
      calorieGoal: goalsData.daily_calorie_goal,
      proteinGoal: goalsData.daily_protein_goal,
      carbGoal: goalsData.daily_carb_goal,
      fatGoal: goalsData.daily_fat_goal
    } : {
      calorieGoal: 2000,
      proteinGoal: 150,
      carbGoal: 250,
      fatGoal: 70
    }
  };
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  const { data, error, isLoading } = useSWR(
    user ? ['/api/dashboard', user.id] : null,
    ([_, userId]) => fetcher('/api/dashboard', userId),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      refreshInterval: 300000
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert 
          message="Error loading dashboard data" 
          type="error" 
          showIcon
        />
      </div>
    );
  }

  const { nutrition, meals, goals } = data || {};

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

export default Dashboard;
