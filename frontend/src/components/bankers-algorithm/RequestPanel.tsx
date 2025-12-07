"use client";

import React, { useState, useCallback, useRef } from "react";
import { ResourceRequest } from "@/types/bankers-algorithm";

interface RequestPanelProps {
  processCount: number;
  resourceCount: number;
  need: number[][];
  available: number[];
  onRequestSubmit: (request: ResourceRequest) => void;
  isProcessing: boolean;
  disabled?: boolean;
  shouldResetAfterRequest?: boolean;
  onResetComplete?: () => void;
}

export const RequestPanel: React.FC<RequestPanelProps> = ({
  processCount,
  resourceCount,
  need: _need,
  available: _available,
  onRequestSubmit,
  isProcessing,
  disabled = false,
  shouldResetAfterRequest = false,
  onResetComplete,
}) => {
  const isDisabled = disabled || isProcessing;

  // Store request vectors for each process
  const [processRequestVectors, setProcessRequestVectors] = useState<
    Record<number, number[]>
  >(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bankers-process-request-vectors");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // If parsing fails, fall back to default
        }
      }
    }
    return {};
  });

  // Load saved data from localStorage
  const [selectedProcess, setSelectedProcess] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bankers-request-process");
      return saved ? Math.min(parseInt(saved), processCount - 1) : 0;
    }
    return 0;
  });

  const [requestVector, setRequestVector] = useState<number[]>(() => {
    // Get the saved vector for the selected process, or create a new one
    const savedVectors = processRequestVectors;
    if (savedVectors[selectedProcess]) {
      const saved = savedVectors[selectedProcess];
      const newVector = new Array(resourceCount).fill(0);
      const copyLength = Math.min(saved.length, resourceCount);
      for (let i = 0; i < copyLength; i++) {
        newVector[i] = saved[i] || 0;
      }
      return newVector;
    }
    return new Array(resourceCount).fill(0);
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [mountValidationErrors, setMountValidationErrors] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const unmountTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const requestVectorRef = useRef(requestVector);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Save to localStorage when values change
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "bankers-request-process",
        selectedProcess.toString(),
      );
    }
  }, [selectedProcess]);

  // Save request vector for current process
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const updatedVectors = {
        ...processRequestVectors,
        [selectedProcess]: requestVector,
      };
      setProcessRequestVectors(updatedVectors);
      localStorage.setItem(
        "bankers-process-request-vectors",
        JSON.stringify(updatedVectors),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestVector, selectedProcess]);

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

  // Update ref when requestVector changes
  React.useEffect(() => {
    requestVectorRef.current = requestVector;
  }, [requestVector]);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  // Reset request vector after successful request
  React.useEffect(() => {
    if (shouldResetAfterRequest) {
      // Reset only the current process's request vector
      setRequestVector(new Array(resourceCount).fill(0));

      // Update the stored vectors
      const updatedVectors = {
        ...processRequestVectors,
        [selectedProcess]: new Array(resourceCount).fill(0),
      };
      setProcessRequestVectors(updatedVectors);

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "bankers-process-request-vectors",
          JSON.stringify(updatedVectors),
        );
      }

      // Notify parent that reset is complete
      onResetComplete?.();
    }
  }, [
    shouldResetAfterRequest,
    resourceCount,
    selectedProcess,
    processRequestVectors,
    onResetComplete,
  ]);

  const handleRequestVectorChange = useCallback(
    (index: number, value: string) => {
      const numValue = Math.max(0, parseInt(value) || 0);
      setRequestVector((prev) => {
        const newVector = [...prev];
        newVector[index] = numValue;
        return newVector;
      });

      // Clear validation errors when user starts typing with smooth animation
      if (mountValidationErrors) {
        setShowValidationErrors(false);
        if (unmountTimeoutRef.current) {
          clearTimeout(unmountTimeoutRef.current);
        }
        unmountTimeoutRef.current = setTimeout(() => {
          setMountValidationErrors(false);
          setValidationErrors([]);
        }, 500);
      }
    },
    [mountValidationErrors],
  );

  const handleMouseDown = useCallback(
    (idx: number, increment: boolean) => {
      if (isDisabled) return;

      // Clear any existing timers first
      clearTimers();

      // Immediate action on mouse down
      const initialValue = requestVectorRef.current[idx];
      const newValue = increment
        ? initialValue + 1
        : Math.max(0, initialValue - 1);
      handleRequestVectorChange(idx, newValue.toString());

      // Start continuous increment/decrement after delay
      timeoutRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          // Get the latest value from ref
          const currentValue = requestVectorRef.current[idx];
          const nextValue = increment
            ? currentValue + 1
            : Math.max(0, currentValue - 1);
          handleRequestVectorChange(idx, nextValue.toString());
        }, 80); // Repeat every 80ms for smoother experience
      }, 400); // Start repeating after 400ms hold
    },
    [isDisabled, clearTimers, handleRequestVectorChange],
  );

  const handleMouseUp = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

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
      setMountValidationErrors(true);
      setTimeout(() => setShowValidationErrors(true), 10);

      return;
    }

    const request: ResourceRequest = {
      processId: selectedProcess,
      requestVector: [...requestVector],
    };

    onRequestSubmit(request);
  }, [selectedProcess, requestVector, validateRequest, onRequestSubmit]);

  const handleReset = useCallback(() => {
    // Reset all process request vectors
    setProcessRequestVectors({});
    setRequestVector(new Array(resourceCount).fill(0));

    // Clear from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("bankers-process-request-vectors");
    }

    // Clear validation errors with smooth animation
    if (mountValidationErrors) {
      setShowValidationErrors(false);
      if (unmountTimeoutRef.current) {
        clearTimeout(unmountTimeoutRef.current);
      }
      unmountTimeoutRef.current = setTimeout(() => {
        setMountValidationErrors(false);
        setValidationErrors([]);
      }, 500);
    }
  }, [resourceCount, mountValidationErrors]);

  // Generate process options (P0, P1, P2, etc.)
  const processOptions = Array.from({ length: processCount }, (_, i) => ({
    value: i,
    label: `P${i}`,
  }));

  const handleProcessSelect = (processId: number) => {
    // Load the saved request vector for the selected process
    const savedVector = processRequestVectors[processId];
    if (savedVector) {
      const newVector = new Array(resourceCount).fill(0);
      const copyLength = Math.min(savedVector.length, resourceCount);
      for (let i = 0; i < copyLength; i++) {
        newVector[i] = savedVector[i] || 0;
      }
      setRequestVector(newVector);
    } else {
      // If no saved vector, reset to zeros
      setRequestVector(new Array(resourceCount).fill(0));
    }

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
            onClick={() => !isDisabled && setIsDropdownOpen(!isDropdownOpen)}
            disabled={isDisabled}
            className="w-full h-12 px-5 text-left flex items-center justify-between rounded-full border transition-colors duration-200 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--input-bg, #ffffff)",
              borderColor: "var(--input-border, #e1e1e1)",
              color: "var(--foreground)",
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
              className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              style={{ color: "var(--text-secondary, #6b7280)" }}
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
                backgroundColor: "var(--input-bg, #ffffff)",
                borderColor: "var(--input-border, #e1e1e1)",
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
                      backgroundColor:
                        selectedProcess === option.value
                          ? "var(--need-bg, #f9fafb)"
                          : "transparent",
                      color: "var(--foreground)",
                      animationDelay: `${index * 30}ms`,
                    }}
                    onMouseEnter={(e) => {
                      if (selectedProcess !== option.value) {
                        e.currentTarget.style.backgroundColor =
                          "var(--button-hover-bg, #f3f4f6)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        selectedProcess === option.value
                          ? "var(--need-bg, #f9fafb)"
                          : "transparent";
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
                        style={{ color: "var(--text-secondary, #6b7280)" }}
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
                  style={{ color: "var(--text-secondary, #6b7280)" }}
                >
                  {resourceLabels[index] || `R${index}`}
                </label>
                <div className="relative group">
                  <input
                    id={`resource-${index}`}
                    type="text"
                    inputMode="numeric"
                    value={value.toString()}
                    onChange={(e) => {
                      const inputValue = e.target.value.replace(/[^0-9]/g, "");
                      handleRequestVectorChange(index, inputValue);
                    }}
                    disabled={isDisabled}
                    className="w-full h-10 px-3 text-center text-sm bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation font-medium"
                    style={{
                      backgroundColor: "var(--input-bg, #ffffff)",
                      borderColor: "var(--input-border, #e1e1e1)",
                      color: "var(--foreground)",
                      borderRadius: "9999px",
                    }}
                    placeholder="0"
                  />
                  <div className="absolute right-0.5 top-1/2 -translate-y-1/2 flex-col opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 hidden md:flex">
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleMouseDown(index, true);
                      }}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        handleMouseDown(index, true);
                      }}
                      onTouchEnd={handleMouseUp}
                      onTouchCancel={handleMouseUp}
                      disabled={isDisabled}
                      className="h-4 w-6 flex items-center justify-center hover:bg-white/80 backdrop-blur-sm rounded-t disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent select-none"
                      aria-label="Increment"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 15l-6-6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleMouseDown(index, false);
                      }}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        handleMouseDown(index, false);
                      }}
                      onTouchEnd={handleMouseUp}
                      onTouchCancel={handleMouseUp}
                      disabled={isDisabled}
                      className="h-4 w-6 flex items-center justify-center hover:bg-white/80 backdrop-blur-sm rounded-b disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent select-none"
                      aria-label="Decrement"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Validation Errors */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          validationErrors.length > 0 && mountValidationErrors
            ? "max-h-12 mt-1"
            : "max-h-0 mt-0"
        }`}
      >
        <p
          className={`text-xs text-red-500 dark:text-red-400 transition-opacity duration-500 ${
            showValidationErrors ? "opacity-100" : "opacity-0"
          }`}
        >
          {validationErrors[0]}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 transition-all duration-500">
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-full transition-colors duration-200 touch-manipulation"
        >
          {isProcessing ? "Processing..." : "Request"}
        </button>
        <button
          onClick={handleReset}
          disabled={isDisabled}
          className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full transition-colors duration-200 touch-manipulation disabled:bg-gray-200 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--button-bg, #ffffff)",
            borderColor: "var(--button-border, #e1e1e1)",
            color: "var(--foreground)",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};
