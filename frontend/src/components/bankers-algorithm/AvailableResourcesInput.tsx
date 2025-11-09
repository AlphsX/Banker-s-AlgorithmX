"use client";

import React, { useState } from 'react';

interface AvailableResourcesInputProps {
  available: number[];
  onAvailableChange: (index: number, value: number) => void;
  disabled?: boolean;
}

interface ValidationError {
  index: number;
  message: string;
}

export const AvailableResourcesInput: React.FC<AvailableResourcesInputProps> = ({
  available,
  onAvailableChange,
  disabled = false,
}) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateInput = (index: number, value: number): string | null => {
    if (isNaN(value)) {
      return 'Must be a valid number';
    }
    if (value < 0) {
      return 'Must be non-negative';
    }
    if (!Number.isInteger(value)) {
      return 'Must be a whole number';
    }
    return null;
  };

  const handleInputChange = (index: number, inputValue: string) => {
    const numericValue = parseInt(inputValue) || 0;
    const validationError = validateInput(index, numericValue);
    
    // Update errors state
    setErrors(prevErrors => {
      const newErrors = prevErrors.filter(error => error.index !== index);
      if (validationError) {
        newErrors.push({ index, message: validationError });
      }
      return newErrors;
    });

    // Only update the value if it's valid
    if (!validationError) {
      onAvailableChange(index, numericValue);
    }
  };

  const handleInputBlur = (index: number, inputValue: string) => {
    // On blur, ensure we have a valid value even if there was an error
    const numericValue = Math.max(0, parseInt(inputValue) || 0);
    onAvailableChange(index, numericValue);
    
    // Clear any errors for this field
    setErrors(prevErrors => prevErrors.filter(error => error.index !== index));
  };

  const getErrorForIndex = (index: number): string | null => {
    const error = errors.find(error => error.index === index);
    return error ? error.message : null;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Available
      </label>
      <div className="grid grid-cols-3 gap-3">
        {available.map((value, index) => {
          const error = getErrorForIndex(index);
          const resourceLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
          return (
            <div key={index} className="space-y-1">
              <label 
                className="text-sm font-medium text-center block"
                style={{ color: 'var(--text-secondary, #6b7280)' }}
                htmlFor={`available-resource-${index}`}
              >
                {resourceLabels[index] || `R${index}`}
              </label>
              <input
                id={`available-resource-${index}`}
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                value={value}
                onChange={(e) => {
                  e.stopPropagation();
                  handleInputChange(index, e.target.value);
                }}
                onBlur={(e) => {
                  handleInputBlur(index, e.target.value);
                }}
                disabled={disabled}
                className={`w-full h-10 px-3 text-center text-sm border rounded-full bg-white text-gray-900 font-medium transition-colors duration-200 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed ${
                  error
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                style={{
                  backgroundColor: 'var(--input-bg, #ffffff)',
                  borderColor: error ? '#ef4444' : 'var(--input-border, #e1e1e1)',
                  color: 'var(--foreground)'
                }}
                aria-label={`Available resources for resource type ${index}`}
                aria-describedby={error ? `error-${index}` : undefined}
              />
              {error && (
                <p 
                  id={`error-${index}`}
                  className="text-xs text-red-500 dark:text-red-400"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};