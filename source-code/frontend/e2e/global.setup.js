import { test as setup } from '@playwright/test';
import { execSync } from 'child_process';

import { login } from './utils/login';

setup('Setup', async ({ request }) => {
  console.log('Configuring backend...');

  // Regenerate env.js with e2e-specific variables before tests run
  execSync('node scripts/generate-env.js', {
    cwd: '..', // root of the frontend project
    env: { ...process.env, BACKEND_ADDRESS: 'localhost', BACKEND_PORT: '3000' },
  });

  // Login as admin and save auth token for cleanup action
  await login(request);

  console.log('Backend configured');
});