import { expect } from '@playwright/test';
import fs from 'node:fs';

// Login helper function
// Authenticates as admin and persists the JWT token to `.auth/token.json`.
// NOTE! Backend should be already running
export async function login(request) {
    const backendAddress = process.env.E2E_BACKEND_ADDRESS ?? 'localhost';
    const backendPort = process.env.E2E_BACKEND_PORT ?? '3000';

    const res = await request.post(`http://${backendAddress}:${backendPort}/auth`, {
        headers: { 'Content-Type': 'application/json' },
        data: {
            username: 'admin',
            password: 'Admin01!'
        },
        timeout: 15000,
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