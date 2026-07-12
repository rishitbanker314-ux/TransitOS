import { GeminiService } from '../services/GeminiService';

describe('Streaming Responses', () => {
  let service: GeminiService;

  beforeEach(() => {
    service = new GeminiService();
  });

  it('streams responses chunk-by-chunk in offline simulation mode', async () => {
    const stream = service.streamChatResponse('Which driver is overworked?', [], 'Dispatcher');
    const chunks: string[] = [];
    let proposal = null;

    for await (const chunk of stream) {
      if (chunk.text) {
        chunks.push(chunk.text);
      }
      if (chunk.proposal) {
        proposal = chunk.proposal;
      }
    }

    const fullResponse = chunks.join('');
    expect(fullResponse.length).toBeGreaterThan(0);
    expect(fullResponse).toContain('Suresh Sharma');
    expect(proposal).toBeNull(); // Overworked intent does not propose mutations
  });

  it('streams matching proposals for dispatch queries', async () => {
    const stream = service.streamChatResponse('assign driver tomorrow', [], 'Dispatcher');
    let proposal: any = null;

    for await (const chunk of stream) {
      if (chunk.proposal) {
        proposal = chunk.proposal;
      }
    }

    expect(proposal).not.toBeNull();
    expect(proposal.type).toBe('dispatch');
    expect(proposal.payload.driverId).toBe('d-201');
    expect(proposal.payload.vehicleId).toBe('v-101');
  });
});
