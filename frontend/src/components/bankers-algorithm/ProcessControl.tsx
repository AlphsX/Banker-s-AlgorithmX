'use client';

import React from 'react';
import {CountControl} from './CountControl';
import {CONTROL_CONFIGS} from './constants';

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
  const config = CONTROL_CONFIGS.process;
  return (
    <CountControl
      label={config.label}
      count={processCount}
      onCountChange={onProcessCountChange}
      minValue={config.minValue}
      maxValue={config.maxValue}
      minWarningMessage={config.minWarningMessage}
      maxWarningMessage={config.maxWarningMessage}
      disabled={disabled}
      ariaLabel={config.ariaLabel}
    />
  );
};
