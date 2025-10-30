"use client";

import React from 'react';

interface ResourceControlProps {
  resourceCount: number;
  onResourceCountChange: (count: number) => void;
}

export const ResourceControl: React.FC<ResourceControlProps> = ({
  resourceCount,
  onResourceCountChange,
}) => {
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (resourceCount > 1) {
      onResourceCountChange(resourceCount - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (resourceCount < 10) {
      onResourceCountChange(resourceCount + 1);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Resources
      </label>
      <div className="flex items-center space-x-3">
        <button
          onClick={handleDecrement}
          className="btn-control w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation hover:scale-105 hover:shadow-md"
          disabled={resourceCount <= 1}
          title="Decrease resource count"
          aria-label="Decrease resource count"
        >
          −
        </button>
        <span 
          className="w-8 text-center text-lg font-semibold text-gray-900 dark:text-gray-100"
          aria-label={`Current resource count: ${resourceCount}`}
        >
          {resourceCount}
        </span>
        <button
          onClick={handleIncrement}
          className="btn-control w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation hover:scale-105 hover:shadow-md"
          disabled={resourceCount >= 10}
          title="Increase resource count"
          aria-label="Increase resource count"
        >
          +
        </button>
      </div>
      {resourceCount <= 1 && (
        <p className="text-xs text-red-500 dark:text-red-400">
          Minimum 1 resource required
        </p>
      )}
      {resourceCount >= 10 && (
        <p className="text-xs text-yellow-500 dark:text-yellow-400">
          Maximum 10 resources allowed
        </p>
      )}
    </div>
  );
};