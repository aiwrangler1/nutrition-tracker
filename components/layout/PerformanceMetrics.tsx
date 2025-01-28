'use client';

import { usePerfMetrics } from '@/lib/hooks/usePerfMetrics';

export default function PerformanceMetrics({ children }: { children: React.ReactNode }) {
  usePerfMetrics();
  return <>{children}</>;
} 