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
  need: _need,
  available: _available,
  onRequestSubmit,
  isProcessing,
}) => {
  // Load saved data from localStorage
  const [selectedProcess, setSelectedProcess] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bankers-request-process');
      return saved ? Math.min(parseInt(saved), processCount - 1) : 0;
    }
    return 0;
  });
  
  const [requestVector, setRequestVector] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bankers-request-vector');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const newVector = new Array(resourceCount).fill(0);
            const copyLength = Math.min(parsed.length, resourceCount);
            for (let i = 0; i < copyLength; i++) {
              newVector[i] = parsed[i] || 0;
            }
            return newVector;
          }
        } catch {
          // If parsing fails, fall back to default
        }
      }
    }
    return new Array(resourceCount).fill(0);
  });
  
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Save to localStorage when values change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bankers-request-process', selectedProcess.toString());
    }
  }, [selectedProcess]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bankers-request-vector', JSON.stringify(requestVector));
    }
  }, [requestVector]);

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

    // Only validate basic constraints - let the algorithm handle resource availability and need validation
    // This allows testing requests that exceed available resources or declared needs

    return errors;
  }, [requestVector]);

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

  const handleProcessSelect = (processId: number) => {
    setSelectedProcess(processId);
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
        Request Panel
      </h3>

      {/* Process Selection - Custom Dropdown */}
      <div className="space-y-1" ref={dropdownRef}>
        <div className="relative">
          {/* Dropdown Button */}
          <button
            type="button"
            onClick={() => !isProcessing && setIsDropdownOpen(!isDropdownOpen)}
            disabled={isProcessing}
            className="w-full h-12 px-5 text-left flex items-center justify-between rounded-full border transition-colors duration-200 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--input-bg, #ffffff)',
              borderColor: 'var(--input-border, #e1e1e1)',
              color: 'var(--foreground)'
            }}
          >
            <span className="text-base font-medium">
              {processOptions[selectedProcess]?.label}
            </span>
            {/* Chevron Icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              style={{ color: 'var(--text-secondary, #6b7280)' }}
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div 
              className="absolute z-50 w-full mt-2 rounded-3xl border shadow-lg overflow-hidden animate-smooth-dropdown-in"
              style={{
                backgroundColor: 'var(--input-bg, #ffffff)',
                borderColor: 'var(--input-border, #e1e1e1)',
              }}
            >
              <div className="max-h-64 overflow-y-auto py-1">
                {processOptions.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleProcessSelect(option.value)}
                    className="w-full px-5 py-3 text-left flex items-center justify-between transition-colors duration-150 animate-item-slide-in"
                    style={{
                      backgroundColor: selectedProcess === option.value 
                        ? 'var(--need-bg, #f9fafb)' 
                        : 'transparent',
                      color: 'var(--foreground)',
                      animationDelay: `${index * 30}ms`
                    }}
                    onMouseEnter={(e) => {
                      if (selectedProcess !== option.value) {
                        e.currentTarget.style.backgroundColor = 'var(--button-hover-bg, #f3f4f6)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = selectedProcess === option.value 
                        ? 'var(--need-bg, #f9fafb)' 
                        : 'transparent';
                    }}
                  >
                    <span className="text-base font-medium">
                      {option.label}
                    </span>
                    {selectedProcess === option.value && (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ color: 'var(--text-secondary, #6b7280)' }}
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
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
                  className="text-sm font-medium text-center block"
                  style={{ color: 'var(--text-secondary, #6b7280)' }}
                >
                  {resourceLabels[index] || `R${index}`}
                </label>
                <input
                  id={`resource-${index}`}
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="999"
                  value={value}
                  onChange={(e) =>
                    handleRequestVectorChange(index, e.target.value)
                  }
                  disabled={isProcessing}
                  className="w-full h-10 px-3 text-center text-sm bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation font-medium"
                  style={{
                    backgroundColor: 'var(--input-bg, #ffffff)',
                    borderColor: 'var(--input-border, #e1e1e1)',
                    color: 'var(--foreground)'
                  }}
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
          className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full transition-colors duration-200 touch-manipulation disabled:bg-gray-200 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--button-bg, #ffffff)',
            borderColor: 'var(--button-border, #e1e1e1)',
            color: 'var(--foreground)'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};
