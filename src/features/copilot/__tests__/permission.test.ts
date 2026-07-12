import { PromptBuilder } from '../services/PromptBuilder';

describe('PromptBuilder RBAC Enforcements', () => {
  const mockContextJson = '{"vehicles": [], "drivers": []}';

  it('permits dispatch proposals for Dispatcher role', () => {
    const prompt = PromptBuilder.buildSystemInstruction(mockContextJson, 'dispatch_proposal');
    expect(prompt).toContain('admin');
    expect(prompt).toContain('dispatcher');
  });

  it('mentions that non-permitted roles must show permission warnings', () => {
    const prompt = PromptBuilder.buildSystemInstruction(mockContextJson, 'maintenance_proposal');
    expect(prompt).toContain('does not have permission');
  });
});
