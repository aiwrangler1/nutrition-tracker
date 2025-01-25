'use client';

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  DatePicker, 
  Card, 
  Typography, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Popconfirm 
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { withAuth } from '@/lib/auth/withAuth';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/auth/AuthContext';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

interface MealEntry {
  id?: string;
  food_name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at?: string;
}

const DiaryPage: React.FC = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Fetch meals for the selected date
  const fetchMeals = async (date: moment.Moment) => {
    if (!user) return;

    setLoading(true);
    try {
      const formattedDate = date.format('YYYY-MM-DD');
      const { data, error } = await supabase
        .from('meal_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', `${formattedDate}T00:00:00`)
        .lte('created_at', `${formattedDate}T23:59:59`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMeals(data || []);
    } catch (error) {
      console.error('Error fetching meals:', error);
      message.error('Failed to fetch meals');
    } finally {
      setLoading(false);
    }
  };

  // Fetch meals when date or user changes
  useEffect(() => {
    fetchMeals(selectedDate);
  }, [user, selectedDate]);

  // Handle date change
  const handleDateChange = (date: moment.Moment | null) => {
    if (date) setSelectedDate(date);
  };

  // Open modal for adding/editing meal
  const showMealModal = (meal?: MealEntry) => {
    if (meal) {
      setEditingMeal(meal);
      form.setFieldsValue(meal);
    } else {
      setEditingMeal(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Submit meal entry
  const handleMealSubmit = async (values: MealEntry) => {
    if (!user) return;

    try {
      const mealData = {
        ...values,
        user_id: user.id,
        created_at: selectedDate.toISOString()
      };

      let result;
      if (editingMeal && editingMeal.id) {
        // Update existing meal
        result = await supabase
          .from('meal_entries')
          .update(mealData)
          .eq('id', editingMeal.id);
        message.success('Meal updated successfully');
      } else {
        // Add new meal
        result = await supabase.from('meal_entries').insert(mealData);
        message.success('Meal added successfully');
      }

      if (result.error) throw result.error;

      // Refresh meals
      fetchMeals(selectedDate);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error saving meal:', error);
      message.error('Failed to save meal');
    }
  };

  // Delete meal entry
  const handleDeleteMeal = async (mealId: string) => {
    try {
      const { error } = await supabase
        .from('meal_entries')
        .delete()
        .eq('id', mealId);

      if (error) throw error;

      message.success('Meal deleted successfully');
      fetchMeals(selectedDate);
    } catch (error) {
      console.error('Error deleting meal:', error);
      message.error('Failed to delete meal');
    }
  };

  // Calculate daily totals
  const dailyTotals = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  // Table columns
  const columns = [
    {
      title: 'Meal Type',
      dataIndex: 'meal_type',
      key: 'meal_type',
      render: (type: string) => type.charAt(0).toUpperCase() + type.slice(1)
    },
    {
      title: 'Food Name',
      dataIndex: 'food_name',
      key: 'food_name'
    },
    {
      title: 'Servings',
      dataIndex: 'servings',
      key: 'servings'
    },
    {
      title: 'Calories',
      dataIndex: 'calories',
      key: 'calories'
    },
    {
      title: 'Protein (g)',
      dataIndex: 'protein',
      key: 'protein'
    },
    {
      title: 'Carbs (g)',
      dataIndex: 'carbs',
      key: 'carbs'
    },
    {
      title: 'Fat (g)',
      dataIndex: 'fat',
      key: 'fat'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: MealEntry) => (
        <div>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showMealModal(record)} 
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure you want to delete this meal?"
            onConfirm={() => record.id && handleDeleteMeal(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Title level={2}>Food Diary</Title>
          <div className="flex items-center space-x-4">
            <DatePicker 
              value={selectedDate} 
              onChange={handleDateChange} 
              style={{ width: 200 }} 
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => showMealModal()}
            >
              Add Meal
            </Button>
          </div>
        </div>

        {/* Daily Totals Summary */}
        <Card 
          title="Daily Totals" 
          className="mb-6"
          extra={
            <Text type="secondary">
              {selectedDate.format('MMMM D, YYYY')}
            </Text>
          }
        >
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Text strong>Calories</Text>
              <div>{Math.round(dailyTotals.calories)}</div>
            </div>
            <div>
              <Text strong>Protein</Text>
              <div>{Math.round(dailyTotals.protein)}g</div>
            </div>
            <div>
              <Text strong>Carbs</Text>
              <div>{Math.round(dailyTotals.carbs)}g</div>
            </div>
            <div>
              <Text strong>Fat</Text>
              <div>{Math.round(dailyTotals.fat)}g</div>
            </div>
          </div>
        </Card>

        {/* Meal Entries Table */}
        <Table 
          dataSource={meals} 
          columns={columns} 
          rowKey="id"
          loading={loading}
          locale={{ emptyText: 'No meals logged for this day' }}
        />
      </Card>

      {/* Meal Entry Modal */}
      <Modal
        title={editingMeal ? 'Edit Meal' : 'Add Meal'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleMealSubmit}
          initialValues={{
            meal_type: 'breakfast',
            servings: 1,
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
          }}
        >
          <Form.Item
            name="meal_type"
            label="Meal Type"
            rules={[{ required: true, message: 'Please select meal type' }]}
          >
            <Select>
              <Option value="breakfast">Breakfast</Option>
              <Option value="lunch">Lunch</Option>
              <Option value="dinner">Dinner</Option>
              <Option value="snacks">Snacks</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="food_name"
            label="Food Name"
            rules={[{ required: true, message: 'Please enter food name' }]}
          >
            <Input placeholder="Enter food name" />
          </Form.Item>

          <Form.Item
            name="servings"
            label="Servings"
            rules={[{ required: true, message: 'Please enter number of servings' }]}
          >
            <Input type="number" min={0} step={0.5} />
          </Form.Item>

          <Form.Item
            name="calories"
            label="Calories"
            rules={[{ required: true, message: 'Please enter calories' }]}
          >
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item
            name="protein"
            label="Protein (g)"
            rules={[{ required: true, message: 'Please enter protein amount' }]}
          >
            <Input type="number" min={0} step={0.1} />
          </Form.Item>

          <Form.Item
            name="carbs"
            label="Carbs (g)"
            rules={[{ required: true, message: 'Please enter carbs amount' }]}
          >
            <Input type="number" min={0} step={0.1} />
          </Form.Item>

          <Form.Item
            name="fat"
            label="Fat (g)"
            rules={[{ required: true, message: 'Please enter fat amount' }]}
          >
            <Input type="number" min={0} step={0.1} />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
            >
              {editingMeal ? 'Update Meal' : 'Add Meal'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default withAuth(DiaryPage);
