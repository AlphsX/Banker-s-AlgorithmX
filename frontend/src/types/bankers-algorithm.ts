/**
 * Core TypeScript interfaces for the Banker's Algorithm Calculator
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
}

export interface AlgorithmStep {
  stepNumber: number;
  description: string;
  workVector: number[];
  processChecked?: string;
  canFinish?: boolean;
  isHighlighted?: boolean;
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
}