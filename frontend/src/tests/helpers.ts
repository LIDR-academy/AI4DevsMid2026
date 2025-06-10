import { Page, expect } from '@playwright/test';

export const BASE_URL = 'http://localhost:3000';
export const API_URL = 'http://localhost:3010';

/** Navigate and wait for the page to be network-idle */
export const goto = async (page: Page, path: string) => {
  await page.goto(`${BASE_URL}${path}`);
  await page.waitForLoadState('networkidle');
};

/** Assert no uncaught console errors exist */
export const expectNoConsoleErrors = async (page: Page) => {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  expect(errors).toHaveLength(0);
};
