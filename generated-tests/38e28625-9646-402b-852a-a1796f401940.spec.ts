
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('Recording-38e28625-9646-402b-852a-a1796f401940', async ({ page }) => {

  await page.goto('http://localhost:5000/test.html');


  // Step 1: Click element

  await safeClick(
    page,
    'input'
  );


  // Step 2: Click element

  await safeClick(
    page,
    '#loginBtn'
  );



  // AI Assertions

  await safeExpectVisible(page, 'input');
await safeClick(page, 'input');
await safeExpectVisible(page, '#loginBtn');
await safeClick(page, '#loginBtn');


});
