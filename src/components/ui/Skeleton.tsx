import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200",
        className
      )}
      {...props}
    />
  );
};

export default Skeleton;

export const FoodItemSkeleton = () => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
    <div className="flex-1 min-w-0 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-4 rounded-full" />
    </div>
  </div>
);

export const MacroCardSkeleton = () => (
  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
    <Skeleton className="h-4 w-16 mb-1" />
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-1">
      <Skeleton className="h-6 w-12" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export const NutritionSummarySkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
    <Skeleton className="h-6 w-32 mb-4" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="order-2 lg:order-1 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
      <div className="order-1 lg:order-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <MacroCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  </div>
); 