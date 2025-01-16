import { test, expect } from '@playwright/test';

test('app loads without crashing', async ({ page }) => {
  // Visit the app
  await page.goto('/');
  
  // Verify the page title
  await expect(page).toHaveTitle('Nutrition Tracker');
  
  // Verify the root element exists
  await expect(page.locator('#root')).toBeVisible();
  
  // Verify no error messages are visible
  await expect(page.locator('text="Something went wrong"')).not.toBeVisible();
}); 