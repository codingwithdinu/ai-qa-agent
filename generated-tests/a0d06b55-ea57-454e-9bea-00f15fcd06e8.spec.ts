
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('a0d06b55-ea57-454e-9bea-00f15fcd06e8', async ({ page }) => {

  

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
    'role=link[name="Contact"]'
  );


  await expect(page).toHaveURL(
    /contact/
  );


  // Step 6: Click element

  await safeClick(
    page,
    'role=link[name="Get Started"]'
  );



  // AI Assertions

  await safeExpectVisible(page, 'role=link[name="Home"]');
await safeExpectVisible(page, 'role=link[name="About"]');
await safeExpectVisible(page, 'role=link[name="Services"]');
await safeExpectVisible(page, 'role=link[name="Contact"]');
await safeExpectVisible(page, 'role=link[name="Get Started"]');


});
