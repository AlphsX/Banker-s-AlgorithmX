"use client";

import React from 'react';
import { ProcessControl } from './ProcessControl';
import { ResourceControl } from './ResourceControl';
import { AvailableResourcesInput } from './AvailableResourcesInput';
import { RequestPanel } from './RequestPanel';
import { ResourceRequest } from '@/types/bankers-algorithm';

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
  isCollapsed?: boolean;
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
  isCollapsed = false,
}) => {
  if (isCollapsed) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            System Controls
          </h3>
          
          <ProcessControl
            processCount={processCount}
            onProcessCountChange={onProcessCountChange}
          />
          
          <ResourceControl
            resourceCount={resourceCount}
            onResourceCountChange={onResourceCountChange}
          />
          
          <AvailableResourcesInput
            available={available}
            onAvailableChange={onAvailableChange}
          />
        </div>

        {/* Request Panel */}
        {onRequestSubmit && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <RequestPanel
              processCount={processCount}
              resourceCount={resourceCount}
              need={need}
              available={available}
              onRequestSubmit={onRequestSubmit}
              isProcessing={isProcessingRequest}
            />
          </div>
        )}
      </div>
    </div>
  );
};