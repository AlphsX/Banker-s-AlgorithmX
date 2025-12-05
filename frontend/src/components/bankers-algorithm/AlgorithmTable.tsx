"use client";

import React, { useRef, useCallback } from "react";
import { AlgorithmStep } from "@/types/bankers-algorithm";
import { AnimatedFinishBadge } from "./AnimatedFinishBadge";

interface AlgorithmTableProps {
  processCount: number;
  resourceCount: number;
  allocation: number[][];
  max: number[][];
  need: number[][];
  finish: boolean[];
  algorithmSteps: AlgorithmStep[];
  isCalculating: boolean;
  isProcessingRequest?: boolean;
  currentStepIndex?: number;
  onAllocationChange: (
    process: number,
    resource: number,
    value: number,
  ) => void;
  onMaxChange: (process: number, resource: number, value: number) => void;
}

export const AlgorithmTable: React.FC<AlgorithmTableProps> = ({
  processCount,
  resourceCount,
  allocation,
  max,
  need,
  finish,
  algorithmSteps,
  isCalculating,
  isProcessingRequest = false,
  currentStepIndex,
  onAllocationChange,
  onMaxChange,
}) => {
  const resourceLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const isDisabled = isCalculating || isProcessingRequest;
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const allocationRef = useRef(allocation);
  const maxRef = useRef(max);

  // Update refs when values change
  React.useEffect(() => {
    allocationRef.current = allocation;
    maxRef.current = max;
  }, [allocation, max]);

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

  const handleMouseDown = useCallback(
    (
      type: "allocation" | "max",
      processIdx: number,
      resourceIdx: number,
      increment: boolean
    ) => {
      if (isDisabled) return;

      clearTimers();

      const onChange = type === "allocation" ? onAllocationChange : onMaxChange;
      const currentMatrix = type === "allocation" ? allocationRef : maxRef;

      // Immediate action
      const initialValue = currentMatrix.current[processIdx][resourceIdx];
      const newValue = increment
        ? Math.min(999, initialValue + 1)
        : Math.max(0, initialValue - 1);
      onChange(processIdx, resourceIdx, newValue);

      // Start continuous increment/decrement after delay
      timeoutRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          const currentValue = currentMatrix.current[processIdx][resourceIdx];
          const nextValue = increment
            ? Math.min(999, currentValue + 1)
            : Math.max(0, currentValue - 1);
          onChange(processIdx, resourceIdx, nextValue);
        }, 80);
      }, 400);
    },
    [isDisabled, onAllocationChange, onMaxChange, clearTimers]
  );

  const handleMouseUp = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  // Get the process being checked at the current step
  const currentProcessChecked =
    currentStepIndex !== undefined && algorithmSteps[currentStepIndex]
      ? algorithmSteps[currentStepIndex].processChecked
      : undefined;
  const currentProcessIndex = currentProcessChecked
    ? parseInt(currentProcessChecked.replace("P", ""))
    : undefined;

  return (
    <div
      className="bg-white rounded-xl overflow-hidden"
      style={{
        backgroundColor: "var(--table-bg)",
        border: "1px solid var(--table-border)",
      }}
    >
      <div className="overflow-x-auto">
        <table
          className="w-full min-w-max bg-white"
          style={{ backgroundColor: "var(--table-bg)" }}
        >
          <thead>
            {/* Main header row */}
            <tr style={{ borderBottom: "1px solid var(--table-border)" }}>
              <th className="text-left px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 min-w-[100px]">
                Processes
              </th>
              <th className="text-center px-4 py-4 font-semibold text-gray-900 dark:text-gray-100">
                Allocation
              </th>
              <th className="text-center px-4 py-4 font-semibold text-gray-900 dark:text-gray-100">
                Max
              </th>
              <th className="text-center px-4 py-4 font-semibold text-gray-900 dark:text-gray-100">
                Need
              </th>
              <th className="text-center px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 min-w-[100px]">
                Finish
              </th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: processCount }, (_, processIndex) => {
              const isHighlighted = currentProcessIndex === processIndex;

              return (
                <tr
                  key={processIndex}
                  className={`transition-all duration-300 ${
                    isHighlighted
                      ? "bg-gray-100 dark:bg-gray-800/50 ring-2 ring-gray-300 dark:ring-gray-600 ring-inset"
                      : ""
                  }`}
                  style={{
                    borderBottom:
                      processIndex < processCount - 1
                        ? "1px solid var(--table-border)"
                        : "none",
                  }}
                >
                  {/* Process name */}
                  <td className="px-6 py-6 font-semibold text-gray-900 dark:text-gray-100">
                    P{processIndex}
                  </td>

                  {/* Allocation section */}
                  <td className="px-4 py-6 text-center">
                    <div className="flex space-x-3 justify-center">
                      {Array.from(
                        { length: resourceCount },
                        (_, resourceIndex) => (
                          <div
                            key={`alloc-${resourceIndex}`}
                            className="flex flex-col items-center"
                          >
                            {/* Resource label positioned at top center */}
                            <div
                              className="text-xs font-medium mb-2"
                              style={{
                                color: "var(--text-secondary, #6b7280)",
                              }}
                            >
                              {resourceLabels[resourceIndex] ||
                                `R${resourceIndex}`}
                            </div>
                            {/* Input field with spinner */}
                            <div className="relative group w-16">
                              <input
                                type="text"
                                inputMode="numeric"
                                value={allocation[processIndex][resourceIndex].toString()}
                                onChange={(e) => {
                                  const inputValue = e.target.value.replace(/[^0-9]/g, '');
                                  const value = parseInt(inputValue) || 0;
                                  onAllocationChange(
                                    processIndex,
                                    resourceIndex,
                                    Math.max(0, Math.min(999, value)),
                                  );
                                }}
                                disabled={isDisabled}
                                className="w-full h-10 px-3 text-center rounded-full bg-white text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                  border: "1px solid var(--table-border)",
                                  backgroundColor: "var(--input-bg, #ffffff)",
                                  color: "var(--foreground)",
                                }}
                                placeholder="0"
                              />
                              <div className="absolute right-0.5 top-1/2 -translate-y-1/2 flex flex-col opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
                                <button
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleMouseDown("allocation", processIndex, resourceIndex, true);
                                  }}
                                  onMouseUp={handleMouseUp}
                                  onMouseLeave={handleMouseUp}
                                  onTouchStart={(e) => {
                                    e.preventDefault();
                                    handleMouseDown("allocation", processIndex, resourceIndex, true);
                                  }}
                                  onTouchEnd={handleMouseUp}
                                  onTouchCancel={handleMouseUp}
                                  disabled={isDisabled}
                                  className="h-4 w-6 flex items-center justify-center hover:bg-white/80 backdrop-blur-sm rounded-t disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent select-none"
                                  aria-label="Increment"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleMouseDown("allocation", processIndex, resourceIndex, false);
                                  }}
                                  onMouseUp={handleMouseUp}
                                  onMouseLeave={handleMouseUp}
                                  onTouchStart={(e) => {
                                    e.preventDefault();
                                    handleMouseDown("allocation", processIndex, resourceIndex, false);
                                  }}
                                  onTouchEnd={handleMouseUp}
                                  onTouchCancel={handleMouseUp}
                                  disabled={isDisabled}
                                  className="h-4 w-6 flex items-center justify-center hover:bg-white/80 backdrop-blur-sm rounded-b disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent select-none"
                                  aria-label="Decrement"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </td>

                  {/* Max section */}
                  <td className="px-4 py-6 text-center">
                    <div className="flex space-x-3 justify-center">
                      {Array.from(
                        { length: resourceCount },
                        (_, resourceIndex) => (
                          <div
                            key={`max-${resourceIndex}`}
                            className="flex flex-col items-center"
                          >
                            {/* Resource label positioned at top center */}
                            <div
                              className="text-xs font-medium mb-2"
                              style={{
                                color: "var(--text-secondary, #6b7280)",
                              }}
                            >
                              {resourceLabels[resourceIndex] ||
                                `R${resourceIndex}`}
                            </div>
                            {/* Input field with spinner */}
                            <div className="relative group w-16">
                              <input
                                type="text"
                                inputMode="numeric"
                                value={max[processIndex][resourceIndex].toString()}
                                onChange={(e) => {
                                  const inputValue = e.target.value.replace(/[^0-9]/g, '');
                                  const value = parseInt(inputValue) || 0;
                                  onMaxChange(
                                    processIndex,
                                    resourceIndex,
                                    Math.max(0, Math.min(999, value)),
                                  );
                                }}
                                disabled={isDisabled}
                                className="w-full h-10 px-3 text-center rounded-full bg-white text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                  border: "1px solid var(--table-border)",
                                  backgroundColor: "var(--input-bg, #ffffff)",
                                  color: "var(--foreground)",
                                }}
                                placeholder="0"
                              />
                              <div className="absolute right-0.5 top-1/2 -translate-y-1/2 flex flex-col opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
                                <button
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleMouseDown("max", processIndex, resourceIndex, true);
                                  }}
                                  onMouseUp={handleMouseUp}
                                  onMouseLeave={handleMouseUp}
                                  onTouchStart={(e) => {
                                    e.preventDefault();
                                    handleMouseDown("max", processIndex, resourceIndex, true);
                                  }}
                                  onTouchEnd={handleMouseUp}
                                  onTouchCancel={handleMouseUp}
                                  disabled={isDisabled}
                                  className="h-4 w-6 flex items-center justify-center hover:bg-white/80 backdrop-blur-sm rounded-t disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent select-none"
                                  aria-label="Increment"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleMouseDown("max", processIndex, resourceIndex, false);
                                  }}
                                  onMouseUp={handleMouseUp}
                                  onMouseLeave={handleMouseUp}
                                  onTouchStart={(e) => {
                                    e.preventDefault();
                                    handleMouseDown("max", processIndex, resourceIndex, false);
                                  }}
                                  onTouchEnd={handleMouseUp}
                                  onTouchCancel={handleMouseUp}
                                  disabled={isDisabled}
                                  className="h-4 w-6 flex items-center justify-center hover:bg-white/80 backdrop-blur-sm rounded-b disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent select-none"
                                  aria-label="Decrement"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </td>

                  {/* Need section */}
                  <td className="px-4 py-6 text-center">
                    <div className="flex space-x-3 justify-center">
                      {Array.from(
                        { length: resourceCount },
                        (_, resourceIndex) => (
                          <div
                            key={`need-${resourceIndex}`}
                            className="flex flex-col items-center"
                          >
                            {/* Resource label positioned at top center */}
                            <div
                              className="text-xs font-medium mb-2"
                              style={{
                                color: "var(--text-secondary, #6b7280)",
                              }}
                            >
                              {resourceLabels[resourceIndex] ||
                                `R${resourceIndex}`}
                            </div>
                            {/* Read-only field */}
                            <div
                              className="w-16 h-10 px-3 flex items-center justify-center rounded-full bg-gray-50 text-gray-700 text-sm font-medium"
                              style={{
                                backgroundColor: "var(--need-bg, #f9fafb)",
                                color: "var(--text-secondary, #6b7280)",
                                border: "1px solid var(--table-border)",
                              }}
                            >
                              {need[processIndex][resourceIndex]}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </td>

                  {/* Finish column */}
                  <td className="px-6 py-6 text-center">
                    <AnimatedFinishBadge
                      processIndex={processIndex}
                      finalFinishState={finish[processIndex]}
                      algorithmSteps={algorithmSteps}
                      isCalculating={isCalculating}
                      currentStepIndex={currentStepIndex}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
