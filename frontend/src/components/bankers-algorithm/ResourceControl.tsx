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
          className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
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
          className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
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