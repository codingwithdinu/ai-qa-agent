
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('9a0e123c-173a-4707-9032-c94a11dba0a9', async ({ page }) => {

  

  await page.goto('https://sophia.edu-it.in/');


  // Step 1: Navigate

  await page.goto('https://sophia.edu-it.in/');



  // AI Assertions

  await safeExpectVisible(page, 'text=Submit');
await safeExpectVisible(page, 'text=Reset');
await safeExpectVisible(page, 'input');
await safeExpectVisible(page, 'textarea');
await safeExpectVisible(page, 'button');
await safeExpectVisible(page, 'select');
await safeExpectVisible(page, 'option');
await safeExpectVisible(page, 'checkbox');
await safeExpectVisible(page, 'radio');


});
