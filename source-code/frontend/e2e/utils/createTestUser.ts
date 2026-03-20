import { APIRequestContext, expect } from '@playwright/test';

import { sendRequest } from './httpClient';

// Test user creation helper function
export async function createTestUser(request: APIRequestContext) {
    const res = await sendRequest(request, 'POST', '/signup', {
        headers: { 'Content-Type': 'application/json' },
        data: {
            username: 'E2E',
            email: 'e2e@e2e.com',
            password: 'E2Ee2e01!'
        },
    });

    expect(res.ok(), `Test user creation failed: ${res.status()} ${await res.text()}`).toBeTruthy();

    const body = await res.json();

    console.log('Test user created');

    // Return auth state so the caller can inject it into localStorage after page.goto
    return { authToken: body.authToken, user: body.user };
}