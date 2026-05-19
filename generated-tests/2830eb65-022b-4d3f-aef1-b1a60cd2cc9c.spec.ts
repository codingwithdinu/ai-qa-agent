
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('2830eb65-022b-4d3f-aef1-b1a60cd2cc9c', async ({ page }) => {

  

  await page.goto('https://sophia.edu-it.in/');


  // Step 1: Navigate

  await page.goto('https://sophia.edu-it.in/');



  // AI Assertions

  await safeExpectVisible(page, 'text=Submit');
await safeExpectVisible(page, 'text=Reset');
await safeExpectVisible(page, 'input');
await safeExpectVisible(page, 'textarea');
await safeExpectVisible(page, 'button');
await safeExpectVisible(page, 'text=Next');
await safeExpectVisible(page, 'text=Previous');
await safeExpectVisible(page, 'select');
await safeExpectVisible(page, 'option');
await safeExpectVisible(page, 'checkbox');
await safeExpectVisible(page, 'radio');
await safeExpectVisible(page, 'text=Save');
await safeExpectVisible(page, 'text=Edit');
await safeExpectVisible(page, 'text=Delete');
await safeExpectVisible(page, 'text=Update');


});
