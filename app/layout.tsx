import React from 'react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientLayout from '@/components/layout/ClientLayout';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nutrition Tracker',
  description: 'Track your daily nutrition and macros',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
