
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('6c652a03-eda3-4e55-9938-5e7c0c592ecb', async ({ page }) => {

  

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
