import { Message } from '../types/copilot.types';

export class ConversationMemory {
  private messages: Message[] = [];
  private maxHistoryCount: number;

  constructor(maxHistoryCount = 20) {
    this.maxHistoryCount = maxHistoryCount;
  }

  public getMessages(): Message[] {
    return [...this.messages];
  }

  public addMessage(message: Message): void {
    this.messages.push(message);
    this.truncateIfNeeded();
  }

  public clear(): void {
    this.messages = [];
  }

  public serialize(): string {
    return JSON.stringify(this.messages);
  }

  public deserialize(serialized: string): void {
    try {
      const parsed = JSON.parse(serialized);
      if (Array.isArray(parsed)) {
        this.messages = parsed.filter(msg => msg && typeof msg.content === 'string');
        this.truncateIfNeeded();
      }
    } catch (e) {
      console.error('Failed to deserialize conversation memory', e);
    }
  }

  private truncateIfNeeded(): void {
    if (this.messages.length <= this.maxHistoryCount) {
      return;
    }

    // Keep system message if first, then grab the last maxHistoryCount - 1 messages
    const hasSystemMessage = this.messages[0]?.role === 'system';
    if (hasSystemMessage) {
      const systemMsg = this.messages[0];
      const remaining = this.messages.slice(-(this.maxHistoryCount - 1));
      this.messages = [systemMsg, ...remaining];
    } else {
      this.messages = this.messages.slice(-this.maxHistoryCount);
    }
  }
}
