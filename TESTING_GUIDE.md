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

If you already have a Playwright storage-state file, use it to avoid repeated login attempts:

```powershell
$env:SCOUTHAWK_STORAGE_STATE="auth.json"
npm run test:safe
```

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

Use a real non-empty resume PDF. This workspace currently has `files/resume.pdf` and additional sample PDFs under `files/`.

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

## 7. Full PDF Coverage Matrix

Statuses:

- `safe`: runs by default without changing real data.
- `partial-safe`: safe coverage exists, but the full guide workflow needs a disposable table because it saves, drags, creates, deletes, or persists state.
- `controlled`: automated or ready to automate only when `RUN_SCOUTHAWK_CONTROLLED=1` and a disposable table is configured.

| ID | Guide Test | Status |
| --- | --- | --- |
| HP-01 | View Data in the Table | safe |
| HP-02 | Select and Deselect Rows | safe |
| HP-03 | Edit a Text Cell | partial-safe |
| HP-04 | Edit a Single Select Cell | controlled |
| HP-05 | Edit a Multi Select Cell | controlled |
| HP-06 | Edit a Date Cell | controlled |
| HP-07 | Upload a File (Simple Storage Mode) | controlled |
| HP-08 | Upload a File (OCR+LLM Advanced Mode) | controlled |
| HP-09 | Score Cell Color Coding | controlled |
| HP-10 | Resize a Column | controlled |
| HP-11 | Resize a Row | controlled |
| HP-12 | Reorder a Column via Drag | controlled |
| HP-13 | Reorder a Row via Drag | controlled |
| HP-14 | Add a New Column | partial-safe |
| HP-15 | Configure Column Properties | partial-safe |
| HP-16 | Pin and Unpin a Column | partial-safe |
| HP-17 | Delete a Column | controlled |
| HP-18 | Bulk Delete Rows | controlled |
| HP-19 | Apply a Sort Rule | partial-safe |
| HP-20 | Apply a Filter Rule | partial-safe |
| HP-21 | Create and Switch Views | controlled |
| HP-22 | Modify and Save Changes to an Existing View | controlled |
| HP-23 | Select/Multiselect Option Management | controlled |
| HP-24 | AI Prompt Configuration | controlled |
| EC-01 | Double-Click on Non-Editable Cells | safe |
| EC-02 | Rapid Double-Clicking Different Cells | safe |
| EC-03 | Enter Extremely Long Text | controlled |
| EC-04 | Enter Invalid Data in a Number/Score Cell | controlled |
| EC-05 | Empty Table (Zero Rows) | controlled |
| EC-06 | Table with Zero Columns (Template Mode) | controlled |
| EC-07 | Resize Column to Minimum Width | controlled |
| EC-08 | Resize Row to Minimum Height | controlled |
| EC-09 | Create a Duplicate View | controlled |
| EC-10 | Save View with Empty Name | controlled |
| EC-11 | Sort by Multiple Columns | controlled |
| EC-12 | Filter "isEmpty" and "isNotEmpty" | controlled |
| EC-13 | Click Outside Flyout to Auto-Save | controlled |
| EC-14 | Scroll Table While Flyout Is Open | partial-safe |
| EC-15 | File Upload Failure | controlled |
| EC-16 | Column Property Flyout - No Changes | safe |
| EC-17 | Assign a Team Member (Assignments Column) | controlled |
| EC-18 | Email Column Behavior | controlled |
| EC-19 | Pinned Column + Drag Prevention | controlled |
| VC-01 | Column Alignment | safe |
| VC-02 | Horizontal Scroll | partial-safe |
| VC-03 | Vertical Scroll | partial-safe |
| VC-04 | Flyout Editor Positioning | controlled |
| VC-05 | Score Badge Colors | controlled |
| VC-06 | Select/MultiSelect Tag Colors | controlled |
| VC-07 | Empty Cell Display | safe |
| VC-08 | Batch Action Bar vs View Bar | safe |
| VC-09 | Column Property Flyout Scroll | controlled |
| VC-10 | Table Font Consistency | safe |
| AI-01 | Resume Upload -> Auto-Fill Row | controlled |
| AI-02 | Prompt-Based Skill Extraction Without File Parsing | controlled |
| AI-03 | AI Candidate Scoring | controlled |
| AI-04 | Multi-Step Dependency Chain | controlled |
| AI-05 | Recompute Stale Fields Button | controlled |
| AI-06 | File Parser Template - Create, Use, and Reuse | controlled |
| AI-07 | Stage Change Does Not Break Dependencies | controlled |
| AI-08 | Editing a Computed Cell Manually | controlled |
| AI-09 | Prompt with No Input Columns Referenced | controlled |
| AI-10 | Parent Column References (@@) | controlled |
| AI-11 | Upload a Non-Parseable File | controlled |
| AI-12 | Rapid Sequential Edits to an Input Column | controlled |
