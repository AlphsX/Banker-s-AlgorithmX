/**
 * Core TypeScript interfaces for the Banker's Algorithm Calculator
 * Enhanced with additional properties for comprehensive system management
 */

export interface BankersAlgorithmState {
  processCount: number;
  resourceCount: number;
  allocation: number[][];
  max: number[][];
  available: number[];
  need: number[][];
  finish: boolean[];
  safeSequence: string[];
  algorithmSteps: AlgorithmStep[];
  isCalculating: boolean;
  isSafe?: boolean;
  lastUpdated?: Date;
}

export interface AlgorithmStep {
  stepNumber: number | string;
  description: string;
  workVector: number[];
  processChecked?: string;
  canFinish?: boolean;
  isHighlighted?: boolean;
  stepType?: 'initialization' | 'process_check' | 'resource_allocation' | 'completion' | 'failure';
  timestamp?: Date;
}

export interface ResourceRequest {
  processId: number;
  requestVector: number[];
}

export interface SafetyResult {
  isSafe: boolean;
  safeSequence: string[];
  steps: AlgorithmStep[];
  finalFinishState: boolean[];
}

export interface RequestResult {
  canGrant: boolean;
  errorMessage?: string;
  newState?: BankersAlgorithmState;
  simulationSteps?: AlgorithmStep[];
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
  severity?: 'error' | 'warning' | 'info';
}

export interface SystemStatistics {
  totalProcesses: number;
  totalResourceTypes: number;
  completedProcesses: number;
  totalAllocatedResources: number[];
  resourceUtilization: number[];
  averageUtilization: number;
  safetyMargin: number;
}

export interface ProcessInfo {
  id: number;
  name: string;
  allocation: number[];
  maximum: number[];
  need: number[];
  isFinished: boolean;
  canFinishNow?: boolean;
}

export interface ResourceInfo {
  id: number;
  name: string;
  totalInstances: number;
  availableInstances: number;
  allocatedInstances: number;
  utilizationPercentage: number;
}