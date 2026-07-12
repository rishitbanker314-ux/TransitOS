import { Vehicle } from '../types/vehicle.types';

export interface FieldChange {
  field: keyof Vehicle;
  oldValue: any;
  newValue: any;
}

export class VehicleDiffEngine {
  /**
   * Compares the original vehicle document with the new payload and returns 
   * an array of FieldChange objects.
   */
  static computeDifferences(original: Vehicle, updated: Partial<Vehicle>): FieldChange[] {
    const changes: FieldChange[] = [];

    const keysToCompare = Object.keys(updated) as Array<keyof Vehicle>;

    for (const key of keysToCompare) {
      // Ignore undefined values in the update payload
      if (updated[key] === undefined) continue;

      // Strict equality comparison for primitives. 
      if (original[key] !== updated[key]) {
        changes.push({
          field: key,
          oldValue: original[key],
          newValue: updated[key]
        });
      }
    }

    return changes;
  }

  /**
   * Generates a flat object of new values for audit logs.
   */
  static getAuditData(changes: FieldChange[]): { oldData: any, newData: any } {
    const oldData: any = {};
    const newData: any = {};

    changes.forEach(change => {
      oldData[change.field] = change.oldValue;
      newData[change.field] = change.newValue;
    });

    return { oldData, newData };
  }
}
