import { test as teardown } from '@playwright/test';
import { execSync } from 'node:child_process';

teardown('Teardown', async ({ request }) => {
  console.log('Cleaning backend...');

  // Restore original backend variables
  process.env.BACKEND_ADDRESS = process.env.BACKEND_ADDRESS_BEFORE_E2E;
  process.env.BACKEND_PORT = process.env.BACKEND_PORT_BEFORE_E2E;

  // Delete temporary variables
  process.env.BACKEND_ADDRESS_BEFORE_E2E = undefined;
  process.env.BACKEND_PORT_BEFORE_E2E = undefined;

  // Restore env.js with original environment variables
  execSync('node scripts/generate-env.js dist/frontend/browser/assets/env.js', {
    cwd: new URL('..', import.meta.url).pathname,
  });

  console.log('Backend cleaned');
});