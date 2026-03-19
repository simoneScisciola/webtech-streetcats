import { test as setup } from '@playwright/test';

import { login } from './utils/login';

setup('Setup', async ({ request }) => {
  console.log('Configuring backend...');
  await login(request); // Login as admin and save auth token for cleanup action
  console.log('Backend configured');
});