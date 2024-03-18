import { expect, test as setup } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const authFile = 'playwright/.auth/user.json';

setup('Signing up the user', async ({ page, request }) => {
    // sign up step
    console.log(process.env.API_ENDPOINT)
    const signupResponse = await request.post(`${process.env.API_ENDPOINT}/person/signup`, {
        data: {
            name: "Playwright",
            email: process.env.email,
            password: process.env.password,
            age: 28,
            type: "chef",
            mobile: "234-234-2345",
            address: "CA",
            salary: 60000
        }
    });
    console.log(signupResponse)
    // expect(signupResponse.ok()).toBeTruthy();
    //if already exist user do nothing
    await page.context().storageState({ path: authFile })
    //storage state no meanging (as not setting any cookie,session)

    // saving auth token in env variable by login
    const loginRes = await request.post(`${process.env.API_ENDPOINT}/person/login`, {
        data: {
            email: process.env.email,
            password: process.env.password,
        }
    });
    const responseBody = await loginRes.json();
    expect(loginRes.ok()).toBeTruthy();
    console.log("login token", responseBody.token)
    process.env.TOKEN = responseBody.token
});