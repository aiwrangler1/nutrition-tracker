import { useEffect } from 'react';

export const usePerformanceTracker = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Log performance metrics
      console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);

      // Optional: Send to performance tracking service
      if (renderTime > 50) {
        console.warn(`Slow render detected for ${componentName}`);
      }
    };
  }, [componentName]);
}; 