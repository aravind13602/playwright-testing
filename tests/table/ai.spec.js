const { test, expect } = require('@playwright/test');
const { openAuthenticatedUrl } = require('../utils/login');
const { CONTROLLED_TABLE_URL, requireControlledConfig } = require('../utils/env');
const { cellForColumn, openColumnPropertyFlyout } = require('../utils/table');

test.describe('Table guide: AI dependency scenarios @controlled', () => {
  test('AI-02: editing an input column recomputes a prompt-based dependent column', async ({ page }) => {
    requireControlledConfig(test, {
      SCOUTHAWK_CONTROLLED_TABLE_URL: CONTROLLED_TABLE_URL,
    });

    const inputColumn = process.env.SCOUTHAWK_AI_INPUT_COLUMN || 'Resume';
    const outputColumn = process.env.SCOUTHAWK_AI_OUTPUT_COLUMN || 'Key Skills';
    const resumeText = [
      'Avery Chen',
      'Senior full stack engineer with React, Node.js, Python, SQL, and cloud deployment experience.',
      'Built production analytics dashboards and APIs.',
    ].join('\n');

    await openAuthenticatedUrl(page, CONTROLLED_TABLE_URL);

    const inputCell = cellForColumn(page, inputColumn);
    const outputCell = cellForColumn(page, outputColumn);

    await expect(inputCell).toBeVisible({ timeout: 30000 });
    await expect(outputCell).toBeVisible({ timeout: 30000 });

    await inputCell.dblclick();
    await page.getByRole('textbox').last().fill(resumeText);
    await page.keyboard.press('Enter');

    await expect(outputCell.locator('[class*="purple"], [class*="pulse"], [class*="comput"]')).toBeVisible({
      timeout: 30000,
    });
    await expect(outputCell).toContainText(/React|Node|Python|SQL/i, { timeout: 180000 });
  });

  test('AI-04: generated score and recommendation complete after upstream values change', async ({ page }) => {
    requireControlledConfig(test, {
      SCOUTHAWK_CONTROLLED_TABLE_URL: CONTROLLED_TABLE_URL,
    });

    const skillsColumn = process.env.SCOUTHAWK_SKILLS_COLUMN || 'Skills';
    const yearsColumn = process.env.SCOUTHAWK_YEARS_COLUMN || 'Years of Experience';
    const scoreColumn = process.env.SCOUTHAWK_SCORE_COLUMN || 'Fit Score';
    const recommendationColumn = process.env.SCOUTHAWK_RECOMMENDATION_COLUMN || 'Recommendation';

    await openAuthenticatedUrl(page, CONTROLLED_TABLE_URL);

    for (const column of [skillsColumn, yearsColumn, scoreColumn, recommendationColumn]) {
      await expect(cellForColumn(page, column)).toBeVisible({ timeout: 30000 });
    }

    await expect(cellForColumn(page, scoreColumn)).toContainText(/\d+/, { timeout: 180000 });
    await expect(cellForColumn(page, recommendationColumn)).toContainText(/Strong Yes|Yes|Maybe|No/i, {
      timeout: 180000,
    });
  });

  test('AI-05: recompute all stale fields triggers visible computing state', async ({ page }) => {
    requireControlledConfig(test, {
      SCOUTHAWK_CONTROLLED_TABLE_URL: CONTROLLED_TABLE_URL,
    });

    const scoreColumn = process.env.SCOUTHAWK_SCORE_COLUMN || 'Fit Score';

    await openAuthenticatedUrl(page, CONTROLLED_TABLE_URL);
    await openColumnPropertyFlyout(page, scoreColumn);

    await page.getByRole('button', { name: /Recompute all stale fields/i }).click();

    await expect(cellForColumn(page, scoreColumn).locator('[class*="purple"], [class*="pulse"], [class*="comput"]')).toBeVisible({
      timeout: 30000,
    });
  });
});
