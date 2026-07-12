import { IntentClassifier } from '../services/IntentClassifier';
import { PromptBuilder } from '../services/PromptBuilder';
import { ConversationMemory } from '../services/ConversationMemory';
import { GeminiService } from '../services/GeminiService';
import { ContextEngine } from '../services/ContextEngine';

let passCount = 0;
let failCount = 0;

function test(name: string, fn: () => void | Promise<void>) {
  console.log(`\nRunning test suite: ${name}`);
  try {
    const res = fn();
    if (res instanceof Promise) {
      // Handled in async loop
    } else {
      console.log(`  ✓ Passed`);
      passCount++;
    }
  } catch (error) {
    console.error(`  ✗ Failed:`, error);
    failCount++;
  }
}

async function runAll() {
  // --- 1. Intent Classifier Tests ---
  test('Intent Classifier', () => {
    const classifier = new IntentClassifier();
    
    // Test 1.1
    const i1 = classifier.classify('Which driver is overworked?');
    if (i1 !== 'query_drivers') throw new Error(`Expected query_drivers, got ${i1}`);
    
    // Test 1.2
    const i2 = classifier.classify('Show me delayed trips');
    if (i2 !== 'query_trips') throw new Error(`Expected query_trips, got ${i2}`);
    
    // Test 1.3
    const i3 = classifier.classify('Which vehicles are under maintenance?');
    if (i3 !== 'query_maintenance') throw new Error(`Expected query_maintenance, got ${i3}`);

    // Test 1.4
    const i4 = classifier.classify('Assign the best vehicle for tomorrow.');
    if (i4 !== 'dispatch_proposal') throw new Error(`Expected dispatch_proposal, got ${i4}`);

    // Test 1.5
    const i5 = classifier.classify('Check insurance expiring next week');
    if (i5 !== 'query_compliance') throw new Error(`Expected query_compliance, got ${i5}`);
  });

  // --- 2. Permission Tests ---
  test('Permission Guardrails', () => {
    const mockContext = '{"vehicles": []}';
    const dispatcherPrompt = PromptBuilder.buildSystemInstruction(mockContext, 'dispatch_proposal');
    if (!dispatcherPrompt.includes('dispatcher')) throw new Error('Expected dispatcher role to be listed');

    const maintenancePrompt = PromptBuilder.buildSystemInstruction(mockContext, 'maintenance_proposal');
    if (!maintenancePrompt.includes('does not have permission')) throw new Error('Expected warning for unauthorized roles');
  });

  // --- 3. Tool Routing Tests ---
  test('Tool Routing', () => {
    const classifier = new IntentClassifier();
    const route1 = classifier.classify('schedule trip t-302 tomorrow');
    if (route1 !== 'dispatch_proposal') throw new Error(`Expected dispatch_proposal, got ${route1}`);

    const route2 = classifier.classify('what is our operating cost?');
    if (route2 !== 'query_analytics') throw new Error(`Expected query_analytics, got ${route2}`);
  });

  // --- 4. Conversation Truncation Tests ---
  test('Conversation Memory Truncation', () => {
    const memory = new ConversationMemory(3);
    const m1 = { id: '1', role: 'user' as const, content: 'hello', timestamp: '2026' };
    const m2 = { id: '2', role: 'assistant' as const, content: 'hi', timestamp: '2026' };
    const m3 = { id: '3', role: 'user' as const, content: 'test', timestamp: '2026' };
    const m4 = { id: '4', role: 'assistant' as const, content: 'result', timestamp: '2026' };

    memory.addMessage(m1);
    memory.addMessage(m2);
    memory.addMessage(m3);
    if (memory.getMessages().length !== 3) throw new Error('Memory length should be 3');

    memory.addMessage(m4);
    const msgs = memory.getMessages();
    if (msgs.length !== 3) throw new Error('Memory should remain truncated at 3');
    if (msgs[0].id !== '2') throw new Error('First message should have been truncated');
  });

  // --- 5. Streaming Tests ---
  console.log(`\nRunning test suite: Streaming & Offline Simulation`);
  try {
    const service = new GeminiService();
    const stream = service.streamChatResponse('Which driver is overworked?', [], 'Dispatcher');
    const chunks: string[] = [];
    
    for await (const chunk of stream) {
      if (chunk.text) chunks.push(chunk.text);
    }
    
    const text = chunks.join('');
    if (!text.includes('Suresh Sharma')) throw new Error('Stream response did not contain Suresh Sharma');
    console.log(`  ✓ Passed`);
    passCount++;
  } catch (error) {
    console.error(`  ✗ Failed:`, error);
    failCount++;
  }

  // --- 6. Context Engine Tests ---
  console.log(`\nRunning test suite: Context Engine Generation`);
  try {
    const engine = new ContextEngine();
    const ctxString = await engine.getSystemContext({
      userRole: 'Dispatcher',
      activeView: 'CommandCenter',
      activeVehicleId: 'v-101'
    });
    
    const parsed = JSON.parse(ctxString);
    if (parsed.userRole !== 'Dispatcher') throw new Error('Role mismatch in generated context');
    if (!Array.isArray(parsed.vehicles)) throw new Error('Vehicles list is not an array');
    console.log(`  ✓ Passed`);
    passCount++;
  } catch (error) {
    console.error(`  ✗ Failed:`, error);
    failCount++;
  }

  // --- 7. Security Guardrail Tests ---
  test('Security Guardrails', () => {
    const mockContext = '{"vehicles": [], "drivers": []}';
    const sysInstruction = PromptBuilder.buildSystemInstruction(mockContext, 'dispatch_proposal');
    if (!sysInstruction.includes('You cannot directly modify the database')) {
      throw new Error('Missing database write guardrail instruction');
    }
  });

  // --- Final Summary ---
  console.log(`\n========================================`);
  console.log(`TEST EXECUTION BRIEFING:`);
  console.log(`  TOTAL SUITES: ${passCount + failCount}`);
  console.log(`  PASSED:       ${passCount}`);
  console.log(`  FAILED:       ${failCount}`);
  console.log(`========================================`);

  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAll();
