const { test, expect } = require('@playwright/test');
const { openRequirementDetails } = require('../utils/login');
const {
  addColumnButton,
  openColumnPropertyFlyout,
  waitForRequirementTable,
} = require('../utils/table');

test.describe('Table guide: column controls', () => {
  test.beforeEach(async ({ page }) => {
    await openRequirementDetails(page);
    await waitForRequirementTable(page);
  });

  test('HP-11: add-column button opens the column type menu without creating a column', async ({ page }) => {
    await addColumnButton(page).click();

    await expect(page.getByText('Text', { exact: true })).toBeVisible();
    await expect(page.getByText('Number', { exact: true })).toBeVisible();
    await expect(page.getByText('Date', { exact: true })).toBeVisible();
  });

  test('EC-16: column property flyout opens with Update Property disabled when unchanged', async ({ page }) => {
    await openColumnPropertyFlyout(page, 'Job Title');

    await expect(page.getByText(/Property Name/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Update Property/i })).toBeDisabled();
  });

  test('HP-16: column property flyout exposes pin, hide, and delete actions', async ({ page }) => {
    await openColumnPropertyFlyout(page, 'Job Title');

    await expect(page.getByText(/Hide in Public Form/i)).toBeVisible();
    await expect(page.getByText(/Pin|Unpin/i)).toBeVisible();
    await expect(page.getByText(/Hide from view/i)).toBeVisible();
    await expect(page.getByText(/Delete Property/i)).toBeVisible();
  });
});
