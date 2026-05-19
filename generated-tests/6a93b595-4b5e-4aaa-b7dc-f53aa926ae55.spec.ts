
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('6a93b595-4b5e-4aaa-b7dc-f53aa926ae55', async ({ page }) => {

  

  await page.goto('https://sophia.edu-it.in/');


  // Step 1: Navigate

  await page.goto('https://sophia.edu-it.in/');


  // Step 2: Click element

  await safeClick(
    page,
    'div'
  );


  // Step 3: Click element

  await safeClick(
    page,
    'role=link[name="Get Started"]'
  );


  // Step 4: Click element

  await safeClick(
    page,
    '#contact-name'
  );


  // Step 5: Fill input

  await page.fill(
    '#contact-name',
    'D'
  );


  // Step 6: Fill input

  await page.fill(
    '#contact-name',
    'Di'
  );


  // Step 7: Fill input

  await page.fill(
    '#contact-name',
    'Din'
  );


  // Step 8: Fill input

  await page.fill(
    '#contact-name',
    'Dine'
  );


  // Step 9: Fill input

  await page.fill(
    '#contact-name',
    'Dines'
  );


  // Step 10: Fill input

  await page.fill(
    '#contact-name',
    'Dinesh'
  );


  // Step 11: Fill input

  await page.fill(
    '#contact-name',
    'Dinesh '
  );


  // Step 12: Fill input

  await page.fill(
    '#contact-name',
    'Dinesh P'
  );


  // Step 13: Fill input

  await page.fill(
    '#contact-name',
    'Dinesh Pa'
  );


  // Step 14: Fill input

  await page.fill(
    '#contact-name',
    'Dinesh Paa'
  );


  // Step 15: Fill input

  await page.fill(
    '#contact-name',
    'Dinesh Paat'
  );


  // Step 16: Fill input

  await page.fill(
    '#contact-name',
    'Dinesh Paate'
  );


  // Step 17: Fill input

  await page.fill(
    '#contact-name',
    'Dinesh Paatel'
  );


  // Step 18: Click element

  await safeClick(
    page,
    '#contact-email'
  );


  // Step 19: Fill input

  await page.fill(
    '#contact-email',
    'd'
  );


  // Step 20: Fill input

  await page.fill(
    '#contact-email',
    'ds'
  );


  // Step 21: Fill input

  await page.fill(
    '#contact-email',
    'dsa'
  );


  // Step 22: Fill input

  await page.fill(
    '#contact-email',
    'dsaf'
  );


  // Step 23: Fill input

  await page.fill(
    '#contact-email',
    'dsafd'
  );


  // Step 24: Fill input

  await page.fill(
    '#contact-email',
    'dsafds'
  );


  // Step 25: Fill input

  await page.fill(
    '#contact-email',
    'dsafdsf'
  );


  // Step 26: Fill input

  await page.fill(
    '#contact-email',
    'dsafdsfd'
  );


  // Step 27: Fill input

  await page.fill(
    '#contact-email',
    'dsafdsfda'
  );


  // Step 28: Fill input

  await page.fill(
    '#contact-email',
    'dsafdsfdaf'
  );


  // Step 29: Fill input

  await page.fill(
    '#contact-email',
    'dsafdsfdafd'
  );


  // Step 30: Click element

  await safeClick(
    page,
    '#contact-phone'
  );


  // Step 31: Fill input

  await page.fill(
    '#contact-phone',
    'd'
  );


  // Step 32: Fill input

  await page.fill(
    '#contact-phone',
    'df'
  );


  // Step 33: Fill input

  await page.fill(
    '#contact-phone',
    'dfd'
  );


  // Step 34: Fill input

  await page.fill(
    '#contact-phone',
    'dfds'
  );


  // Step 35: Fill input

  await page.fill(
    '#contact-phone',
    'dfdsf'
  );


  // Step 36: Fill input

  await page.fill(
    '#contact-phone',
    'dfdsfd'
  );


  // Step 37: Fill input

  await page.fill(
    '#contact-phone',
    'dfdsfdf'
  );


  // Step 38: Click element

  await safeClick(
    page,
    '#contact-interest'
  );


  // Step 39: Click element

  await safeClick(
    page,
    '#contact-interest'
  );


  // Step 40: Click element

  await safeClick(
    page,
    '#contact-message'
  );


  // Step 41: Fill input

  await page.fill(
    '#contact-message',
    'd'
  );


  // Step 42: Fill input

  await page.fill(
    '#contact-message',
    'df'
  );


  // Step 43: Fill input

  await page.fill(
    '#contact-message',
    'dfa'
  );


  // Step 44: Fill input

  await page.fill(
    '#contact-message',
    'dfas'
  );


  // Step 45: Fill input

  await page.fill(
    '#contact-message',
    'dfasf'
  );


  // Step 46: Fill input

  await page.fill(
    '#contact-message',
    'dfasfa'
  );


  // Step 47: Fill input

  await page.fill(
    '#contact-message',
    'dfasfad'
  );


  // Step 48: Fill input

  await page.fill(
    '#contact-message',
    'dfasfads'
  );


  // Step 49: Fill input

  await page.fill(
    '#contact-message',
    'dfasfadsf'
  );


  // Step 50: Fill input

  await page.fill(
    '#contact-message',
    'dfasfadsfd'
  );


  // Step 51: Fill input

  await page.fill(
    '#contact-message',
    'dfasfadsfds'
  );


  // Step 52: Fill input

  await page.fill(
    '#contact-message',
    'dfasfadsfdsf'
  );


  // Step 53: Click element

  await safeClick(
    page,
    'role=button[name="Send Message"]'
  );



  // AI Assertions

  await safeExpectVisible(page, 'role=button[name="Send Message"]');
await safeExpectVisible(page, 'role=link[name="Get Started"]');
await safeExpectVisible(page, "div");


});
