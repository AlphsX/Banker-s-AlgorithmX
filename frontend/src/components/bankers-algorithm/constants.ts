/**
 * Shared constants for Banker's Algorithm UI components
 */

export type ControlType = 'process' | 'resource';

export interface ControlConfig {
  label: string;
  ariaLabel: string;
  minWarningMessage: string;
  maxWarningMessage: string;
  minValue: number;
  maxValue: number;
}

export const CONTROL_CONFIGS: Record<ControlType, ControlConfig> = {
  process: {
    label: 'Processes',
    ariaLabel: 'process',
    minWarningMessage: 'Minimum 1 process required',
    maxWarningMessage: 'Maximum 10 processes allowed',
    minValue: 1,
    maxValue: 10,
  },
  resource: {
    label: 'Resources',
    ariaLabel: 'resource',
    minWarningMessage: 'Minimum 1 resource required',
    maxWarningMessage: 'Maximum 10 resources allowed',
    minValue: 1,
    maxValue: 10,
  },
};
