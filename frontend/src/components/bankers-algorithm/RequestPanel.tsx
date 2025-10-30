"use client";

import React, { useState, useCallback } from "react";
import { ResourceRequest } from "@/types/bankers-algorithm";

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
    setRequestVector((prev) => {
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

  const handleRequestVectorChange = useCallback(
    (index: number, value: string) => {
      const numValue = Math.max(0, parseInt(value) || 0);
      setRequestVector((prev) => {
        const newVector = [...prev];
        newVector[index] = numValue;
        return newVector;
      });

      // Clear validation errors when user starts typing
      if (validationErrors.length > 0) {
        setValidationErrors([]);
      }
    },
    [validationErrors.length]
  );

  const validateRequest = useCallback((): string[] => {
    const errors: string[] = [];

    // Check if any request value is negative (shouldn't happen due to Math.max, but safety check)
    if (requestVector.some((value) => value < 0)) {
      errors.push("Request values cannot be negative");
    }

    // Check if all values are zero
    if (requestVector.every((value) => value === 0)) {
      errors.push("Request must have at least one non-zero value");
    }

    // Validate against Need matrix - request cannot exceed need
    if (need[selectedProcess]) {
      for (let i = 0; i < requestVector.length; i++) {
        if (requestVector[i] > need[selectedProcess][i]) {
          const resourceLabel = String.fromCharCode(97 + i);
          errors.push(
            `Request for resource ${resourceLabel} (${requestVector[i]}) exceeds need (${need[selectedProcess][i]})`
          );
        }
      }
    }

    // Validate against Available vector - request cannot exceed available resources
    for (let i = 0; i < requestVector.length; i++) {
      if (requestVector[i] > available[i]) {
        const resourceLabel = String.fromCharCode(97 + i);
        errors.push(
          `Request for resource ${resourceLabel} (${requestVector[i]}) exceeds available (${available[i]})`
        );
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
      requestVector: [...requestVector],
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
    label: `P${i}`,
  }));

  // Generate resource labels (a, b, c, etc.)
  const resourceLabels = Array.from(
    { length: resourceCount },
    (_, i) => String.fromCharCode(97 + i) // 'a', 'b', 'c', etc.
  );

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
        Request Panel
      </h3>

      {/* Process Selection */}
      <div className="space-y-1">
        <select
          id="process-select"
          value={selectedProcess}
          onChange={(e) => setSelectedProcess(parseInt(e.target.value))}
          disabled={isProcessing}
          className="w-full h-10 px-3 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation font-medium"
        >
          {processOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Request Vector Inputs */}
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-3">
          {requestVector.map((value, index) => {
            const resourceLabels = [
              "A",
              "B",
              "C",
              "D",
              "E",
              "F",
              "G",
              "H",
              "I",
              "J",
            ];
            return (
              <div key={index} className="space-y-1">
                <label
                  htmlFor={`resource-${index}`}
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 text-center block"
                >
                  {resourceLabels[index] || `R${index}`}
                </label>
                <input
                  id={`resource-${index}`}
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max={Math.min(
                    need[selectedProcess]?.[index] || 0,
                    available[index] || 0
                  )}
                  value={value}
                  onChange={(e) =>
                    handleRequestVectorChange(index, e.target.value)
                  }
                  disabled={isProcessing}
                  className="w-full h-10 px-3 text-center text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation font-medium"
                  placeholder="0"
                />
              </div>
            );
          })}
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

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleSubmit}
          disabled={isProcessing}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-full transition-colors duration-200 touch-manipulation"
        >
          {isProcessing ? "Processing..." : "Request"}
        </button>
        <button
          onClick={handleReset}
          disabled={isProcessing}
          className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:bg-gray-200 disabled:cursor-not-allowed border border-gray-300 dark:border-gray-600 rounded-full transition-colors duration-200 touch-manipulation"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
