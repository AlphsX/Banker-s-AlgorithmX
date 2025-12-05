"use client";

import React, { useState } from "react";

interface AvailableResourcesInputProps {
  available: number[];
  onAvailableChange: (index: number, value: number) => void;
  disabled?: boolean;
}

interface ValidationError {
  index: number;
  message: string;
}

export const AvailableResourcesInput: React.FC<
  AvailableResourcesInputProps
> = ({ available, onAvailableChange, disabled = false }) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateInput = (index: number, value: number): string | null => {
    if (isNaN(value)) {
      return "Must be a valid number";
    }
    if (value < 0) {
      return "Must be non-negative";
    }
    if (!Number.isInteger(value)) {
      return "Must be a whole number";
    }
    return null;
  };

  const handleInputChange = (index: number, inputValue: string) => {
    const numericValue = parseInt(inputValue) || 0;
    const validationError = validateInput(index, numericValue);

    // Update errors state
    setErrors((prevErrors) => {
      const newErrors = prevErrors.filter((error) => error.index !== index);
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
    setErrors((prevErrors) =>
      prevErrors.filter((error) => error.index !== index),
    );
  };

  const getErrorForIndex = (index: number): string | null => {
    const error = errors.find((error) => error.index === index);
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
                className="text-sm font-medium text-center block"
                style={{ color: "var(--text-secondary, #6b7280)" }}
                htmlFor={`available-resource-${index}`}
              >
                {resourceLabels[index] || `R${index}`}
              </label>
              <div className="relative group">
                <input
                  id={`available-resource-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={value.toString()}
                  onChange={(e) => {
                    e.stopPropagation();
                    const inputValue = e.target.value.replace(/[^0-9]/g, '');
                    handleInputChange(index, inputValue);
                  }}
                  onBlur={(e) => {
                    handleInputBlur(index, e.target.value);
                  }}
                  disabled={disabled}
                  className={`w-full h-10 px-3 text-center text-sm border rounded-full bg-white text-gray-900 font-medium transition-colors duration-200 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed ${
                    error
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                  style={{
                    backgroundColor: "var(--input-bg, #ffffff)",
                    borderColor: error
                      ? "#ef4444"
                      : "var(--input-border, #e1e1e1)",
                    color: "var(--foreground)",
                  }}
                  aria-label={`Available resources for resource type ${index}`}
                  aria-describedby={error ? `error-${index}` : undefined}
                />
                <div className="absolute right-0.5 top-1/2 -translate-y-1/2 flex flex-col opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
                  <button
                    type="button"
                    onClick={() => onAvailableChange(index, value + 1)}
                    disabled={disabled}
                    className="h-4 w-6 flex items-center justify-center hover:bg-white/80 backdrop-blur-sm rounded-t disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent"
                    aria-label="Increment"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => onAvailableChange(index, Math.max(0, value - 1))}
                    disabled={disabled}
                    className="h-4 w-6 flex items-center justify-center hover:bg-white/80 backdrop-blur-sm rounded-b disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent"
                    aria-label="Decrement"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
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
