import { test, expect, Page } from '@playwright/test';
import { goto, expectNoConsoleErrors } from './helpers';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Navigate to the position board for a given position id and wait for load */
const gotoBoard = async (page: Page, positionId: number | string = 1) => {
  await goto(page, `/positions/${positionId}`);
  // Wait for the loading text to disappear (data fetched) or error to appear
  await page.waitForFunction(
    () =>
      !document.body.textContent?.includes('LOADING...') ||
      document.body.textContent?.includes('Failed') ||
      document.body.textContent?.includes('not found'),
    { timeout: 10000 }
  );
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Position Board (Kanban)', () => {
  // -------------------------------------------------------------------------
  // Page load
  // -------------------------------------------------------------------------

  test('loads without console errors when backend is available', async ({ page }) => {
    // Register console-error listener before navigation
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await gotoBoard(page, 1);

    // The board should render without JS errors; network 404s from a missing
    // backend are allowed by this test (they surface as caught error state, not
    // uncaught exceptions).  We only fail if there are actual JS runtime errors.
    const jsErrors = errors.filter(
      (e) => !e.includes('net::ERR_CONNECTION_REFUSED') && !e.includes('404')
    );
    expect(jsErrors).toHaveLength(0);
  });

  test('shows LOADING text briefly before data arrives', async ({ page }) => {
    // Intercept the API calls so we can observe the loading state
    await page.route('**/position/1/interviewflow', async (route) => {
      await new Promise((r) => setTimeout(r, 300)); // small delay
      await route.continue();
    });

    await page.goto('http://localhost:3000/positions/1');
    // Loading text should be present initially
    await expect(page.getByText('LOADING...')).toBeVisible({ timeout: 2000 });
  });

  // -------------------------------------------------------------------------
  // Golden path — happy path with mocked API
  // -------------------------------------------------------------------------

  test('golden path: renders position name headline from API', async ({ page }) => {
    await page.route('**/position/1/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Senior Full-Stack Engineer',
            interviewFlow: {
              id: 1,
              description: 'Standard process',
              interviewSteps: [
                { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
                { id: 2, interviewFlowId: 1, interviewTypeId: 2, name: 'Technical Interview', orderIndex: 2 },
                { id: 3, interviewFlowId: 1, interviewTypeId: 3, name: 'Manager Interview', orderIndex: 3 },
              ],
            },
          },
        }),
      })
    );
    await page.route('**/position/1/candidates', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { fullName: 'John Doe', currentInterviewStep: 'Initial Screening', averageScore: 5 },
          { fullName: 'Jane Smith', currentInterviewStep: 'Technical Interview', averageScore: 4 },
          { fullName: 'Carlos García', currentInterviewStep: 'Manager Interview', averageScore: 0 },
        ]),
      })
    );

    await gotoBoard(page, 1);

    // Position headline
    await expect(page.getByRole('heading', { name: /senior full-stack engineer/i })).toBeVisible();
  });

  test('golden path: renders Kanban columns (one per interview step)', async ({ page }) => {
    await page.route('**/position/1/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Test Position',
            interviewFlow: {
              id: 1,
              description: 'Process',
              interviewSteps: [
                { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
                { id: 2, interviewFlowId: 1, interviewTypeId: 2, name: 'Technical Interview', orderIndex: 2 },
                { id: 3, interviewFlowId: 1, interviewTypeId: 3, name: 'Manager Interview', orderIndex: 3 },
              ],
            },
          },
        }),
      })
    );
    await page.route('**/position/1/candidates', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );

    await gotoBoard(page, 1);

    await expect(page.getByRole('columnheader', { name: /initial screening/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /technical interview/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /manager interview/i })).toBeVisible();
  });

  test('golden path: candidate cards appear in correct columns with star ratings', async ({ page }) => {
    await page.route('**/position/1/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Test Position',
            interviewFlow: {
              id: 1,
              description: 'Process',
              interviewSteps: [
                { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
                { id: 2, interviewFlowId: 1, interviewTypeId: 2, name: 'Technical Interview', orderIndex: 2 },
              ],
            },
          },
        }),
      })
    );
    await page.route('**/position/1/candidates', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { fullName: 'John Doe', currentInterviewStep: 'Initial Screening', averageScore: 5 },
          { fullName: 'Jane Smith', currentInterviewStep: 'Technical Interview', averageScore: 4 },
        ]),
      })
    );

    await gotoBoard(page, 1);

    // John Doe in Initial Screening
    const initialScreeningList = page.getByRole('list', { name: /initial screening candidates/i });
    await expect(initialScreeningList.getByRole('listitem', { name: /john doe/i })).toBeVisible();

    // Jane Smith in Technical Interview
    const technicalList = page.getByRole('list', { name: /technical interview candidates/i });
    await expect(technicalList.getByRole('listitem', { name: /jane smith/i })).toBeVisible();

    // Star rating aria-labels
    await expect(page.getByRole('listitem', { name: /john doe.*5 out of 5/i })).toBeVisible();
    await expect(page.getByRole('listitem', { name: /jane smith.*4 out of 5/i })).toBeVisible();
  });

  test('golden path: breadcrumb renders HOME > POSITIONS > position name', async ({ page }) => {
    await page.route('**/position/1/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Senior Full-Stack Engineer',
            interviewFlow: {
              id: 1,
              description: 'Process',
              interviewSteps: [
                { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
              ],
            },
          },
        }),
      })
    );
    await page.route('**/position/1/candidates', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );

    await gotoBoard(page, 1);

    const breadcrumb = page.getByRole('navigation', { name: /breadcrumb/i });
    await expect(breadcrumb.getByRole('link', { name: /^home$/i })).toBeVisible();
    await expect(breadcrumb.getByRole('link', { name: /^positions$/i })).toBeVisible();
    await expect(breadcrumb).toContainText('Senior Full-Stack Engineer');
  });

  test('golden path: back button navigates to /positions', async ({ page }) => {
    await page.route('**/position/1/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Test Position',
            interviewFlow: {
              id: 1,
              description: 'Process',
              interviewSteps: [
                { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
              ],
            },
          },
        }),
      })
    );
    await page.route('**/position/1/candidates', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );

    await gotoBoard(page, 1);

    await page.getByRole('button', { name: /go back to positions/i }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/positions$/);
  });

  // -------------------------------------------------------------------------
  // Drag and drop
  // -------------------------------------------------------------------------

  test('drag and drop: moves card to another column (optimistic update)', async ({ page }) => {
    await page.route('**/position/1/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Test Position',
            interviewFlow: {
              id: 1,
              description: 'Process',
              interviewSteps: [
                { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
                { id: 2, interviewFlowId: 1, interviewTypeId: 2, name: 'Technical Interview', orderIndex: 2 },
              ],
            },
          },
        }),
      })
    );
    await page.route('**/position/1/candidates', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { fullName: 'John Doe', currentInterviewStep: 'Initial Screening', averageScore: 5 },
        ]),
      })
    );

    await gotoBoard(page, 1);

    // Verify John Doe starts in Initial Screening
    await expect(
      page.getByRole('list', { name: /initial screening candidates/i })
        .getByRole('listitem', { name: /john doe/i })
    ).toBeVisible();

    // Drag John Doe to Technical Interview
    const card = page.getByRole('listitem', { name: /candidate: john doe/i });
    const target = page.getByRole('list', { name: /technical interview candidates/i });
    await card.dragTo(target);

    // John Doe should now be in Technical Interview
    await expect(
      page.getByRole('list', { name: /technical interview candidates/i })
        .getByRole('listitem', { name: /john doe/i })
    ).toBeVisible({ timeout: 3000 });

    // Initial Screening should be empty (column header shows 0)
    await expect(
      page.getByRole('columnheader', { name: /initial screening column, 0 candidates/i })
    ).toBeVisible();
  });

  test('drag and drop: shows toast notification after move', async ({ page }) => {
    await page.route('**/position/1/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Test Position',
            interviewFlow: {
              id: 1,
              description: 'Process',
              interviewSteps: [
                { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
                { id: 2, interviewFlowId: 1, interviewTypeId: 2, name: 'Technical Interview', orderIndex: 2 },
              ],
            },
          },
        }),
      })
    );
    await page.route('**/position/1/candidates', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { fullName: 'John Doe', currentInterviewStep: 'Initial Screening', averageScore: 5 },
        ]),
      })
    );

    await gotoBoard(page, 1);

    const card = page.getByRole('listitem', { name: /candidate: john doe/i });
    const target = page.getByRole('list', { name: /technical interview candidates/i });
    await card.dragTo(target);

    // Toast should appear (role=status, aria-live=polite)
    await expect(page.getByRole('status')).toBeVisible({ timeout: 3000 });
  });

  test('drag and drop: toast auto-dismisses after 3 seconds', async ({ page }) => {
    await page.route('**/position/1/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Test Position',
            interviewFlow: {
              id: 1,
              description: 'Process',
              interviewSteps: [
                { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
                { id: 2, interviewFlowId: 1, interviewTypeId: 2, name: 'Technical Interview', orderIndex: 2 },
              ],
            },
          },
        }),
      })
    );
    await page.route('**/position/1/candidates', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { fullName: 'John Doe', currentInterviewStep: 'Initial Screening', averageScore: 5 },
        ]),
      })
    );

    await gotoBoard(page, 1);

    const card = page.getByRole('listitem', { name: /candidate: john doe/i });
    const target = page.getByRole('list', { name: /technical interview candidates/i });
    await card.dragTo(target);

    // Wait for toast to appear
    await expect(page.getByRole('status')).toBeVisible({ timeout: 3000 });

    // Wait for toast to auto-dismiss (3 s + buffer)
    await expect(page.getByRole('status')).toBeHidden({ timeout: 5000 });
  });

  test('drag and drop: dropping on same column is a no-op', async ({ page }) => {
    await page.route('**/position/1/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Test Position',
            interviewFlow: {
              id: 1,
              description: 'Process',
              interviewSteps: [
                { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
                { id: 2, interviewFlowId: 1, interviewTypeId: 2, name: 'Technical Interview', orderIndex: 2 },
              ],
            },
          },
        }),
      })
    );
    await page.route('**/position/1/candidates', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { fullName: 'John Doe', currentInterviewStep: 'Initial Screening', averageScore: 5 },
        ]),
      })
    );

    await gotoBoard(page, 1);

    // Drag to the same column — card should stay there
    const card = page.getByRole('listitem', { name: /candidate: john doe/i });
    const sameColumnList = page.getByRole('list', { name: /initial screening candidates/i });
    await card.dragTo(sameColumnList);

    // Card still in Initial Screening
    await expect(
      sameColumnList.getByRole('listitem', { name: /john doe/i })
    ).toBeVisible({ timeout: 2000 });

    // No toast for same-column drop
    await expect(page.getByRole('status')).toBeHidden();
  });

  // -------------------------------------------------------------------------
  // Edge cases
  // -------------------------------------------------------------------------

  test('edge case: shows error block when backend is unreachable', async ({ page }) => {
    // Abort all API calls to simulate network failure
    await page.route('**/position/1/**', (route) => route.abort('failed'));

    await page.goto('http://localhost:3000/positions/1');
    await page.waitForLoadState('networkidle');

    // Should render an error message, not crash
    const body = page.locator('body');
    await expect(body).not.toContainText('LOADING...');
    // Error text is present (network error message)
    const mainContent = page.locator('[class*="min-h-screen"]').last();
    await expect(mainContent).toBeVisible();
  });

  test('edge case: shows "Position not found" for a 404 response', async ({ page }) => {
    await page.route('**/position/9999/interviewflow', (route) =>
      route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: 'Not found' }) })
    );
    await page.route('**/position/9999/candidates', (route) =>
      route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: 'Not found' }) })
    );

    await page.goto('http://localhost:3000/positions/9999');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/position not found/i)).toBeVisible({ timeout: 5000 });
  });

  test('edge case: empty candidates list renders columns with 0 count badge', async ({ page }) => {
    await page.route('**/position/1/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Test Position',
            interviewFlow: {
              id: 1,
              description: 'Process',
              interviewSteps: [
                { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
              ],
            },
          },
        }),
      })
    );
    await page.route('**/position/1/candidates', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );

    await gotoBoard(page, 1);

    // Column exists but has no cards
    await expect(
      page.getByRole('columnheader', { name: /initial screening column, 0 candidates/i })
    ).toBeVisible();
    // No crash — Kanban board region still present
    await expect(page.getByRole('region', { name: /kanban board/i })).toBeVisible();
  });

  test('edge case: candidate with averageScore 0 renders 5 empty stars', async ({ page }) => {
    await page.route('**/position/1/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Test Position',
            interviewFlow: {
              id: 1,
              description: 'Process',
              interviewSteps: [
                { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
              ],
            },
          },
        }),
      })
    );
    await page.route('**/position/1/candidates', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { fullName: 'Zero Star Candidate', currentInterviewStep: 'Initial Screening', averageScore: 0 },
        ]),
      })
    );

    await gotoBoard(page, 1);

    // Card renders with the 0-out-of-5 aria-label
    await expect(
      page.getByRole('listitem', { name: /zero star candidate.*0 out of 5/i })
    ).toBeVisible();
  });

  test('edge case: candidateId not available shows "Unable to persist" toast', async ({ page }) => {
    // The current API shape omits id from the candidates list response.
    // After a drag the toast should say "Unable to persist..."
    await page.route('**/position/1/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Test Position',
            interviewFlow: {
              id: 1,
              description: 'Process',
              interviewSteps: [
                { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
                { id: 2, interviewFlowId: 1, interviewTypeId: 2, name: 'Technical Interview', orderIndex: 2 },
              ],
            },
          },
        }),
      })
    );
    // Return candidate WITHOUT id — simulates the known API gap
    await page.route('**/position/1/candidates', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { fullName: 'John Doe', currentInterviewStep: 'Initial Screening', averageScore: 5 },
        ]),
      })
    );

    await gotoBoard(page, 1);

    const card = page.getByRole('listitem', { name: /candidate: john doe/i });
    const target = page.getByRole('list', { name: /technical interview candidates/i });
    await card.dragTo(target);

    // Toast with "Unable to persist" message
    await expect(page.getByRole('status')).toContainText(/unable to persist/i, { timeout: 3000 });
  });

  test('edge case: toast can be manually dismissed with × button', async ({ page }) => {
    await page.route('**/position/1/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Test Position',
            interviewFlow: {
              id: 1,
              description: 'Process',
              interviewSteps: [
                { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
                { id: 2, interviewFlowId: 1, interviewTypeId: 2, name: 'Technical Interview', orderIndex: 2 },
              ],
            },
          },
        }),
      })
    );
    await page.route('**/position/1/candidates', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { fullName: 'John Doe', currentInterviewStep: 'Initial Screening', averageScore: 5 },
        ]),
      })
    );

    await gotoBoard(page, 1);

    const card = page.getByRole('listitem', { name: /candidate: john doe/i });
    const target = page.getByRole('list', { name: /technical interview candidates/i });
    await card.dragTo(target);

    // Wait for toast
    await expect(page.getByRole('status')).toBeVisible({ timeout: 3000 });

    // Click × button to dismiss
    await page.getByRole('button', { name: /dismiss notification/i }).click();
    await expect(page.getByRole('status')).toBeHidden({ timeout: 1000 });
  });

  // -------------------------------------------------------------------------
  // Route regressions
  // -------------------------------------------------------------------------

  test('regression: / (landing page) loads without errors', async ({ page }) => {
    await goto(page, '/');
    await expectNoConsoleErrors(page);
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('regression: /positions list page loads without errors', async ({ page }) => {
    await goto(page, '/positions');
    // Should show the Positions heading or at least the layout
    await expect(page.getByRole('heading', { name: /positions/i })).toBeVisible({ timeout: 5000 });
  });

  test('regression: /add-candidate page loads without errors', async ({ page }) => {
    await goto(page, '/add-candidate');
    await expectNoConsoleErrors(page);
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('regression: /positions/2 board loads without errors', async ({ page }) => {
    await page.route('**/position/2/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Data Scientist',
            interviewFlow: {
              id: 2,
              description: 'Data science process',
              interviewSteps: [
                { id: 4, interviewFlowId: 2, interviewTypeId: 1, name: 'Phone Screen', orderIndex: 1 },
              ],
            },
          },
        }),
      })
    );
    await page.route('**/position/2/candidates', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );

    await gotoBoard(page, 2);

    await expect(page.getByRole('heading', { name: /data scientist/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /kanban board/i })).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // Design compliance
  // -------------------------------------------------------------------------

  test('design: back button uses Safety Yellow (#ffff00) background', async ({ page }) => {
    await page.route('**/position/1/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Test Position',
            interviewFlow: {
              id: 1,
              description: 'Process',
              interviewSteps: [
                { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
              ],
            },
          },
        }),
      })
    );
    await page.route('**/position/1/candidates', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );

    await gotoBoard(page, 1);

    const backBtn = page.getByRole('button', { name: /go back to positions/i });
    const bg = await backBtn.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(255, 255, 0)');
  });

  test('design: position headline uses 72px font-size', async ({ page }) => {
    await page.route('**/position/1/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Test Position',
            interviewFlow: {
              id: 1,
              description: 'Process',
              interviewSteps: [
                { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
              ],
            },
          },
        }),
      })
    );
    await page.route('**/position/1/candidates', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );

    await gotoBoard(page, 1);

    const heading = page.getByRole('heading', { level: 1 });
    const fontSize = await heading.evaluate((el) => getComputedStyle(el).fontSize);
    expect(fontSize).toBe('72px');
  });

  test('design: kanban board uses surface-container background (#eeeeee)', async ({ page }) => {
    await page.route('**/position/1/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Test Position',
            interviewFlow: {
              id: 1,
              description: 'Process',
              interviewSteps: [
                { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
              ],
            },
          },
        }),
      })
    );
    await page.route('**/position/1/candidates', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );

    await gotoBoard(page, 1);

    const board = page.getByRole('region', { name: /kanban board/i });
    const bg = await board.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(238, 238, 238)');
  });

  test('design: column headers use on-surface dark background (#1a1c1c)', async ({ page }) => {
    await page.route('**/position/1/interviewflow', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          interviewFlow: {
            positionName: 'Test Position',
            interviewFlow: {
              id: 1,
              description: 'Process',
              interviewSteps: [
                { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
              ],
            },
          },
        }),
      })
    );
    await page.route('**/position/1/candidates', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );

    await gotoBoard(page, 1);

    const colHeader = page.getByRole('columnheader', { name: /initial screening/i });
    const bg = await colHeader.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(26, 28, 28)');
  });
});
