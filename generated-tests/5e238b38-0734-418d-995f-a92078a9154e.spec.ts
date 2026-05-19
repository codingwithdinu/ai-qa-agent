
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('5e238b38-0734-418d-995f-a92078a9154e', async ({ page }) => {

  

  await page.goto('https://sophia.edu-it.in/');


  // Step 1: Navigate

  await page.goto('https://sophia.edu-it.in/');


  // Step 2: Click element

  await safeClick(
    page,
    'role=link[name="About"]'
  );


  await expect(page).toHaveURL(
    /about/
  );


  // Step 3: Click element

  await safeClick(
    page,
    'role=link[name="Services"]'
  );


  await expect(page).toHaveURL(
    /services/
  );



  // AI Assertions

  await safeExpectVisible(page, 'role=link[name="About"]');
await safeExpectVisible(page, 'role=link[name="Services"]');


});
