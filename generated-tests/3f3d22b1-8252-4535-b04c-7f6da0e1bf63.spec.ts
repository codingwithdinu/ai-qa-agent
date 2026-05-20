
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('3f3d22b1-8252-4535-b04c-7f6da0e1bf63', async ({ page }) => {

  

  await page.goto('https://sophia.edu-it.in/');


  // Step 1: Navigate

  await page.goto('https://sophia.edu-it.in/');


  // Step 2: Click element

  await safeClick(
    page,
    'role=link[name="Contact"]'
  );


  await expect(page).toHaveURL(
    /contact/
  );



  // AI Assertions

  await safeExpectVisible(page, 'role=link[name="Contact"]');
await expect(page.locator('role=link[name="Contact"]').first()).toBeEnabled();


});
