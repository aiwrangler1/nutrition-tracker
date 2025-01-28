'use client';

import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { AuthProvider } from '@/lib/auth/AuthContext';
import PerformanceMetrics from './PerformanceMetrics';

const themeConfig = {
  token: {
    colorPrimary: '#3B82F6', // Tailwind blue-500
    borderRadius: 8,
    colorBgContainer: '#ffffff',
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 64,
    },
    Menu: {
      horizontalItemHoverBg: 'transparent',
      horizontalItemSelectedBg: 'transparent',
      itemHoverBg: 'transparent',
      itemSelectedBg: 'transparent',
    },
  },
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ConfigProvider theme={themeConfig}>
        <PerformanceMetrics>
          {children}
        </PerformanceMetrics>
      </ConfigProvider>
    </AuthProvider>
  );
} 