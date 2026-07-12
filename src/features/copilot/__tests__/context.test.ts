import { ContextEngine } from '../services/ContextEngine';

describe('ContextEngine', () => {
  let contextEngine: ContextEngine;

  beforeEach(() => {
    contextEngine = new ContextEngine();
  });

  it('generates a valid JSON context string with user roles and selected items', async () => {
    const rawContext = await contextEngine.getSystemContext({
      userRole: 'Dispatcher',
      activeView: 'CommandCenter',
      activeVehicleId: 'v-101'
    });

    const parsed = JSON.parse(rawContext);
    expect(parsed.userRole).toBe('Dispatcher');
    expect(parsed.activeScreen).toBe('CommandCenter');
    expect(parsed.selectedVehicleId).toBe('v-101');
    expect(Array.isArray(parsed.vehicles)).toBe(true);
    expect(Array.isArray(parsed.drivers)).toBe(true);
    expect(Array.isArray(parsed.trips)).toBe(true);
  });
});
