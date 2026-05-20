
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('100e8cae-bb97-42a3-921b-e36595a44f1b', async ({ page }) => {

  

  await page.goto('https://sophia.edu-it.in/');


  // Step 1: Navigate

  await page.goto('https://sophia.edu-it.in/');



  // AI Assertions

  await safeExpectVisible(page, 'h1');


});
