
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('e93257de-f790-40de-9f71-2c3b633954ae', async ({ page }) => {

  

  await page.goto('https://sophia.edu-it.in/');


  // Step 1: Navigate

  await page.goto('https://sophia.edu-it.in/');



  // AI Assertions

  await safeExpectVisible(page, 'text=Submit');
await safeExpectVisible(page, 'input[type="text"]');
await safeExpectVisible(page, 'button[type="submit"]');
await safeExpectVisible(page, 'text=Success');


});
