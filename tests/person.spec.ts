import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

// Request context is reused by all tests in the file.
let apiContext;

test('Login', async ({ request, playwright }) => {
  // login saving auth token in api context
  const loginRes = await request.post(`${process.env.API_ENDPOINT}/person/login`, {
    data: {
      email: process.env.email,
      password: process.env.password,
    }
  });
  const responseBody = await loginRes.json();
  expect(loginRes.ok()).toBeTruthy();
});

test.describe("Person API testing", () => {
  //all testcases require JWT token in requests
  //JWT token in added in apiContext
  test.beforeAll('Setup ApiContext', async ({ request, playwright }) => {
    apiContext = await playwright.request.newContext({
      // All requests we send go to this API endpoint.
      baseURL: `${process.env.API_ENDPOINT}`,
      extraHTTPHeaders: {
        'Authorization': `Bearer ${process.env.TOKEN}`,
      },
    });
  });

  test('profile', async ({ request }) => {
    const profileRes = await apiContext.get('/person/profile')
    console.log("Profile Response --> ", await profileRes.json())
    expect(profileRes.ok()).toBeTruthy();
  });

  test('list all people', async ({ request }) => {
    const profileRes = await apiContext.get('/person')
    console.log("List of people --> ", await profileRes.json())
    expect(profileRes.ok()).toBeTruthy();
  });

  test('Filtered list all people', async ({ request }) => {
    const type = ['chef', 'waiter', 'manager']
    for (const t of type) {
      const profileRes = await apiContext.get(`/person/${t}`)
      console.log(`Filtered ${t} List of people --> `, await profileRes.json())
      expect(profileRes.ok()).toBeTruthy();
    }
  });

  test('Edit personal details', async ({ request }) => {
    const profileRes = await apiContext.put('/person', {
      data: {
        name: "Playwright modified"
      }
    })
    console.log("Edited Profile Response --> ", await profileRes.json())
    expect(profileRes.ok()).toBeTruthy();
  });

  test('Deleting personal profile', async ({ request }) => {
    const profileRes = await apiContext.delete('/person')
    console.log("Delete Profile Response --> ", await profileRes.json())
    expect(profileRes.ok()).toBeTruthy();
  });
});
