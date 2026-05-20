
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('71b29a1f-d3a3-450e-bf39-de2010c69869', async ({ page }) => {

  

  await page.goto('https://sophia.edu-it.in/');


  // Step 1: Navigate

  await page.goto('https://sophia.edu-it.in/');



  // AI Assertions

  await safeExpectVisible(page, 'h1');


});
