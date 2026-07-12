import { PromptBuilder } from '../services/PromptBuilder';

describe('AI Copilot Safety & Security', () => {
  const mockContextJson = '{"vehicles": [], "drivers": []}';

  it('safeguards against direct mutations by requiring JSON proposals', () => {
    const sysInstruction = PromptBuilder.buildSystemInstruction(mockContextJson, 'dispatch_proposal');
    expect(sysInstruction).toContain('You cannot directly modify the database');
    expect(sysInstruction).toContain('```json-proposal');
  });

  it('restricts maintenance proposals based on userRole permission policies', () => {
    const sysInstruction = PromptBuilder.buildSystemInstruction(mockContextJson, 'maintenance_proposal');
    expect(sysInstruction).toContain('Only \'admin\' or \'fleet_manager\' can propose Maintenance');
    expect(sysInstruction).toContain('does not have permission');
  });
});
