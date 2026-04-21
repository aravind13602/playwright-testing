const { test } = require('@playwright/test');

test.describe.skip('Table guide: file upload scenarios that require controlled test data', () => {
  test('HP-07/AI-01: upload a resume PDF and verify OCR/JSON badges plus dependent cell updates', async () => {
    // Requires a non-empty sample resume and a disposable File column configured for OCR+LLM.
  });

  test('EC-15/AI-11: failed or non-parseable file upload returns the cell to a safe state', async () => {
    // Requires a disposable File column and a controlled way to simulate upload/parser failure.
  });
});
