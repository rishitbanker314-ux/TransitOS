import { DriverService } from '../services/driver.service';
import { CreateDriverDTO } from '../types/driver.types';
import { driverSchema } from '../schemas/driver.schema';

// Mock dependencies
jest.mock('@/lib/firebase/config', () => ({
  db: {}
}));
jest.mock('firebase/firestore', () => ({
  runTransaction: jest.fn(),
  doc: jest.fn(),
  collection: jest.fn()
}));
jest.mock('../repositories/driver.repository');
jest.mock('@/lib/services/audit.service');
jest.mock('@/lib/services/permission.service');

describe('DriverService', () => {
  let service: DriverService;
  let mockPermissions: any;
  let mockAudit: any;
  
  beforeEach(() => {
    mockPermissions = { requireRole: jest.fn() };
    mockAudit = { logTransaction: jest.fn() };
    service = new DriverService(undefined, mockAudit, mockPermissions);
  });

  describe('createDriver', () => {
    it('requires admin or hr_manager role', async () => {
      const payload: CreateDriverDTO = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        dateOfBirth: '1990-01-01T00:00:00Z',
        joinedAt: '2026-07-01T00:00:00Z'
      };

      try {
        await service.createDriver(payload, 'user123');
      } catch (e) {
        // expect transaction to fail because of mock, but role check passes first
      }

      expect(mockPermissions.requireRole).toHaveBeenCalledWith(['admin', 'hr_manager', 'fleet_manager']);
    });

    it('validates payload with zod schema', () => {
      const invalidPayload = { email: 'not-an-email' } as CreateDriverDTO;
      expect(() => service.createDriver(invalidPayload, 'user123')).rejects.toThrow();
    });
  });

  describe('assignToTrip', () => {
    it('requires dispatcher role', async () => {
      try {
        await service.assignToTrip('driver123', 'trip123', 'user123');
      } catch (e) {}
      
      expect(mockPermissions.requireRole).toHaveBeenCalledWith(['admin', 'dispatcher']);
    });
  });
});
