"use client";

import React from "react";
import { ProcessControl } from "./ProcessControl";
import { ResourceControl } from "./ResourceControl";
import { AvailableResourcesInput } from "./AvailableResourcesInput";
import { RequestPanel } from "./RequestPanel";
import { ResourceRequest } from "@/types/bankers-algorithm";

interface SystemControlsProps {
  processCount: number;
  resourceCount: number;
  available: number[];
  need?: number[][];
  onProcessCountChange: (count: number) => void;
  onResourceCountChange: (count: number) => void;
  onAvailableChange: (index: number, value: number) => void;
  onRequestSubmit?: (request: ResourceRequest) => void;
  isProcessingRequest?: boolean;
  isCalculating?: boolean;
  isCollapsed?: boolean;
  shouldResetRequest?: boolean;
  onRequestResetComplete?: () => void;
}

export const SystemControls: React.FC<SystemControlsProps> = ({
  processCount,
  resourceCount,
  available,
  need = [],
  onProcessCountChange,
  onResourceCountChange,
  onAvailableChange,
  onRequestSubmit,
  isProcessingRequest = false,
  isCalculating = false,
  isCollapsed = false,
  shouldResetRequest = false,
  onRequestResetComplete,
}) => {
  if (isCollapsed) {
    return null;
  }

  const isDisabled = isProcessingRequest || isCalculating;

  return (
    <div className="px-6 py-2">
      <div className="space-y-4">
        <div className="space-y-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
            System Controls
          </h3>

          <ProcessControl
            processCount={processCount}
            onProcessCountChange={onProcessCountChange}
            disabled={isDisabled}
          />

          <ResourceControl
            resourceCount={resourceCount}
            onResourceCountChange={onResourceCountChange}
            disabled={isDisabled}
          />

          <AvailableResourcesInput
            available={available}
            onAvailableChange={onAvailableChange}
            disabled={isDisabled}
          />
        </div>

        {/* Request Panel */}
        {onRequestSubmit && (
          <div className="pt-2">
            <RequestPanel
              processCount={processCount}
              resourceCount={resourceCount}
              need={need}
              available={available}
              onRequestSubmit={onRequestSubmit}
              isProcessing={isProcessingRequest}
              disabled={isDisabled}
              shouldResetAfterRequest={shouldResetRequest}
              onResetComplete={onRequestResetComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
};
