
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('3386ace0-0a3b-44f1-a0a4-e9b7badcc2da', async ({ page }) => {

  

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
