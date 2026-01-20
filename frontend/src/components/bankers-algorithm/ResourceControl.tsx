'use client';

import React from 'react';
import {CountControl} from './CountControl';
import {CONTROL_CONFIGS} from './constants';

interface ResourceControlProps {
  resourceCount: number;
  onResourceCountChange: (count: number) => void;
  disabled?: boolean;
}

export const ResourceControl: React.FC<ResourceControlProps> = ({
  resourceCount,
  onResourceCountChange,
  disabled = false,
}) => {
  const config = CONTROL_CONFIGS.resource;
  return (
    <CountControl
      label={config.label}
      count={resourceCount}
      onCountChange={onResourceCountChange}
      minValue={config.minValue}
      maxValue={config.maxValue}
      minWarningMessage={config.minWarningMessage}
      maxWarningMessage={config.maxWarningMessage}
      disabled={disabled}
      ariaLabel={config.ariaLabel}
    />
  );
};
