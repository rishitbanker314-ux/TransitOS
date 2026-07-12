import { IntentClassifier } from '../services/IntentClassifier';

describe('Tool Routing', () => {
  const classifier = new IntentClassifier();

  it('routes schedule requests to dispatch proposals', () => {
    const intent = classifier.classify('schedule trip t-302 for tomorrow');
    expect(intent).toBe('dispatch_proposal');
  });

  it('routes cost/utilization queries to analytics', () => {
    const intent = classifier.classify('what is our operating cost?');
    expect(intent).toBe('query_analytics');
  });

  it('routes compliance alerts to query_compliance', () => {
    const intent = classifier.classify('list expired compliance docs');
    expect(intent).toBe('query_compliance');
  });
});
