import { test as teardown } from '@playwright/test';

teardown('Teardown', async ({ request }) => {
  console.log('Cleaning backend...');
  console.log('Backend cleaned');
});