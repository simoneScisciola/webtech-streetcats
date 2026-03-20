import { expect } from '@playwright/test';
import fs from 'node:fs';

import { sendRequest } from './httpClient';

// Login helper function
// Authenticates as admin and persists the JWT token to `.auth/token.json`
export async function adminLogin(request) {
    const res = await sendRequest(request, 'POST', '/auth', {
        headers: { 'Content-Type': 'application/json' },
        data: {
            username: 'admin',
            password: 'Admin01!'
        },
    });

    expect(res.ok(), `Login failed: ${res.status()} ${await res.text()}`).toBeTruthy();

    const body = await res.json();
    const token = body.authToken;
    if (!token) {
        throw new Error(`Login response did not contain a token: ${JSON.stringify(body)}`);
    }

    // Persist the auth token to disk for use in other tests
    fs.mkdirSync('.auth', { recursive: true });
    fs.writeFileSync('.auth/token.json', JSON.stringify({ token: token }));

    console.log('Login successful and token saved');
}