"use client";

import React from "react";
import { CountControl } from "./CountControl";

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
  return (
    <CountControl
      label="Resources"
      count={resourceCount}
      onCountChange={onResourceCountChange}
      minValue={1}
      maxValue={10}
      minWarningMessage="Minimum 1 resource required"
      maxWarningMessage="Maximum 10 resources allowed"
      disabled={disabled}
      ariaLabel="resource"
    />
  );
};
