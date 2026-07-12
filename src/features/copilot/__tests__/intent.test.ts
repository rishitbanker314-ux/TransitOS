import { IntentClassifier } from '../services/IntentClassifier';

describe('IntentClassifier', () => {
  let classifier: IntentClassifier;

  beforeEach(() => {
    classifier = new IntentClassifier();
  });

  it('classifies overworked driver prompts to query_drivers', () => {
    const intent = classifier.classify('Which driver is overworked?');
    expect(intent).toBe('query_drivers');
  });

  it('classifies delay queries to query_trips', () => {
    const intent = classifier.classify('Show me delayed trips.');
    expect(intent).toBe('query_trips');
  });

  it('classifies maintenance requests to query_maintenance', () => {
    const intent = classifier.classify('Which vehicles are under maintenance?');
    expect(intent).toBe('query_maintenance');
  });

  it('classifies dispatch commands to dispatch_proposal', () => {
    const intent = classifier.classify('Assign the best vehicle for tomorrow.');
    expect(intent).toBe('dispatch_proposal');
  });

  it('classifies insurance and PUC prompts to query_compliance', () => {
    const intent = classifier.classify('Check insurance expiring next week');
    expect(intent).toBe('query_compliance');
  });

  it('classifies reporting prompts to query_analytics', () => {
    const intent = classifier.classify('Generate weekly fleet summary');
    expect(intent).toBe('query_analytics');
  });
});
