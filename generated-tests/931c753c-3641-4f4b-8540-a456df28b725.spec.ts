
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('931c753c-3641-4f4b-8540-a456df28b725', async ({ page }) => {

  

  await page.goto('https://sophia.edu-it.in/');


  // Step 1: Navigate

  await page.goto('https://sophia.edu-it.in/');


  // Step 2: Click element

  await safeClick(
    page,
    'role=link[name="Get Started"]'
  );


  // Step 3: Click element

  await safeClick(
    page,
    '#contact-name'
  );


  // Step 4: Fill input

  await page.fill(
    '#contact-name',
    'd'
  );


  // Step 5: Fill input

  await page.fill(
    '#contact-name',
    'di'
  );


  // Step 6: Fill input

  await page.fill(
    '#contact-name',
    'din'
  );


  // Step 7: Fill input

  await page.fill(
    '#contact-name',
    'dine'
  );


  // Step 8: Fill input

  await page.fill(
    '#contact-name',
    'dinee'
  );


  // Step 9: Fill input

  await page.fill(
    '#contact-name',
    'dinees'
  );


  // Step 10: Fill input

  await page.fill(
    '#contact-name',
    'dineesh'
  );


  // Step 11: Click element

  await safeClick(
    page,
    '#contact-email'
  );


  // Step 12: Fill input

  await page.fill(
    '#contact-email',
    'f'
  );


  // Step 13: Fill input

  await page.fill(
    '#contact-email',
    'fa'
  );


  // Step 14: Fill input

  await page.fill(
    '#contact-email',
    'fas'
  );


  // Step 15: Fill input

  await page.fill(
    '#contact-email',
    'fasd'
  );


  // Step 16: Fill input

  await page.fill(
    '#contact-email',
    'fasdf'
  );


  // Step 17: Fill input

  await page.fill(
    '#contact-email',
    'fasdff'
  );


  // Step 18: Fill input

  await page.fill(
    '#contact-email',
    'fasdffd'
  );


  // Step 19: Fill input

  await page.fill(
    '#contact-email',
    'fasdffds'
  );


  // Step 20: Fill input

  await page.fill(
    '#contact-email',
    'fasdffdsf'
  );


  // Step 21: Click element

  await safeClick(
    page,
    '#contact-phone'
  );


  // Step 22: Fill input

  await page.fill(
    '#contact-phone',
    'f'
  );


  // Step 23: Fill input

  await page.fill(
    '#contact-phone',
    'ff'
  );


  // Step 24: Fill input

  await page.fill(
    '#contact-phone',
    'fff'
  );


  // Step 25: Fill input

  await page.fill(
    '#contact-phone',
    'fffd'
  );


  // Step 26: Fill input

  await page.fill(
    '#contact-phone',
    'fffdf'
  );


  // Step 27: Click element

  await safeClick(
    page,
    '#contact-interest'
  );


  // Step 28: Click element

  await safeClick(
    page,
    '#contact-interest'
  );


  // Step 29: Click element

  await safeClick(
    page,
    '#contact-message'
  );


  // Step 30: Fill input

  await page.fill(
    '#contact-message',
    'd'
  );


  // Step 31: Fill input

  await page.fill(
    '#contact-message',
    'daf'
  );


  // Step 32: Fill input

  await page.fill(
    '#contact-message',
    'dafsa'
  );


  // Step 33: Fill input

  await page.fill(
    '#contact-message',
    'dafsad'
  );


  // Step 34: Fill input

  await page.fill(
    '#contact-message',
    'dafsadf'
  );


  // Step 35: Fill input

  await page.fill(
    '#contact-message',
    'dafsadfd'
  );


  // Step 36: Fill input

  await page.fill(
    '#contact-message',
    'dafsadfds'
  );


  // Step 37: Fill input

  await page.fill(
    '#contact-message',
    'dafsadfdsf'
  );


  // Step 38: Click element

  await safeClick(
    page,
    'role=button[name="Send Message"]'
  );



  // AI Assertions

  await expect(page.locator('role=button[name="Send Message"]').first()).toBeEnabled();
await safeExpectVisible(page, 'role=link[name="Get Started"]');
await safeExpectVisible(page, '#contact-name');
await safeExpectVisible(page, '#contact-email');
await safeExpectVisible(page, '#contact-phone');
await safeExpectVisible(page, '#contact-interest');
await safeExpectVisible(page, '#contact-message');


});
