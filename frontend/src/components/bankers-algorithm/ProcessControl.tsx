"use client";

import React from 'react';

interface ProcessControlProps {
  processCount: number;
  onProcessCountChange: (count: number) => void;
}

export const ProcessControl: React.FC<ProcessControlProps> = ({
  processCount,
  onProcessCountChange,
}) => {
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (processCount > 1) {
      onProcessCountChange(processCount - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (processCount < 10) {
      onProcessCountChange(processCount + 1);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
        Processes
      </label>
      <div className="flex items-center space-x-3">
        <button
          onClick={handleDecrement}
          className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-500 flex items-center justify-center text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          disabled={processCount <= 1}
          title="Decrease process count"
          aria-label="Decrease process count"
        >
          -
        </button>
        <span 
          className="w-10 sm:w-8 text-center text-sm font-medium"
          aria-label={`Current process count: ${processCount}`}
        >
          {processCount}
        </span>
        <button
          onClick={handleIncrement}
          className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-500 flex items-center justify-center text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          disabled={processCount >= 10}
          title="Increase process count"
          aria-label="Increase process count"
        >
          +
        </button>
      </div>
      {processCount <= 1 && (
        <p className="text-xs text-red-500 dark:text-red-400">
          Minimum 1 process required
        </p>
      )}
      {processCount >= 10 && (
        <p className="text-xs text-yellow-500 dark:text-yellow-400">
          Maximum 10 processes allowed
        </p>
      )}
    </div>
  );
};