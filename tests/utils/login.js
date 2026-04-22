const { expect } = require('@playwright/test');

const BASE_URL = process.env.SCOUTHAWK_BASE_URL || 'https://scouthawk-monorepo.pages.dev';
const EMAIL = process.env.SCOUTHAWK_EMAIL || 'aravind.bs001@gmail.com';
const PASSWORD = process.env.SCOUTHAWK_PASSWORD || 'Aravind@13602';
const ORG_NAME = process.env.SCOUTHAWK_ORG_NAME || 'Aravind ASE Org Admin';
const STACK_ID = process.env.SCOUTHAWK_STACK_ID || '69dfbf762300d981795c92ec';
const REQUIREMENT_ID = process.env.SCOUTHAWK_REQUIREMENT_ID || '69dfbf762300d981795c9350';
const APP_URL_RE = /\/(home|stacks|requirements)(\/|$)/;

async function login(page) {
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });

    const emailInput = page.getByRole('textbox', { name: /email/i });
    if (await emailInput.isVisible({ timeout: 7000 }).catch(() => false)) {
      await emailInput.fill(EMAIL);
      await page.getByRole('textbox', { name: /password/i }).fill(PASSWORD);
      await page.getByRole('button', { name: 'Login', exact: true }).click();
    }

    if (await finishLoginFlow(page)) {
      return;
    }
  }

  await expect(page).toHaveURL(APP_URL_RE, { timeout: 30000 });
}

async function finishLoginFlow(page) {
  const orgButton = page.getByRole('button', { name: new RegExp(ORG_NAME, 'i') });
  const result = await Promise.race([
    orgButton.waitFor({ state: 'visible', timeout: 25000 }).then(() => 'org').catch(() => null),
    page.waitForURL(APP_URL_RE, { timeout: 25000 }).then(() => 'app').catch(() => null),
  ]);

  if (result === 'org') {
    await orgButton.click();
    await Promise.race([
      page.waitForURL(APP_URL_RE, { timeout: 25000 }).catch(() => null),
      page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => null),
    ]);
  }

  return isStableAppUrl(page);
}

async function openRequirementDetails(page) {
  const detailsUrl = `${BASE_URL}/stacks/${STACK_ID}/requirements/${REQUIREMENT_ID}`;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    await page.goto(detailsUrl, {
      waitUntil: 'domcontentloaded',
    });

    if (await page.getByText('Requirement Details', { exact: true }).isVisible({ timeout: 30000 }).catch(() => false)) {
      return;
    }

    if (!/\/login(\/|$)/.test(page.url())) {
      break;
    }

    await login(page);
  }

  await expect(page.getByText('Requirement Details', { exact: true })).toBeVisible({ timeout: 30000 });
}

async function openAuthenticatedUrl(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  if (/\/login(\/|$)/.test(page.url())) {
    await login(page);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
  }
}

module.exports = {
  BASE_URL,
  STACK_ID,
  REQUIREMENT_ID,
  login,
  openAuthenticatedUrl,
  openRequirementDetails,
};

async function isStableAppUrl(page) {
  if (!APP_URL_RE.test(page.url())) {
    return false;
  }

  await page.waitForTimeout(1000);
  return APP_URL_RE.test(page.url());
}
