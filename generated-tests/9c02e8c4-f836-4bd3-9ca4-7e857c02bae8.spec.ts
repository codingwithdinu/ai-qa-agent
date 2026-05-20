
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('9c02e8c4-f836-4bd3-9ca4-7e857c02bae8', async ({ page }) => {

  

  await page.goto('https://sophia.edu-it.in/');


  // Step 1: Navigate

  await page.goto('https://sophia.edu-it.in/');


  // Step 2: Click element

  await safeClick(
    page,
    'role=link[name="Home"]'
  );


  // Step 3: Click element

  await safeClick(
    page,
    'role=link[name="About"]'
  );


  await expect(page).toHaveURL(
    /about/
  );


  // Step 4: Click element

  await safeClick(
    page,
    'role=link[name="Services"]'
  );


  await expect(page).toHaveURL(
    /services/
  );


  // Step 5: Click element

  await safeClick(
    page,
    'role=link[name="Internship"]'
  );


  await expect(page).toHaveURL(
    /internship/
  );


  // Step 6: Click element

  await safeClick(
    page,
    'role=link[name="Contact"]'
  );


  await expect(page).toHaveURL(
    /contact/
  );



  // AI Assertions

  await safeExpectVisible(page, 'role=link[name="Home"]');
await safeExpectVisible(page, 'role=link[name="About"]');
await safeExpectVisible(page, 'role=link[name="Services"]');
await safeExpectVisible(page, 'role=link[name="Internship"]');
await safeExpectVisible(page, 'role=link[name="Contact"]');


});
