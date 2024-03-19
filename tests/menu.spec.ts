import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

// Request context is reused by all tests in the file.
let apiContext;

test.describe("Menu API testing", () => {
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

    test('menu list', async ({ request }) => {
        const response = await apiContext.get('/menu')
        console.log("menu list --> ", await response.json())
        expect(response.ok()).toBeTruthy();
    });

    test('filter by taste', async ({ request }) => {
        const status = ['sweet', 'spicy', 'sour']
        for (const s of status) {
            const response = await apiContext.get(`/menu/${s}`)
            console.log(`Filtered ${s} menu list --> `, await response.json())
            expect(response.ok()).toBeTruthy();
        }
    });

    test('Create Menu', async ({ request }) => {
        //Based on login person (from JWT token have type) it will work
        //only chef and manager can create
        const response = await apiContext.post('/menu', {
            data: {
                "name": "lassi",
                "price": 130,
                "taste": "sweet",
                "is_drink": false,
                "ingredients": ["curd", "syrp"],
                "num_sales": 0
            }
        })
        console.log("Created Menu --> ", await response.json())
        expect(response.ok()).toBeTruthy();
    });

    test('Edit Menu details', async ({ request }) => {
        //Based on login person (from JWT token have type) it will work
        //only chef and manager can edit
        const response = await apiContext.get('/menu')
        const menus = await response.json()
        expect(response.ok()).toBeTruthy();
        if (menus.length > 1) {
            const menuId = menus[0]._id  //  querying first menu id from orders list
            const menu = await apiContext.put(`/menu/${menuId}`, {
                data: {
                    name: "modified"
                }
            })
            console.log("updated menu --> ", await menu.json())
            expect(menu.ok()).toBeTruthy();
        }
    });

    test('Deleting Menu', async ({ request }) => {
        //Based on login person (from JWT token have type) it will work
        //only manager can delete
        const response = await apiContext.get('/menu')
        const menus = await response.json()
        expect(response.ok()).toBeTruthy();
        if (menus.length > 1) {
            const menuId = menus[0]._id  //  querying first menu id from orders list
            const menu = await apiContext.delete(`/menu/${menuId}`)
            console.log("updated menu --> ", await menu.json())
            expect(menu.ok()).toBeTruthy();
        }
    });
});
