
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('63e14e72-9fab-4301-ac45-1a31877d0813', async ({ page }) => {

  

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
