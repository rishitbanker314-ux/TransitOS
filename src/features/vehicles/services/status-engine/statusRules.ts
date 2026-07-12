import { StatusTransitionPayload, VehicleState } from './statusTypes';

export interface BusinessRule {
  id: string;
  reason: string;
  validate: (currentStatus: VehicleState, payload: StatusTransitionPayload) => boolean;
  errorMessage: string;
}

export const statusRules: BusinessRule[] = [
  {
    id: 'VR-01',
    reason: 'Cannot assign retired or disposed vehicle.',
    validate: (currentStatus) => currentStatus !== 'Retired' && currentStatus !== 'Disposed',
    errorMessage: 'Vehicle is retired or disposed and cannot participate in active operations.',
  },
  {
    id: 'VR-02',
    reason: 'Cannot decrease odometer.',
    validate: (_, payload) => {
      const current = payload.context?.currentOdometer;
      const newOdo = payload.context?.newOdometer;
      if (current !== undefined && newOdo !== undefined) {
        return newOdo >= current;
      }
      return true; // Pass if context not provided
    },
    errorMessage: 'Odometer reading cannot be lower than the current value.',
  },
  {
    id: 'VR-03',
    reason: 'Mandatory pre-trip checklist must be complete to start trip.',
    validate: (_, payload) => {
      if (payload.requestedState === 'OnTrip') {
        return payload.context?.checklistComplete !== false;
      }
      return true;
    },
    errorMessage: 'Pre-trip inspection checklist is incomplete.',
  },
  {
    id: 'VR-04',
    reason: 'Cannot dispatch if insurance is expired.',
    validate: (_, payload) => {
      if (payload.requestedState === 'Assigned' || payload.requestedState === 'OnTrip') {
        if (payload.context?.insuranceExpiry) {
          return payload.context.insuranceExpiry > new Date();
        }
      }
      return true;
    },
    errorMessage: 'Cannot dispatch: Insurance is expired.',
  },
  {
    id: 'VR-05',
    reason: 'Terminal state lock.',
    validate: (currentStatus) => currentStatus !== 'Disposed',
    errorMessage: 'Disposed vehicles are permanently locked and cannot be modified.',
  }
];
