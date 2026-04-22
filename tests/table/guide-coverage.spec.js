const { test, expect } = require('@playwright/test');
const { guideTests } = require('../utils/guideMatrix');

const expectedIds = [
  'HP-01', 'HP-02', 'HP-03', 'HP-04', 'HP-05', 'HP-06', 'HP-07', 'HP-08',
  'HP-09', 'HP-10', 'HP-11', 'HP-12', 'HP-13', 'HP-14', 'HP-15', 'HP-16',
  'HP-17', 'HP-18', 'HP-19', 'HP-20', 'HP-21', 'HP-22', 'HP-23', 'HP-24',
  'EC-01', 'EC-02', 'EC-03', 'EC-04', 'EC-05', 'EC-06', 'EC-07', 'EC-08',
  'EC-09', 'EC-10', 'EC-11', 'EC-12', 'EC-13', 'EC-14', 'EC-15', 'EC-16',
  'EC-17', 'EC-18', 'EC-19',
  'VC-01', 'VC-02', 'VC-03', 'VC-04', 'VC-05', 'VC-06', 'VC-07', 'VC-08',
  'VC-09', 'VC-10',
  'AI-01', 'AI-02', 'AI-03', 'AI-04', 'AI-05', 'AI-06', 'AI-07', 'AI-08',
  'AI-09', 'AI-10', 'AI-11', 'AI-12',
];

test.describe('PDF guide coverage inventory', () => {
  test('all 65 PDF guide test IDs are accounted for in the automation matrix', async () => {
    const actualIds = guideTests.map((entry) => entry.id).sort();

    expect(actualIds).toEqual([...expectedIds].sort());
  });

  test('each guide test has an execution status', async () => {
    const allowedStatuses = new Set(['safe', 'partial-safe', 'controlled', 'manual']);

    for (const entry of guideTests) {
      expect(entry.title, `${entry.id} needs a title`).toBeTruthy();
      expect(allowedStatuses.has(entry.status), `${entry.id} has invalid status`).toBeTruthy();
    }
  });
});
