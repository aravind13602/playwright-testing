const { expect } = require('@playwright/test');

const BASE_URL = process.env.SCOUTHAWK_BASE_URL || 'https://scouthawk-monorepo.pages.dev';
const EMAIL = process.env.SCOUTHAWK_EMAIL || 'aravind.bs001@gmail.com';
const PASSWORD = process.env.SCOUTHAWK_PASSWORD || 'Aravind@13602';
const ORG_NAME = process.env.SCOUTHAWK_ORG_NAME || 'Aravind ASE Org Admin';
const STACK_ID = process.env.SCOUTHAWK_STACK_ID || '69dfbf762300d981795c92ec';
const REQUIREMENT_ID = process.env.SCOUTHAWK_REQUIREMENT_ID || '69dfbf762300d981795c9350';

async function login(page) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });

  const emailInput = page.getByRole('textbox', { name: /email/i });
  if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await emailInput.fill(EMAIL);
    await page.getByRole('textbox', { name: /password/i }).fill(PASSWORD);
    await page.getByRole('button', { name: 'Login', exact: true }).click();
  }

  const orgButton = page.getByRole('button', { name: new RegExp(ORG_NAME, 'i') });
  const result = await Promise.race([
    orgButton.waitFor({ state: 'visible', timeout: 30000 }).then(() => 'org').catch(() => null),
    page.waitForURL(/\/(home|stacks|requirements)(\/|$)/, { timeout: 30000 }).then(() => 'app').catch(() => null),
  ]);

  if (result === 'org') {
    await orgButton.click();
    await page.waitForURL(/\/(home|stacks|requirements)(\/|$)/, { timeout: 30000 });
  }

  await expect(page).toHaveURL(/\/(home|stacks|requirements)(\/|$)/, { timeout: 30000 });
}

async function openRequirementDetails(page) {
  await login(page);
  await page.goto(`${BASE_URL}/stacks/${STACK_ID}/requirements/${REQUIREMENT_ID}`, {
    waitUntil: 'domcontentloaded',
  });
  await expect(page.getByText('Requirement Details', { exact: true })).toBeVisible({ timeout: 30000 });
}

module.exports = {
  BASE_URL,
  STACK_ID,
  REQUIREMENT_ID,
  login,
  openRequirementDetails,
};
