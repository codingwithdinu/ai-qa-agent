
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('9033818f-367c-49e0-9a7e-8d90f13782af', async ({ page }) => {

  

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


  // Step 7: Click element

  await safeClick(
    page,
    '#contact-name'
  );


  // Step 8: Click element

  await safeClick(
    page,
    '#contact-email'
  );


  // Step 9: Click element

  await safeClick(
    page,
    '#contact-phone'
  );


  // Step 10: Click element

  await safeClick(
    page,
    '#contact-message'
  );


  // Step 11: Click element

  await safeClick(
    page,
    '#contact-interest'
  );


  // Step 12: Click element

  await safeClick(
    page,
    '#contact-interest'
  );


});
