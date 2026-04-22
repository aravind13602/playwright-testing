const { test, expect } = require('@playwright/test');
const { openRequirementDetails } = require('../utils/login');
const { cellForColumn, waitForRequirementTable } = require('../utils/table');

test.describe('Table guide: loading and visual smoke checks', () => {
  test.beforeEach(async ({ page }) => {
    await openRequirementDetails(page);
    await waitForRequirementTable(page);
  });

  test('HP-01: table loads with headers, rows, selection column, and view bar', async ({ page }) => {
    await expect(page.getByRole('checkbox').first()).toBeVisible();

    for (const header of ['Job Title', 'Status', 'Priority', 'Hiring Manager', 'Location']) {
      await expect(page.getByText(header, { exact: true })).toBeVisible();
    }

    await expect(cellForColumn(page, 'Job Title')).toContainText(/.+/);
    await expect(cellForColumn(page, 'Status')).toContainText(/.+/);
    await expect(cellForColumn(page, 'Priority')).toContainText(/.+/);

    await expect(page.getByRole('button', { name: /Sort and Filter/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Main$/i })).toBeVisible();
  });

  test('VC-07: empty cells render the guide empty-state label', async ({ page }) => {
    await expect(cellForColumn(page, 'System Design Scope')).toContainText('Empty');
  });

  test('VC-01: first data column remains aligned with its header', async ({ page }) => {
    const headerBox = await page.getByText('Job Title', { exact: true }).boundingBox();
    const cellBox = await cellForColumn(page, 'Job Title').boundingBox();

    expect(headerBox).not.toBeNull();
    expect(cellBox).not.toBeNull();
    expect(Math.abs(headerBox.x - cellBox.x)).toBeLessThan(48);
  });

  test('VC-10: table and view bar use compact 12px-style text', async ({ page }) => {
    const headerSize = await page.getByText('Job Title', { exact: true }).evaluate((node) => {
      return Number.parseFloat(window.getComputedStyle(node).fontSize);
    });
    const viewBarSize = await page.getByRole('button', { name: /Sort and Filter/i }).evaluate((node) => {
      return Number.parseFloat(window.getComputedStyle(node).fontSize);
    });

    expect(headerSize).toBeLessThanOrEqual(13);
    expect(viewBarSize).toBeLessThanOrEqual(13);
  });
});
