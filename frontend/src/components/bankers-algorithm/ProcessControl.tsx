"use client";

import React from "react";

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
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Processes
      </label>
      <div className="flex items-center space-x-3">
        <button
          onClick={handleDecrement}
          className="btn-control w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation hover:scale-105 hover:shadow-md"
          disabled={processCount <= 1}
          title="Decrease process count"
          aria-label="Decrease process count"
        >
          −
        </button>
        <span
          className="w-8 text-center text-lg font-semibold text-gray-900 dark:text-gray-100"
          aria-label={`Current process count: ${processCount}`}
        >
          {processCount}
        </span>
        <button
          onClick={handleIncrement}
          className="btn-control w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation hover:scale-105 hover:shadow-md"
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
