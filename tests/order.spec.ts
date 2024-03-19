import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

// Request context is reused by all tests in the file.
let apiContext;

test.describe("Order API testing", () => {
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

    test('order list', async ({ request }) => {
        const response = await apiContext.get('/order')
        console.log("Order list --> ", await response.json())
        expect(response.ok()).toBeTruthy();
    });

    test('filter status of order list', async ({ request }) => {
        const status = ['cooking', 'delivered']
        for (const s of status) {
            const response = await apiContext.get(`/order/status/${s}`)
            console.log(`Filtered ${s} Order list --> `, await response.json())
            expect(response.ok()).toBeTruthy();
        }
    });

    test('Create Order', async ({ request }) => {
        //NOTE - run this testcases after running person testcases (as need to create signup again to get person id)
        const personId = process.env.personId;
        const response = await apiContext.get('/menu')
        const menus = await response.json()
        expect(response.ok()).toBeTruthy();
        if (menus.length > 1 && personId) {
            const menuId = menus[0]._id  //  querying first menu id from orders list
            const currDate = new Date()
            const order = await apiContext.post(`/order`, {
                data: {
                    placed_at: currDate.toISOString(),
                    placed_by: personId,
                    item: menuId,
                    quantity: "5",
                    status: "cooking"
                }
            })
            console.log("created order is --> ", await order.json())
            expect(order.ok()).toBeTruthy();
        }

    });

    test('status of order ID', async ({ request }) => {
        const response = await apiContext.get('/order')
        const orders = await response.json()
        expect(response.ok()).toBeTruthy();
        if (orders.length > 1) {
            const orderId = orders[0]._id  //  querying first order id from orders list
            const order = await apiContext.get(`/order/${orderId}`)
            console.log("Status --> ", await order.json())
            expect(order.ok()).toBeTruthy();
        }
    });

    test('Edit Order details', async ({ request }) => {
        const response = await apiContext.get('/order')
        const orders = await response.json()
        expect(response.ok()).toBeTruthy();
        if (orders.length > 1) {
            const orderId = orders[0]._id  //  querying first order id from orders list
            const order = await apiContext.put(`/order/${orderId}`, {
                data: {
                    status: 'delivered'
                }
            })
            console.log("updated order --> ", await order.json())
            expect(order.ok()).toBeTruthy();
        }
    });

    test('Deleting Order', async ({ request }) => {
        const response = await apiContext.get('/order')
        const orders = await response.json()
        expect(response.ok()).toBeTruthy();
        if (orders.length > 1) {
            const orderId = orders[0]._id  //  querying first order id from orders list
            const order = await apiContext.delete(`/order/${orderId}`)
            console.log("deleted order --> ", await order.json())
            expect(order.ok()).toBeTruthy();
        }
    });
});
