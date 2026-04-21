const { test, expect } = require('@playwright/test');
const { openRequirementDetails } = require('../utils/login');
const { addColumnButton, cellForColumn, rowCheckbox, waitForRequirementTable } = require('../utils/table');

test.describe('Table guide: non-destructive cell editing', () => {
  test.beforeEach(async ({ page }) => {
    await openRequirementDetails(page);
    await waitForRequirementTable(page);
  });

  test('HP-03: double-clicking a text cell opens an editor and Escape cancels the edit', async ({ page }) => {
    const jobTitleCell = cellForColumn(page, 'Job Title');
    const originalText = (await jobTitleCell.innerText()).trim();

    await jobTitleCell.dblclick();

    const editor = page.getByRole('textbox').last();
    await expect(editor).toBeVisible();

    await editor.fill(`Playwright cancel check ${Date.now()}`);
    await page.keyboard.press('Escape');

    await expect(jobTitleCell).toContainText(originalText);
  });

  test('EC-01: double-clicking the selection cell does not open a cell editor', async ({ page }) => {
    await rowCheckbox(page, 1).dblclick({ force: true });

    await expect(page.getByRole('textbox')).toHaveCount(0);
  });

  test('EC-01: double-clicking the add-column cell does not open a cell editor', async ({ page }) => {
    await addColumnButton(page).dblclick();

    await expect(page.getByRole('textbox')).toHaveCount(0);
  });

  test('EC-02: rapidly switching cells does not leave overlapping editors', async ({ page }) => {
    await cellForColumn(page, 'Job Title').dblclick();
    await expect(page.getByRole('textbox').last()).toBeVisible();

    await cellForColumn(page, 'Location').dblclick();

    await expect.poll(async () => page.getByRole('textbox').count()).toBeLessThanOrEqual(1);
    await page.keyboard.press('Escape');
  });
});
