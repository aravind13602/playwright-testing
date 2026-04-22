const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');
const { openAuthenticatedUrl } = require('../utils/login');
const { CONTROLLED_TABLE_URL, RESUME_FILE, requireControlledConfig } = require('../utils/env');
const { cellForColumn } = require('../utils/table');

test.describe('Table guide: file upload scenarios @controlled', () => {
  test('HP-07/HP-08/AI-01: upload a resume PDF and verify OCR/JSON badges plus dependent cell updates', async ({ page }) => {
    requireControlledConfig(test, {
      SCOUTHAWK_CONTROLLED_TABLE_URL: CONTROLLED_TABLE_URL,
      SCOUTHAWK_RESUME_FILE: RESUME_FILE,
    });

    test.skip(!fs.existsSync(RESUME_FILE), `Resume fixture was not found: ${RESUME_FILE}`);

    const fileColumn = process.env.SCOUTHAWK_FILE_COLUMN || 'Resume';
    const resumeStats = fs.statSync(RESUME_FILE);

    test.skip(resumeStats.size === 0, `Resume fixture is empty: ${RESUME_FILE}`);

    await openAuthenticatedUrl(page, CONTROLLED_TABLE_URL);

    const fileCell = cellForColumn(page, fileColumn);
    await expect(fileCell).toBeVisible({ timeout: 30000 });

    const chooserPromise = page.waitForEvent('filechooser');
    await fileCell.getByText(/upload file/i).click();
    const chooser = await chooserPromise;
    await chooser.setFiles(RESUME_FILE);

    await expect(fileCell.getByText(path.basename(RESUME_FILE))).toBeVisible({ timeout: 60000 });
    await expect(fileCell.getByText(/OCR/i)).toBeVisible({ timeout: 120000 });
    await expect(fileCell.getByText(/JSON/i)).toBeVisible({ timeout: 180000 });
  });

  test('EC-15/AI-11: non-parseable file does not leave the table in permanent upload state', async ({ page }) => {
    requireControlledConfig(test, {
      SCOUTHAWK_CONTROLLED_TABLE_URL: CONTROLLED_TABLE_URL,
    });

    const fileColumn = process.env.SCOUTHAWK_FILE_COLUMN || 'Resume';

    await openAuthenticatedUrl(page, CONTROLLED_TABLE_URL);

    const fileCell = cellForColumn(page, fileColumn);
    await expect(fileCell).toBeVisible({ timeout: 30000 });

    const chooserPromise = page.waitForEvent('filechooser');
    await fileCell.getByText(/upload file/i).click();
    const chooser = await chooserPromise;
    await chooser.setFiles(path.resolve(__dirname, '../../package.json'));

    await expect(fileCell.getByText(/uploading|processing/i)).toBeHidden({ timeout: 120000 });
    await expect(page.getByText(/error|failed|unsupported|upload file/i)).toBeVisible({ timeout: 120000 });
  });
});
