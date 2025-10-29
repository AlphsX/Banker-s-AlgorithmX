"use client";

import React from 'react';

interface AlgorithmTableProps {
  processCount: number;
  resourceCount: number;
  allocation: number[][];
  max: number[][];
  need: number[][];
  finish: boolean[];
  onAllocationChange: (process: number, resource: number, value: number) => void;
  onMaxChange: (process: number, resource: number, value: number) => void;
}

export const AlgorithmTable: React.FC<AlgorithmTableProps> = ({
  processCount,
  resourceCount,
  allocation,
  max,
  need,
  finish,
  onAllocationChange,
  onMaxChange,
}) => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200/40 dark:border-gray-700/40 rounded-2xl p-3 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
        Algorithm Table
      </h2>
      
      {/* Responsive table container with enhanced mobile scrolling */}
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="min-w-max px-3 sm:px-0">
          <table className="w-full border-collapse">
            <thead>
              {/* Main header row */}
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left p-2 sm:p-3 font-medium text-gray-700 dark:text-gray-300 min-w-[60px] sm:min-w-[80px] sticky left-0 bg-white/80 dark:bg-gray-800/40 backdrop-blur-xl z-10">
                  Process
                </th>
                <th 
                  className="text-center p-2 sm:p-3 font-medium text-gray-700 dark:text-gray-300 border-l border-gray-200 dark:border-gray-700" 
                  colSpan={resourceCount}
                >
                  Allocation
                </th>
                <th 
                  className="text-center p-2 sm:p-3 font-medium text-gray-700 dark:text-gray-300 border-l border-gray-200 dark:border-gray-700" 
                  colSpan={resourceCount}
                >
                  Max
                </th>
                <th 
                  className="text-center p-2 sm:p-3 font-medium text-gray-700 dark:text-gray-300 border-l border-gray-200 dark:border-gray-700" 
                  colSpan={resourceCount}
                >
                  Need
                </th>
                <th className="text-center p-2 sm:p-3 font-medium text-gray-700 dark:text-gray-300 border-l border-gray-200 dark:border-gray-700 min-w-[60px] sm:min-w-[80px]">
                  Finish
                </th>
              </tr>
              
              {/* Resource labels row */}
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <th className="p-1 sm:p-2 sticky left-0 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-xl z-10"></th>
                
                {/* Allocation resource labels */}
                {Array.from({ length: resourceCount }, (_, i) => (
                  <th 
                    key={`alloc-label-${i}`} 
                    className={`text-center p-1 sm:p-2 text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[50px] sm:min-w-[60px] ${
                      i === 0 ? 'border-l border-gray-200 dark:border-gray-700' : ''
                    }`}
                  >
                    R{i}
                  </th>
                ))}
                
                {/* Max resource labels */}
                {Array.from({ length: resourceCount }, (_, i) => (
                  <th 
                    key={`max-label-${i}`} 
                    className={`text-center p-1 sm:p-2 text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[50px] sm:min-w-[60px] ${
                      i === 0 ? 'border-l border-gray-200 dark:border-gray-700' : ''
                    }`}
                  >
                    R{i}
                  </th>
                ))}
                
                {/* Need resource labels */}
                {Array.from({ length: resourceCount }, (_, i) => (
                  <th 
                    key={`need-label-${i}`} 
                    className={`text-center p-1 sm:p-2 text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[50px] sm:min-w-[60px] ${
                      i === 0 ? 'border-l border-gray-200 dark:border-gray-700' : ''
                    }`}
                  >
                    R{i}
                  </th>
                ))}
                
                <th className="border-l border-gray-200 dark:border-gray-700"></th>
              </tr>
            </thead>
            
            <tbody>
              {Array.from({ length: processCount }, (_, processIndex) => (
                <tr 
                  key={processIndex} 
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors duration-150"
                >
                  {/* Process name - sticky on mobile */}
                  <td className="p-2 sm:p-3 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white/80 dark:bg-gray-800/40 backdrop-blur-xl z-10">
                    P{processIndex}
                  </td>
                  
                  {/* Allocation inputs */}
                  {Array.from({ length: resourceCount }, (_, resourceIndex) => (
                    <td 
                      key={`alloc-${processIndex}-${resourceIndex}`} 
                      className={`p-1 sm:p-2 ${resourceIndex === 0 ? 'border-l border-gray-200 dark:border-gray-700' : ''}`}
                    >
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        max="999"
                        value={allocation[processIndex][resourceIndex]}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          onAllocationChange(processIndex, resourceIndex, Math.max(0, value));
                        }}
                        className="w-full max-w-[50px] sm:max-w-[60px] px-1 sm:px-2 py-1 text-xs sm:text-sm text-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 touch-manipulation"
                        placeholder="0"
                      />
                    </td>
                  ))}
                  
                  {/* Max inputs */}
                  {Array.from({ length: resourceCount }, (_, resourceIndex) => (
                    <td 
                      key={`max-${processIndex}-${resourceIndex}`} 
                      className={`p-1 sm:p-2 ${resourceIndex === 0 ? 'border-l border-gray-200 dark:border-gray-700' : ''}`}
                    >
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        max="999"
                        value={max[processIndex][resourceIndex]}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          onMaxChange(processIndex, resourceIndex, Math.max(0, value));
                        }}
                        className="w-full max-w-[50px] sm:max-w-[60px] px-1 sm:px-2 py-1 text-xs sm:text-sm text-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 touch-manipulation"
                        placeholder="0"
                      />
                    </td>
                  ))}
                  
                  {/* Need (read-only, auto-calculated) */}
                  {Array.from({ length: resourceCount }, (_, resourceIndex) => (
                    <td 
                      key={`need-${processIndex}-${resourceIndex}`} 
                      className={`p-1 sm:p-2 ${resourceIndex === 0 ? 'border-l border-gray-200 dark:border-gray-700' : ''}`}
                    >
                      <div className="w-full max-w-[50px] sm:max-w-[60px] px-1 sm:px-2 py-1 text-xs sm:text-sm text-center bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 font-mono">
                        {need[processIndex][resourceIndex]}
                      </div>
                    </td>
                  ))}
                  
                  {/* Finish column with color-coded indicators */}
                  <td className="p-2 sm:p-3 text-center border-l border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center">
                      <div 
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-200 touch-manipulation ${
                          finish[processIndex] 
                            ? 'bg-green-500 dark:bg-green-400 shadow-lg shadow-green-500/30' 
                            : 'bg-red-500 dark:bg-red-400 shadow-lg shadow-red-500/30'
                        }`}
                        title={finish[processIndex] ? 'Process can finish' : 'Process cannot finish'}
                      >
                        {finish[processIndex] ? '✓' : '✗'}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Mobile-friendly note with improved styling */}
      <div className="mt-3 sm:mt-4 text-xs text-gray-500 dark:text-gray-400 text-center sm:hidden bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
        <span className="inline-flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          Scroll horizontally to view all columns
        </span>
      </div>
    </div>
  );
};