'use client';

import React from 'react';
import { Layout, Menu, Button } from 'antd';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';

const { Header, Content } = Layout;

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { key: 'diary', label: 'Food Diary', href: '/diary' },
  { key: 'settings', label: 'Settings', href: '/settings' }
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <Layout className="min-h-screen">
      <Header>
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <Link href="/" className="text-xl font-bold text-gray-900 no-underline">
            Nutrition Tracker
          </Link>
          <Menu mode="horizontal" selectedKeys={[]}>
            {menuItems.map(item => (
              <Menu.Item key={item.key}>
                <Link href={item.href} className="text-gray-600 hover:text-blue-500">
                  {item.label}
                </Link>
              </Menu.Item>
            ))}
            {!user && (
              <Menu.Item key="login">
                <Link href="/auth/login" className="text-gray-600 hover:text-blue-500">
                  Login
                </Link>
              </Menu.Item>
            )}
          </Menu>
        </div>
      </Header>
      <Content className="p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome to Your Nutrition Tracker
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track your daily meals and monitor your nutritional goals with ease.
              Get insights into your eating habits and achieve your health goals.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            {user ? (
              <Link 
                href="/dashboard" 
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="inline-flex items-center px-6 py-3 border-2 border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
}
