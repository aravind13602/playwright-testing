const { test, expect } = require('@playwright/test');
const { openRequirementDetails } = require('../utils/login');
const { waitForRequirementTable } = require('../utils/table');

test.describe('Table guide: sort and filter panel', () => {
  test.beforeEach(async ({ page }) => {
    await openRequirementDetails(page);
    await waitForRequirementTable(page);
  });

  test('HP-20: Sort and Filter opens the panel with Sort and Filter controls', async ({ page }) => {
    await page.getByRole('button', { name: /Sort and Filter/i }).click();

    await expect(page.getByRole('button', { name: 'Sort', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Filter', exact: true })).toBeVisible();
  });

  test('HP-21: Sort flyout can be opened without creating a rule', async ({ page }) => {
    await page.getByRole('button', { name: /Sort and Filter/i }).click();
    await page.getByRole('button', { name: 'Sort', exact: true }).click();

    await expect(page.getByText(/add sort/i)).toBeVisible();
  });

  test('HP-22: Filter flyout can be opened without creating a rule', async ({ page }) => {
    await page.getByRole('button', { name: /Sort and Filter/i }).click();
    await page.getByRole('button', { name: 'Filter', exact: true }).click();

    await expect(page.getByText(/add filter/i)).toBeVisible();
  });
});
