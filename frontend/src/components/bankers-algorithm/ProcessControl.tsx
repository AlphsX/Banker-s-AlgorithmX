"use client";

import React from "react";
import { CountControl } from "./CountControl";

interface ProcessControlProps {
  processCount: number;
  onProcessCountChange: (count: number) => void;
  disabled?: boolean;
}

export const ProcessControl: React.FC<ProcessControlProps> = ({
  processCount,
  onProcessCountChange,
  disabled = false,
}) => {
  return (
    <CountControl
      label="Processes"
      count={processCount}
      onCountChange={onProcessCountChange}
      minValue={1}
      maxValue={10}
      minWarningMessage="Minimum 1 process required"
      maxWarningMessage="Maximum 10 processes allowed"
      disabled={disabled}
      ariaLabel="process"
    />
  );
};
