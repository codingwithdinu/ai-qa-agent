
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('9ce4372a-1035-49e5-bc3b-ad322424a15a', async ({ page }) => {

  

  await page.goto('https://sophia.edu-it.in/');


  // Step 1: Navigate

  await page.goto('https://sophia.edu-it.in/');


  // Step 2: Click element

  await safeClick(
    page,
    'role=link[name="Get Started"]'
  );



  // AI Assertions

  await safeExpectVisible(page, 'role=link[name="Get Started"]');
await expect(page.locator('role=link[name="Get Started"]').first()).toBeEnabled();


});
