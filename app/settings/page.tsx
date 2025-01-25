'use client';

import React, { useState, useEffect } from 'react';
import { 
  Form, 
  InputNumber, 
  Button, 
  Card, 
  Typography, 
  message, 
  Spin 
} from 'antd';
import { withAuth } from '@/lib/auth/withAuth';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/auth/AuthContext';

const { Title } = Typography;

interface UserGoals {
  daily_calorie_goal: number;
  daily_protein_goal: number;
  daily_carb_goal: number;
  daily_fat_goal: number;
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch existing goals on component mount
  useEffect(() => {
    const fetchUserGoals = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_goals')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          form.setFieldsValue({
            daily_calorie_goal: data.daily_calorie_goal,
            daily_protein_goal: data.daily_protein_goal,
            daily_carb_goal: data.daily_carb_goal,
            daily_fat_goal: data.daily_fat_goal
          });
        }
      } catch (error) {
        console.error('Error fetching user goals:', error);
        message.error('Failed to load current goals');
      } finally {
        setLoading(false);
      }
    };

    fetchUserGoals();
  }, [user, form]);

  // Handle form submission
  const handleSubmit = async (values: UserGoals) => {
    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_goals')
        .upsert({
          user_id: user.id,
          daily_calorie_goal: values.daily_calorie_goal,
          daily_protein_goal: values.daily_protein_goal,
          daily_carb_goal: values.daily_carb_goal,
          daily_fat_goal: values.daily_fat_goal,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'user_id' 
        });

      if (error) throw error;

      message.success('Nutrition goals updated successfully!');
    } catch (error) {
      console.error('Error updating goals:', error);
      message.error('Failed to update nutrition goals');
    } finally {
      setSubmitting(false);
    }
  };

  // Validation rules
  const validatePositiveNumber = (_: any, value: number) => {
    if (value < 0) {
      return Promise.reject(new Error('Value must be a positive number'));
    }
    return Promise.resolve();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Title level={2}>Nutrition Goals</Title>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            daily_calorie_goal: 2000,
            daily_protein_goal: 150,
            daily_carb_goal: 250,
            daily_fat_goal: 70
          }}
        >
          <Form.Item
            name="daily_calorie_goal"
            label="Daily Calorie Goal"
            rules={[
              { required: true, message: 'Please input your daily calorie goal' },
              { validator: validatePositiveNumber }
            ]}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              placeholder="Enter daily calorie goal" 
            />
          </Form.Item>

          <Form.Item
            name="daily_protein_goal"
            label="Daily Protein Goal (g)"
            rules={[
              { required: true, message: 'Please input your daily protein goal' },
              { validator: validatePositiveNumber }
            ]}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              placeholder="Enter daily protein goal" 
            />
          </Form.Item>

          <Form.Item
            name="daily_carb_goal"
            label="Daily Carb Goal (g)"
            rules={[
              { required: true, message: 'Please input your daily carb goal' },
              { validator: validatePositiveNumber }
            ]}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              placeholder="Enter daily carb goal" 
            />
          </Form.Item>

          <Form.Item
            name="daily_fat_goal"
            label="Daily Fat Goal (g)"
            rules={[
              { required: true, message: 'Please input your daily fat goal' },
              { validator: validatePositiveNumber }
            ]}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              placeholder="Enter daily fat goal" 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitting}
              block
            >
              Save Nutrition Goals
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default withAuth(SettingsPage);
