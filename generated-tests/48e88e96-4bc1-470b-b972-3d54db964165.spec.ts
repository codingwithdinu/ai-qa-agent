
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('48e88e96-4bc1-470b-b972-3d54db964165', async ({ page }) => {

  

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


});
