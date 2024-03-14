import { test, expect } from '@playwright/test';

//will give JWT token need to store
test('login', async ({ request }) => {
});

test.describe("Person API testing", () => {
  //all testcases require JWT token in requests
  //WIP how to handle them
  test('profile', async ({ request }) => {
  });
  test('list all people', async ({ request }) => {
  });
  test('Edit personal details', async ({ request }) => {
  });
  test('Deleting personal profile', async ({ request }) => {
  });
});
