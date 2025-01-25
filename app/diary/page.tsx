import React from 'react';
import { Card, Button, Table, Tag, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface FoodEntry {
  id: string;
  name: string;
  servingSize: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
}

async function getDiaryEntries() {
  // TODO: Implement Supabase data fetching
  return {
    date: new Date(),
    entries: [
      {
        id: '1',
        name: 'Oatmeal with Berries',
        servingSize: '1 bowl',
        servings: 1,
        calories: 300,
        protein: 10,
        carbs: 45,
        fat: 8,
        mealType: 'breakfast'
      },
      {
        id: '2',
        name: 'Grilled Chicken Salad',
        servingSize: '1 plate',
        servings: 1,
        calories: 450,
        protein: 35,
        carbs: 20,
        fat: 25,
        mealType: 'lunch'
      }
    ] as FoodEntry[]
  };
}

export default async function DiaryPage() {
  const { date, entries } = await getDiaryEntries();

  const columns: ColumnsType<FoodEntry> = [
    {
      title: 'Food',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">
            {record.servingSize} × {record.servings}
          </div>
        </div>
      ),
    },
    {
      title: 'Meal',
      dataIndex: 'mealType',
      key: 'mealType',
      render: (type) => (
        <Tag color={
          type === 'breakfast' ? 'blue' :
          type === 'lunch' ? 'green' :
          type === 'dinner' ? 'purple' :
          'orange'
        }>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Calories',
      dataIndex: 'calories',
      key: 'calories',
      render: (calories) => <span>{calories} kcal</span>,
    },
    {
      title: 'Protein',
      dataIndex: 'protein',
      key: 'protein',
      render: (protein) => <span>{protein}g</span>,
    },
    {
      title: 'Carbs',
      dataIndex: 'carbs',
      key: 'carbs',
      render: (carbs) => <span>{carbs}g</span>,
    },
    {
      title: 'Fat',
      dataIndex: 'fat',
      key: 'fat',
      render: (fat) => <span>{fat}g</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <div className="space-x-2">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              // TODO: Implement edit functionality
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              // TODO: Implement delete functionality
            }}
          />
        </div>
      ),
    },
  ];

  const totals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Food Diary</h1>
            <DatePicker defaultValue={date} className="w-32" />
          </div>
          <Button type="primary" icon={<PlusOutlined />}>
            Add Food
          </Button>
        </div>

        <Card>
          <Table
            columns={columns}
            dataSource={entries}
            pagination={false}
            rowKey="id"
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <strong>Daily Totals</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <strong>{totals.calories} kcal</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <strong>{totals.protein}g</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    <strong>{totals.carbs}g</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>
                    <strong>{totals.fat}g</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6} />
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </Card>
      </div>
    </div>
  );
}
