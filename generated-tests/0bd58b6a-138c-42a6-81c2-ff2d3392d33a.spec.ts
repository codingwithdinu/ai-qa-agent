
import { test, expect } from '@playwright/test';

import {
  safeClick,
  safeExpectVisible
} from '../src/templates/selfHealHelpers';

test('0bd58b6a-138c-42a6-81c2-ff2d3392d33a', async ({ page }) => {

  

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
    'dinu'
  );


  // Step 8: Click element

  await safeClick(
    page,
    'text=Phone Number'
  );


  // Step 9: Click element

  await safeClick(
    page,
    '#contact-email'
  );


  // Step 10: Fill input

  await page.fill(
    '#contact-email',
    'd'
  );


  // Step 11: Fill input

  await page.fill(
    '#contact-email',
    'di'
  );


  // Step 12: Fill input

  await page.fill(
    '#contact-email',
    'din'
  );


  // Step 13: Fill input

  await page.fill(
    '#contact-email',
    'dinu'
  );


  // Step 14: Fill input

  await page.fill(
    '#contact-email',
    'dinu@'
  );


  // Step 15: Fill input

  await page.fill(
    '#contact-email',
    'dinu@g'
  );


  // Step 16: Fill input

  await page.fill(
    '#contact-email',
    'dinu@ga'
  );


  // Step 17: Fill input

  await page.fill(
    '#contact-email',
    'dinu@g'
  );


  // Step 18: Fill input

  await page.fill(
    '#contact-email',
    'dinu@ga'
  );


  // Step 19: Fill input

  await page.fill(
    '#contact-email',
    'dinu@g'
  );


  // Step 20: Fill input

  await page.fill(
    '#contact-email',
    'dinu@gm'
  );


  // Step 21: Fill input

  await page.fill(
    '#contact-email',
    'dinu@gma'
  );


  // Step 22: Fill input

  await page.fill(
    '#contact-email',
    'dinu@gmai'
  );


  // Step 23: Fill input

  await page.fill(
    '#contact-email',
    'dinu@gmail'
  );


  // Step 24: Fill input

  await page.fill(
    '#contact-email',
    'dinu@gmail.'
  );


  // Step 25: Fill input

  await page.fill(
    '#contact-email',
    'dinu@gmail.c'
  );


  // Step 26: Fill input

  await page.fill(
    '#contact-email',
    'dinu@gmail.co'
  );


  // Step 27: Fill input

  await page.fill(
    '#contact-email',
    'dinu@gmail.com'
  );


  // Step 28: Click element

  await safeClick(
    page,
    '#contact-phone'
  );


  // Step 29: Fill input

  await page.fill(
    '#contact-phone',
    '3'
  );


  // Step 30: Fill input

  await page.fill(
    '#contact-phone',
    '33'
  );


  // Step 31: Fill input

  await page.fill(
    '#contact-phone',
    '332'
  );


  // Step 32: Fill input

  await page.fill(
    '#contact-phone',
    '3324'
  );


  // Step 33: Click element

  await safeClick(
    page,
    '#contact-interest'
  );


  // Step 34: Click element

  await safeClick(
    page,
    '#contact-interest'
  );


  // Step 35: Click element

  await safeClick(
    page,
    '#contact-message'
  );


  // Step 36: Fill input

  await page.fill(
    '#contact-message',
    'e'
  );


  // Step 37: Fill input

  await page.fill(
    '#contact-message',
    'er'
  );


  // Step 38: Fill input

  await page.fill(
    '#contact-message',
    'ere'
  );


  // Step 39: Fill input

  await page.fill(
    '#contact-message',
    'erew'
  );


  // Step 40: Fill input

  await page.fill(
    '#contact-message',
    'erewr'
  );


  // Step 41: Fill input

  await page.fill(
    '#contact-message',
    'erewrr'
  );


  // Step 42: Click element

  await safeClick(
    page,
    'role=button[name="Send Message"]'
  );



  // AI Assertions

  await safeExpectVisible(page, 'role=button[name="Send Message"]');
await safeExpectVisible(page, 'role=link[name="Get Started"]');
await safeExpectVisible(page, 'text=Phone Number');


});
