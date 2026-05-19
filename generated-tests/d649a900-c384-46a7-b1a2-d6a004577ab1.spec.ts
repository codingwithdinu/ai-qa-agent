
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('d649a900-c384-46a7-b1a2-d6a004577ab1', async ({ page }) => {

  

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
