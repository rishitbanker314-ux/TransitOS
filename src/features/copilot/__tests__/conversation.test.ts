import { ConversationMemory } from '../services/ConversationMemory';
import { Message } from '../types/copilot.types';

describe('ConversationMemory Truncation', () => {
  it('truncates messages older than max size', () => {
    const memory = new ConversationMemory(3);
    
    const m1: Message = { id: '1', role: 'user', content: 'hello', timestamp: '2026' };
    const m2: Message = { id: '2', role: 'assistant', content: 'hi', timestamp: '2026' };
    const m3: Message = { id: '3', role: 'user', content: 'test', timestamp: '2026' };
    const m4: Message = { id: '4', role: 'assistant', content: 'result', timestamp: '2026' };

    memory.addMessage(m1);
    memory.addMessage(m2);
    memory.addMessage(m3);
    expect(memory.getMessages().length).toBe(3);

    memory.addMessage(m4);
    const msgs = memory.getMessages();
    expect(msgs.length).toBe(3);
    expect(msgs[0].id).toBe('2'); // First message truncated
    expect(msgs[2].id).toBe('4');
  });

  it('keeps the system instruction message at position 0 when truncating', () => {
    const memory = new ConversationMemory(3);
    
    const sys: Message = { id: 'sys', role: 'system', content: 'sys-rules', timestamp: '2026' };
    const m1: Message = { id: '1', role: 'user', content: 'hello', timestamp: '2026' };
    const m2: Message = { id: '2', role: 'assistant', content: 'hi', timestamp: '2026' };
    const m3: Message = { id: '3', role: 'user', content: 'test', timestamp: '2026' };

    memory.addMessage(sys);
    memory.addMessage(m1);
    memory.addMessage(m2);
    
    expect(memory.getMessages().length).toBe(3);
    
    // Add one more
    memory.addMessage(m3);
    
    const msgs = memory.getMessages();
    expect(msgs.length).toBe(3);
    expect(msgs[0].id).toBe('sys'); // System instruction preserved at top
    expect(msgs[1].id).toBe('2');   // m1 truncated
    expect(msgs[2].id).toBe('3');   // m3 appended
  });
});
