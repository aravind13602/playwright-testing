const { expect } = require('@playwright/test');

function cellForColumn(page, columnName) {
  return page.getByRole('gridcell', { name: new RegExp(`^Edit ${escapeRegExp(columnName)}$`) }).first();
}

function rowCheckbox(page, rowNumber = 1) {
  return page.locator('input[type="checkbox"]').nth(rowNumber);
}

function headerCheckbox(page) {
  return page.locator('input[type="checkbox"]').first();
}

function addColumnButton(page) {
  return page.locator('[aria-label="Add Column"], [title="Add Column"]').first();
}

async function clickCheckboxLikeUser(checkbox) {
  const clickableShell = checkbox.locator('xpath=ancestor::*[contains(@class, "cursor-pointer")][1]');

  if (await clickableShell.count()) {
    await clickableShell.click();
    return;
  }

  await checkbox.check({ force: true });
}

async function openColumnPropertyFlyout(page, columnName) {
  const headerText = page.getByText(columnName, { exact: true }).first();
  const propertyIcon = headerText.locator('xpath=preceding-sibling::*[1]');

  await expect(headerText).toBeVisible();
  await propertyIcon.click();
}

async function waitForRequirementTable(page) {
  await expect(page.getByText('Requirement Details', { exact: true })).toBeVisible({ timeout: 30000 });
  await expect(page.getByText('Job Title', { exact: true })).toBeVisible();
  await expect(cellForColumn(page, 'Job Title')).toBeVisible();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  addColumnButton,
  cellForColumn,
  clickCheckboxLikeUser,
  headerCheckbox,
  openColumnPropertyFlyout,
  rowCheckbox,
  waitForRequirementTable,
};
