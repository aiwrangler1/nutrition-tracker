import React from 'react';
import { Layout, Menu } from 'antd';
import Link from 'next/link';

const { Header, Content } = Layout;

export default function HomePage() {
  return (
    <Layout className="min-h-screen">
      <Header className="bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Nutrition Tracker</h1>
          <Menu mode="horizontal" className="border-0">
            <Menu.Item key="dashboard">
              <Link href="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="diary">
              <Link href="/diary">Food Diary</Link>
            </Menu.Item>
            <Menu.Item key="settings">
              <Link href="/settings">Settings</Link>
            </Menu.Item>
          </Menu>
        </div>
      </Header>
      <Content className="p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Nutrition Tracker</h2>
          <p className="mb-4">Track your daily meals and monitor your nutritional goals with ease.</p>
          <Link href="/dashboard" className="ant-btn ant-btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </Content>
    </Layout>
  );
}
