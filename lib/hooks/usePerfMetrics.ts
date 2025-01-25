'use client';

import { useEffect } from 'react';
import { authLogger } from '@/lib/utils/logger';

export function usePerfMetrics() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const timing = window.performance.timing;
      const ttfb = timing.responseStart - timing.requestStart;
      
      authLogger.logAuthEvent(
        'PERF_METRICS',
        `TTFB: ${ttfb}ms`,
        'info'
      );

      // Add more metrics as needed
      const domLoad = timing.domContentLoadedEventEnd - timing.navigationStart;
      const windowLoad = timing.loadEventEnd - timing.navigationStart;
      
      authLogger.logAuthEvent(
        'PERF_METRICS',
        `DOM Load: ${domLoad}ms, Window Load: ${windowLoad}ms`,
        'info'
      );
    }
  }, []);
} 