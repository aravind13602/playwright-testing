const { expect } = require('@playwright/test');

async function login(page) {
  await page.goto('https://scouthawk-monorepo.pages.dev/login');

  await page.getByRole('textbox', { name: 'Email' }).fill('aravind.bs001@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Aravind@13602');

  await page.getByRole('button', { name: 'Login', exact: true }).click();

  const orgButton = page.getByRole('button', { name: /Aravind ASE Org Admin/i });

  // ✅ Handle both flows (org selection OR direct login)
  const result = await Promise.race([
    orgButton.waitFor({ state: 'visible' }).then(() => 'org'),
    page.waitForURL(/home|stacks|requirements/).then(() => 'app')
  ]);

  if (result === 'org') {
    await orgButton.click();

    await page.waitForURL(/home|stacks|requirements/, { timeout: 20000 });
  }
}

module.exports = { login };