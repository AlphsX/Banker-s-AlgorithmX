"use client";

import React, { useState, useCallback } from 'react';
import { ResourceRequest } from '@/types/bankers-algorithm';

interface RequestPanelProps {
  processCount: number;
  resourceCount: number;
  need: number[][];
  available: number[];
  onRequestSubmit: (request: ResourceRequest) => void;
  isProcessing: boolean;
}

export const RequestPanel: React.FC<RequestPanelProps> = ({
  processCount,
  resourceCount,
  need,
  available,
  onRequestSubmit,
  isProcessing,
}) => {
  const [selectedProcess, setSelectedProcess] = useState<number>(0);
  const [requestVector, setRequestVector] = useState<number[]>(() => 
    new Array(resourceCount).fill(0)
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Update request vector when resource count changes
  React.useEffect(() => {
    setRequestVector(prev => {
      const newVector = new Array(resourceCount).fill(0);
      // Copy existing values up to the minimum length
      const copyLength = Math.min(prev.length, resourceCount);
      for (let i = 0; i < copyLength; i++) {
        newVector[i] = prev[i];
      }
      return newVector;
    });
  }, [resourceCount]);

  // Reset selected process if it exceeds current process count
  React.useEffect(() => {
    if (selectedProcess >= processCount) {
      setSelectedProcess(0);
    }
  }, [processCount, selectedProcess]);

  const handleRequestVectorChange = useCallback((index: number, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setRequestVector(prev => {
      const newVector = [...prev];
      newVector[index] = numValue;
      return newVector;
    });
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }, [validationErrors.length]);

  const validateRequest = useCallback((): string[] => {
    const errors: string[] = [];
    
    // Check if any request value is negative (shouldn't happen due to Math.max, but safety check)
    if (requestVector.some(value => value < 0)) {
      errors.push('Request values cannot be negative');
    }
    
    // Check if all values are zero
    if (requestVector.every(value => value === 0)) {
      errors.push('Request must have at least one non-zero value');
    }
    
    // Validate against Need matrix - request cannot exceed need
    if (need[selectedProcess]) {
      for (let i = 0; i < requestVector.length; i++) {
        if (requestVector[i] > need[selectedProcess][i]) {
          const resourceLabel = String.fromCharCode(97 + i);
          errors.push(`Request for resource ${resourceLabel} (${requestVector[i]}) exceeds need (${need[selectedProcess][i]})`);
        }
      }
    }
    
    // Validate against Available vector - request cannot exceed available resources
    for (let i = 0; i < requestVector.length; i++) {
      if (requestVector[i] > available[i]) {
        const resourceLabel = String.fromCharCode(97 + i);
        errors.push(`Request for resource ${resourceLabel} (${requestVector[i]}) exceeds available (${available[i]})`);
      }
    }
    
    return errors;
  }, [requestVector, selectedProcess, need, available]);

  const handleSubmit = useCallback(() => {
    const errors = validateRequest();
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    const request: ResourceRequest = {
      processId: selectedProcess,
      requestVector: [...requestVector]
    };
    
    onRequestSubmit(request);
  }, [selectedProcess, requestVector, validateRequest, onRequestSubmit]);

  const handleReset = useCallback(() => {
    setRequestVector(new Array(resourceCount).fill(0));
    setValidationErrors([]);
  }, [resourceCount]);

  // Generate process options (P0, P1, P2, etc.)
  const processOptions = Array.from({ length: processCount }, (_, i) => ({
    value: i,
    label: `P${i}`
  }));

  // Generate resource labels (a, b, c, etc.)
  const resourceLabels = Array.from({ length: resourceCount }, (_, i) => 
    String.fromCharCode(97 + i) // 'a', 'b', 'c', etc.
  );

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Resource Request
      </h3>
      
      {/* Process Selection */}
      <div className="space-y-2">
        <label htmlFor="process-select" className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Select Process
        </label>
        <select
          id="process-select"
          value={selectedProcess}
          onChange={(e) => setSelectedProcess(parseInt(e.target.value))}
          disabled={isProcessing}
          className="w-full px-3 py-3 sm:py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
        >
          {processOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Current State Information */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Current State for P{selectedProcess}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-1">
            <div className="text-gray-500 dark:text-gray-400">Need:</div>
            <div className="font-mono text-gray-700 dark:text-gray-300">
              [{need[selectedProcess]?.join(', ') || 'N/A'}]
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-500 dark:text-gray-400">Available:</div>
            <div className="font-mono text-gray-700 dark:text-gray-300">
              [{available.join(', ')}]
            </div>
          </div>
        </div>
      </div>

      {/* Request Vector Inputs */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Request Vector
        </label>
        <div className="grid grid-cols-2 gap-2">
          {requestVector.map((value, index) => (
            <div key={index} className="space-y-1">
              <label htmlFor={`resource-${index}`} className="text-xs text-gray-500 dark:text-gray-400">
                {resourceLabels[index]}
              </label>
              <input
                id={`resource-${index}`}
                type="number"
                inputMode="numeric"
                min="0"
                max={Math.min(need[selectedProcess]?.[index] || 0, available[index] || 0)}
                value={value}
                onChange={(e) => handleRequestVectorChange(index, e.target.value)}
                disabled={isProcessing}
                className="w-full px-2 py-2 sm:py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="space-y-1">
          {validationErrors.map((error, index) => (
            <div key={index} className="text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons - Enhanced mobile layout */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <button
          onClick={handleSubmit}
          disabled={isProcessing}
          className="flex-1 px-3 py-3 sm:py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 touch-manipulation min-h-[44px] sm:min-h-[auto]"
        >
          {isProcessing ? 'Processing...' : 'Submit Request'}
        </button>
        <button
          onClick={handleReset}
          disabled={isProcessing}
          className="px-3 py-3 sm:py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 touch-manipulation min-h-[44px] sm:min-h-[auto]"
        >
          Reset
        </button>
      </div>
    </div>
  );
};