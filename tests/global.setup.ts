import { expect, test as setup } from '@playwright/test';

setup('Signing up the user', async ({ request }) => {
    // sign up step
    const signupResponse = await request.post(`/person/signup`, {
        data: {
            name: "Alice",
            email: "test@g2212.com",
            password: "pass",
            age: 28,
            type: "chef",
            mobile: "234-234-2345",
            address: "CA",
            salary: 60000
        }
    });
    console.log(signupResponse)
    expect(signupResponse.ok()).toBeTruthy();
    // await page.context().storageState({ path: authFile });
});