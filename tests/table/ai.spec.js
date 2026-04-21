const { test } = require('@playwright/test');

test.describe.skip('Table guide: AI dependency scenarios that require a disposable AI-enabled table', () => {
  test('AI-02: editing an input column recomputes a prompt-based dependent column', async () => {
    // Needs a Text Resume column and a Key Skills column with an @Resume prompt.
  });

  test('AI-04: resume auto-fill cascades through skills, score, and recommendation columns', async () => {
    // Needs OCR+LLM file parsing enabled and stable AI test fixtures.
  });

  test('AI-05: recompute all stale fields triggers visible purple computing state', async () => {
    // Needs a prompted Score column with stale rows and deterministic test data.
  });
});
