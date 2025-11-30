"use client";

import React from "react";
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
                            {/* Input field */}
                            <input
                              type="number"
                              inputMode="numeric"
                              min="0"
                              max="999"
                              value={allocation[processIndex][resourceIndex]}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                onAllocationChange(
                                  processIndex,
                                  resourceIndex,
                                  Math.max(0, value),
                                );
                              }}
                              disabled={isDisabled}
                              className="w-12 h-10 text-center rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{
                                border: "1px solid var(--table-border)",
                                backgroundColor: "var(--input-bg, #ffffff)",
                                color: "var(--foreground)",
                              }}
                              placeholder="0"
                            />
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
                            {/* Input field */}
                            <input
                              type="number"
                              inputMode="numeric"
                              min="0"
                              max="999"
                              value={max[processIndex][resourceIndex]}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                onMaxChange(
                                  processIndex,
                                  resourceIndex,
                                  Math.max(0, value),
                                );
                              }}
                              disabled={isDisabled}
                              className="w-12 h-10 text-center rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{
                                border: "1px solid var(--table-border)",
                                backgroundColor: "var(--input-bg, #ffffff)",
                                color: "var(--foreground)",
                              }}
                              placeholder="0"
                            />
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
                              className="w-12 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-700 text-sm"
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
