import { test as setup } from '@playwright/test';
import { execSync } from 'node:child_process';

import { login } from './utils/login';

setup('Setup', async ({ request }) => {
  console.log('Configuring backend...');

  // Save original backend variables
  process.env.BACKEND_ADDRESS_BEFORE_E2E = process.env.BACKEND_ADDRESS;
  process.env.BACKEND_PORT_BEFORE_E2E = process.env.BACKEND_PORT;

  // Override backend variables for e2e before anything else runs
  process.env.BACKEND_ADDRESS = 'localhost';
  process.env.BACKEND_PORT = '3000';

  // Regenerate env.js with e2e-specific variables before tests run
  execSync('node scripts/generate-env.js dist/frontend/browser/assets/env.js', {
    cwd: new URL('..', import.meta.url).pathname,
    env: { ...process.env },
  });

  // Login as admin and save auth token for cleanup action
  await login(request);

  console.log('Backend configured');
});