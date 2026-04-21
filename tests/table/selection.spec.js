const { test, expect } = require('@playwright/test');
const { openRequirementDetails } = require('../utils/login');
const { clickCheckboxLikeUser, headerCheckbox, rowCheckbox, waitForRequirementTable } = require('../utils/table');

test.describe('Table guide: row selection', () => {
  test.beforeEach(async ({ page }) => {
    await openRequirementDetails(page);
    await waitForRequirementTable(page);
  });

  test('HP-02: selecting a row checks it and replaces the view bar with the batch bar', async ({ page }) => {
    const firstRow = rowCheckbox(page, 1);

    await expect(firstRow).toBeVisible();
    await clickCheckboxLikeUser(firstRow);

    await expect(firstRow).toBeChecked();
    await expect(page.getByText(/1\s+row(?:s)?\s+selected/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Sort and Filter/i })).toBeHidden();
  });

  test('HP-02: selecting and clearing a row restores the view bar', async ({ page }) => {
    const firstRow = rowCheckbox(page, 1);

    await clickCheckboxLikeUser(firstRow);
    await expect(firstRow).toBeChecked();

    const clearSelection = page.getByText(/clear selection/i);
    if (await clearSelection.isVisible().catch(() => false)) {
      await clearSelection.click();
    } else {
      await clickCheckboxLikeUser(firstRow);
    }

    await expect(firstRow).not.toBeChecked();
    await expect(page.getByRole('button', { name: /Sort and Filter/i })).toBeVisible();
  });

  test('HP-02: header checkbox selects all visible rows and clear selection resets the bar', async ({ page }) => {
    const selectAll = headerCheckbox(page);
    const firstRow = rowCheckbox(page, 1);

    await clickCheckboxLikeUser(selectAll);

    await expect(selectAll).toBeChecked();
    await expect(firstRow).toBeChecked();
    await expect(page.getByText(/row(?:s)?\s+selected/i)).toBeVisible();

    await page.getByRole('button', { name: /clear selection/i }).click();

    await expect(selectAll).not.toBeChecked();
    await expect(firstRow).not.toBeChecked();
    await expect(page.getByRole('button', { name: /Sort and Filter/i })).toBeVisible();
  });
});
