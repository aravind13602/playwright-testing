# ScoutHawk Table Playwright Testing Guide

This repo tests the ScoutHawk table component from the manual guide. The suite is split into two levels:

- Safe tests: read-only or non-destructive checks that can run anytime.
- Controlled tests: upload, AI, parsing, and edit scenarios that require a disposable ScoutHawk table because they change data.

## 1. Install And Verify

From this folder:

```powershell
npm ci
npx.cmd playwright install
npm run test:safe
```

Use `npx.cmd` on Windows if PowerShell blocks `npx`.

The safe suite currently covers 48 browser checks across Chromium, Firefox, and WebKit.

## 2. Safe Tests

Run:

```powershell
npm run test:safe
```

These tests cover:

- HP-01: table loads with headers, row cells, selection column, and view bar
- HP-02: row selection, clear selection, and header checkbox select-all
- HP-03: text-cell editor opens and Escape cancels without saving
- HP-11: add-column menu opens and shows common column types
- HP-16 / EC-16: column property flyout opens, unchanged Update Property is disabled, and pin/hide/delete controls are visible
- HP-20 / HP-21 / HP-22: Sort and Filter panel, Sort flyout, and Filter flyout open
- EC-01: non-editable selection and add-column cells do not open editors
- EC-02: rapid cell switching does not leave overlapping editors
- VC-01 / VC-07: basic alignment and empty-cell display

Safe tests should pass before you report any website issue.

## 3. Controlled AI And Upload Tests

Run controlled tests only against a disposable table. These tests may upload files, edit cells, and trigger AI recomputation.

Prepare the table with these columns:

- `Resume`: File column with OCR + LLM enabled
- `Candidate Name`: Text
- `Email`: Email
- `Skills` or `Key Skills`: text or multi-select
- `Years of Experience`: Number
- `Fit Score`: Score column with a prompt
- `Recommendation`: Single select with `Strong Yes`, `Yes`, `Maybe`, `No`

Use a real non-empty resume PDF. The current `files/resume.pdf` is empty, so replace it or point to another file.

PowerShell setup:

```powershell
$env:RUN_SCOUTHAWK_CONTROLLED="1"
$env:SCOUTHAWK_CONTROLLED_TABLE_URL="https://scouthawk-monorepo.pages.dev/stacks/<stack-id>/<table-path>"
$env:SCOUTHAWK_RESUME_FILE="C:\Users\Admin\Desktop\sample-resume.pdf"
$env:SCOUTHAWK_FILE_COLUMN="Resume"
$env:SCOUTHAWK_AI_INPUT_COLUMN="Resume"
$env:SCOUTHAWK_AI_OUTPUT_COLUMN="Key Skills"
$env:SCOUTHAWK_SKILLS_COLUMN="Skills"
$env:SCOUTHAWK_YEARS_COLUMN="Years of Experience"
$env:SCOUTHAWK_SCORE_COLUMN="Fit Score"
$env:SCOUTHAWK_RECOMMENDATION_COLUMN="Recommendation"
npm run test:controlled -- --project=chromium --headed
```

After the controlled Chromium run is clean, run all browsers:

```powershell
npm run test:controlled
```

## 4. How To Read Results

Run:

```powershell
npm run report
```

Result meanings:

- Passed: the tested website behavior worked.
- Failed: inspect the error context. If the failure happens after the page loads and the action is valid, it may be a website issue.
- Skipped: the test did not run. For controlled tests, this usually means the disposable table or environment variables are not ready.

## 5. When A Failure Is A Website Issue

Call it a website issue when:

- The test reaches the target table.
- The test performs the same user action described in the guide.
- The expected UI state does not happen.

Examples:

- Row selection does not show the batch action bar.
- Add Column does not open the type menu.
- File upload finishes but no OCR badge appears.
- AI-dependent cells never show the computing/purple state.
- Recompute button does not trigger any visible recomputation.

Do not call it a website issue when:

- Login credentials are wrong.
- The configured table URL is missing.
- The sample resume is empty.
- A test helper import is broken.
- A controlled test is skipped because setup was not provided.

## 6. Manual Coverage Still Needed

Some guide items are best verified manually unless the app provides stable test IDs and a disposable seeded environment:

- Dragging columns and rows
- Column/row resize minimum width and height
- Delete selected rows confirmation
- Duplicate saved view validation
- File upload network failure simulation
- Parent table references using `@@`
- Race-condition AI tests with many rapid edits

Add automation for these after a dedicated test workspace is available.
