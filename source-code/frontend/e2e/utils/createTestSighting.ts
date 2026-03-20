import { APIRequestContext, expect } from '@playwright/test';

import { sendRequest } from './httpClient';

// Minimal 1x1 transparent PNG used as dummy photo for form submission
const DUMMY_PHOTO = {
    name: 'photo.png',
    mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGD4DwABBQEBX4Ks6QAAAABJRU5ErkJggg==', 'base64'),
};

// Test sighting creation helper function
export async function createTestSighting(request: APIRequestContext, authToken: string) {
    const res = await sendRequest(request, 'POST', '/sightings', {
        headers: { Authorization: `Bearer ${authToken}` },
        multipart: {
            photo: DUMMY_PHOTO, // Required by backend
            title: 'E2E Sighting',
            description: 'E2E sighting description',
            latitude: '41.9028',
            longitude: '12.4964',
            address: 'E2E Address',
            username: 'E2E',
        },
    });

    expect(res.ok(), `Test sighting creation failed: ${res.status()} ${await res.text()}`).toBeTruthy();

    const body = await res.json();

    console.log('Test sighting created');

    // Return the sighting id for navigation and cleanup
    return { sightingId: body.id };
}