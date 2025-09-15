import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-muted"></div>
      
      {/* Content Skeleton */}
      <div className="p-5">
        {/* Source and Date Skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="h-4 bg-muted rounded w-20"></div>
          </div>
          <div className="h-3 bg-muted rounded w-16"></div>
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-5 bg-muted rounded w-full"></div>
          <div className="h-5 bg-muted rounded w-3/4"></div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-4 bg-muted rounded w-4"></div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-3 bg-muted rounded w-3"></div>
            <div className="h-3 bg-muted rounded w-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;